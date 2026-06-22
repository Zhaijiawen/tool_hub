# Image Compression — Code Examples

## Using browser-image-compression

```javascript
// Dynamic import — keeps the heavy library out of the initial bundle
async function compressImage(file, quality = 0.8) {
  const imageCompression = (await import('browser-image-compression')).default

  const options = {
    maxSizeMB: 2,                    // Cap at 2MB
    maxWidthOrHeight: 2048,           // Don't exceed 2048px on either side
    useWebWorker: true,               // Off the main thread
    initialQuality: quality,
    onProgress: (percentage) => {
      console.log(`Compressing: ${percentage}%`)
    }
  }

  try {
    const compressedFile = await imageCompression(file, options)
    console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Saved: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`)
    return compressedFile
  } catch (error) {
    console.error('Compression failed:', error)
    throw error
  }
}
```

The dynamic import is key here — `browser-image-compression` is a chunky library and you don't want it slowing down your initial page load.

## Vue 3 integration

```vue
<template>
  <div>
    <n-upload
      accept="image/*"
      :multiple="true"
      :max="10"
      :show-file-list="false"
      @change="handleUpload"
    >
      <n-upload-dragger>
        <div>Drop images here or click to browse</div>
      </n-upload-dragger>
    </n-upload>

    <div v-for="img in images" :key="img.id">
      <img :src="img.previewUrl" />
      <span>{{ img.originalSize }} → {{ img.compressedSize }}</span>
      <n-button @click="downloadImage(img)">Download</n-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const quality = ref(0.8)
const images = ref([])

async function handleUpload({ fileList }) {
  for (const uploadFile of fileList) {
    const file = uploadFile.file
    if (!file) continue

    const compressed = await compressImage(file, quality.value)
    const previewUrl = URL.createObjectURL(compressed)

    images.value.push({
      id: Date.now(),
      name: file.name,
      originalSize: formatSize(file.size),
      compressedSize: formatSize(compressed.size),
      compressedFile: compressed,
      previewUrl
    })
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function downloadImage(img) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(img.compressedFile)
  link.download = `compressed_${img.name}`
  link.click()
}
</script>
```

## Batch compress and ZIP download

```javascript
// Use JSZip to bundle multiple compressed images
async function downloadAllAsZip(images) {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  for (const img of images) {
    const arrayBuffer = await img.compressedFile.arrayBuffer()
    zip.file(`compressed_${img.name}`, arrayBuffer)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(zipBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = 'compressed_images.zip'
  link.click()

  URL.revokeObjectURL(url)
}
```

Again, note the dynamic import for `jszip` — don't ship it in the initial bundle.

## Canvas-based compression (zero dependencies)

```javascript
// If you want compression with no third-party library at all
function compressImageWithCanvas(file, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (blob) {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
          } else {
            reject(new Error('Canvas toBlob returned null'))
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}
```

This approach converts everything to JPEG. Fine for photos, not great if you need transparency. The Canvas API is well-supported everywhere, so no compatibility worries.

## Real-world results

| Scenario | Original | Quality 80% | Quality 60% |
|----------|---------|------------|------------|
| Phone photo | 8MB | 1.2MB | 700KB |
| Product shot | 15MB | 2.5MB | 1.5MB |
| Screenshot PNG | 2MB | 1.8MB | 1.5MB |
| Design export PNG | 5MB | 4MB | 3.5MB |
| Thumbnail JPG | 500KB | 80KB | 50KB |

Some practical takeaways: 80% quality is the sweet spot for most web use — your visitors won't see the difference. PNG screenshots don't compress much with quality reduction; if you need them smaller, convert to JPG first. Always keep originals around — you can't un-compress an image.

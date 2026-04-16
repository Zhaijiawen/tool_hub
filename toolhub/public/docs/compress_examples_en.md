# Image Compression - Examples

## Example 1: Using the browser-image-compression Library

```javascript
// Dynamic import to avoid loading the large dependency on initial page load
async function compressImage(file, quality = 0.8) {
  const imageCompression = (await import('browser-image-compression')).default

  const options = {
    maxSizeMB: 2,                    // Max 2MB
    maxWidthOrHeight: 2048,           // Max dimension 2048px
    useWebWorker: true,               // Use WebWorker (non-blocking)
    initialQuality: quality,          // Initial quality
    onProgress: (percentage) => {     // Progress callback
      console.log(`Compression progress: ${percentage}%`)
    }
  }

  try {
    const compressedFile = await imageCompression(file, options)
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`Ratio: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`)
    return compressedFile
  } catch (error) {
    console.error('Compression failed:', error)
    throw error
  }
}
```

---

## Example 2: Integrating Image Compression in Vue 3

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
        <div>Drag images here or click to select</div>
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

---

## Example 3: Batch Compress and Download as ZIP

```javascript
// Use JSZip to package multiple compressed images into a zip file
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

---

## Example 4: Manual Compression Using Canvas API

```javascript
// Simple image compression implementation without third-party libraries
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
            reject(new Error('Canvas toBlob failed'))
          }
        },
        'image/jpeg',
        quality // 0.0 - 1.0
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Image load failed'))
    }

    img.src = url
  })
}
```

---

## Practical Compression Results Reference

| Scenario | Original | Quality 80% | Quality 60% | Notes |
|----------|---------|------------|------------|-------|
| Phone photo | 8MB | 1.2MB | 700KB | Good for sharing |
| Product photography | 15MB | 2.5MB | 1.5MB | E-commerce display |
| Screenshot PNG | 2MB | 1.8MB | 1.5MB | PNG compression is limited |
| Design export PNG | 5MB | 4MB | 3.5MB | Consider converting to JPG |
| Thumbnail JPG | 500KB | 80KB | 50KB | Significant compression effect |

## Best Practice Recommendations

1. **80% quality is usually sufficient**: The human eye can barely distinguish 80% from 100% quality, but file size can be reduced by 50-70%
2. **Consider converting PNG to JPG**: If the image doesn't need a transparent background, converting PNG to JPG before compressing results in much smaller files
3. **Choose quality based on use case**:
   - Print purposes: Keep 90%+ quality
   - Web display: 70-85% is enough
   - Thumbnails: 50-70%
4. **Keep the original**: Compression is irreversible — always keep a backup of important images


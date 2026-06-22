# 图片压缩 — 代码示例

## 使用 browser-image-compression

```javascript
// 动态导入——别让这个大库拖慢首屏
async function compressImage(file, quality = 0.8) {
  const imageCompression = (await import('browser-image-compression')).default

  const options = {
    maxSizeMB: 2,                    // 上限 2MB
    maxWidthOrHeight: 2048,           // 边长不超过 2048px
    useWebWorker: true,               // 后台线程，不卡主线程
    initialQuality: quality,
    onProgress: (percentage) => {
      console.log(`压缩进度: ${percentage}%`)
    }
  }

  try {
    const compressedFile = await imageCompression(file, options)
    console.log(`原始: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`压缩后: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`节省: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`)
    return compressedFile
  } catch (error) {
    console.error('压缩失败:', error)
    throw error
  }
}
```

注意用动态 `import()` 而不是静态导入——`browser-image-compression` 体积不小，别让它影响首屏加载。

## Vue 3 集成

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
        <div>拖入图片或点击选择</div>
      </n-upload-dragger>
    </n-upload>

    <div v-for="img in images" :key="img.id">
      <img :src="img.previewUrl" />
      <span>{{ img.originalSize }} → {{ img.compressedSize }}</span>
      <n-button @click="downloadImage(img)">下载</n-button>
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

## 批量压缩打包 ZIP

```javascript
// 用 JSZip 把多张压缩图打包
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

`jszip` 也是动态导入，别打进首屏 bundle。

## Canvas API 实现（零依赖）

```javascript
// 不用任何第三方库的压缩方案
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
            reject(new Error('Canvas toBlob 返回 null'))
          }
        },
        'image/jpeg',
        quality
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('图片加载失败'))
    }

    img.src = url
  })
}
```

这种方案会把所有图转成 JPEG。适合照片，需要透明通道的话不建议用。Canvas API 兼容性很好，所有现代浏览器都支持。

## 实测压缩效果

| 场景 | 原图 | 80% 质量 | 60% 质量 |
|------|------|---------|---------|
| 手机拍照 | 8MB | 1.2MB | 700KB |
| 产品摄影 | 15MB | 2.5MB | 1.5MB |
| 网页截图 PNG | 2MB | 1.8MB | 1.5MB |
| 设计稿 PNG | 5MB | 4MB | 3.5MB |
| 缩略图 JPG | 500KB | 80KB | 50KB |

几个实用经验：80% 质量是网页场景的甜点，肉眼很难看出和原图的区别但体积能砍掉一半以上。PNG 截图靠调质量压不了多少，需要更小就先转 JPG。原始文件一定要留着，压缩不可逆。

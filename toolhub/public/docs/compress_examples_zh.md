# 图片压缩 - 代码示例

## 示例 1：使用 browser-image-compression 库

```javascript
// 动态导入（避免首屏加载大依赖）
async function compressImage(file, quality = 0.8) {
  const imageCompression = (await import('browser-image-compression')).default

  const options = {
    maxSizeMB: 2,                    // 最大 2MB
    maxWidthOrHeight: 2048,           // 最大边长 2048px
    useWebWorker: true,               // 使用 WebWorker（不阻塞 UI）
    initialQuality: quality,          // 初始质量
    onProgress: (percentage) => {     // 进度回调
      console.log(`压缩进度: ${percentage}%`)
    }
  }

  try {
    const compressedFile = await imageCompression(file, options)
    console.log(`原始大小: ${(file.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`压缩后: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`压缩率: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`)
    return compressedFile
  } catch (error) {
    console.error('压缩失败:', error)
    throw error
  }
}
```

---

## 示例 2：在 Vue 3 中集成图片压缩

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

---

## 示例 3：批量压缩并打包下载

```javascript
// 使用 JSZip 将多张压缩图片打包成 zip
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

## 示例 4：Canvas API 手动实现压缩

```javascript
// 不依赖第三方库的简单图片压缩实现
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

## 实际压缩效果参考

| 场景 | 原图 | 质量 80% | 质量 60% | 备注 |
|------|------|---------|---------|------|
| 手机拍照 | 8MB | 1.2MB | 700KB | 适合分享 |
| 产品摄影 | 15MB | 2.5MB | 1.5MB | 电商展示 |
| 网页截图 PNG | 2MB | 1.8MB | 1.5MB | PNG 压缩有限 |
| 设计稿 PNG | 5MB | 4MB | 3.5MB | 建议转 JPG |
| 缩略图 JPG | 500KB | 80KB | 50KB | 压缩效果显著 |

## 最佳实践建议

1. **80% 质量通常足够**：人眼很难区分 80% 和 100% 质量的差别，但体积可以减少 50-70%
2. **PNG 考虑转 JPG**：如果图片不需要透明背景，将 PNG 转为 JPG 再压缩，体积更小
3. **根据用途选择质量**：
   - 打印用途：保持 90%+ 质量
   - 网页展示：70-85% 即可
   - 缩略图：50-70%
4. **保留原图**：压缩是不可逆的，重要图片务必保留原始备份


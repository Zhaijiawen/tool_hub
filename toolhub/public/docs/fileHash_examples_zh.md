# 文件哈希校验 - 代码示例

## 示例 1：Ubuntu 系统镜像验证

### 场景说明
从官方网站下载 Ubuntu 系统镜像后，需要验证下载是否完整。

**官方提供的哈希值（SHA-256）：**
```
b5f2fec6e2d86da19ab7ea4b8df8afb4c7d2f0b8f4e3a6d7b9c0f1e2a3b4c5d6
```

**操作步骤：**
1. 将下载的 `.iso` 文件拖入哈希校验工具
2. 等待 SHA-256 计算完成
3. 将官方哈希值粘贴到校验框
4. 查看是否显示绿色 ✅

---

## 示例 2：在代码中使用 Web Crypto API

```javascript
// 使用 Web Crypto API 计算文件的 SHA-256（浏览器端）
async function calculateSHA256(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

// 使用示例
const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const hash = await calculateSHA256(file)
  console.log(`SHA-256: ${hash}`)
})
```

---

## 示例 3：大文件分片计算 SHA-256

```javascript
// 使用 SubtleCrypto 的流式处理方式
async function calculateHashChunked(file, algorithm = 'SHA-256') {
  const CHUNK_SIZE = 2 * 1024 * 1024 // 2MB 每块

  // 由于 SubtleCrypto 不直接支持流式，需要读完整个文件
  // 对于超大文件，可以使用 incremental 方式或 spark-md5 for MD5
  const arrayBuffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest(algorithm, arrayBuffer)

  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// 带进度显示的版本（MD5 使用 spark-md5）
async function calculateMD5WithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const SparkMD5 = window.SparkMD5 // 或动态导入
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const chunkSize = 2 * 1024 * 1024 // 2MB
    let currentChunk = 0
    const chunks = Math.ceil(file.size / chunkSize)

    reader.onload = (e) => {
      spark.append(e.target.result)
      currentChunk++
      onProgress?.(Math.round((currentChunk / chunks) * 100))

      if (currentChunk < chunks) {
        loadNext()
      } else {
        resolve(spark.end())
      }
    }

    reader.onerror = reject

    function loadNext() {
      const start = currentChunk * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      reader.readAsArrayBuffer(file.slice(start, end))
    }

    loadNext()
  })
}
```

---

## 示例 4：Node.js 后端文件哈希计算

```javascript
const crypto = require('crypto')
const fs = require('fs')

// 计算文件的多种哈希值
async function calculateFileHashes(filePath) {
  return new Promise((resolve, reject) => {
    const algorithms = ['md5', 'sha1', 'sha256', 'sha512']
    const hashes = {}

    // 为每种算法创建一个 hash 对象
    const hashObjects = algorithms.reduce((acc, algo) => {
      acc[algo] = crypto.createHash(algo)
      return acc
    }, {})

    const stream = fs.createReadStream(filePath)

    stream.on('data', (chunk) => {
      algorithms.forEach(algo => {
        hashObjects[algo].update(chunk)
      })
    })

    stream.on('end', () => {
      algorithms.forEach(algo => {
        hashes[algo] = hashObjects[algo].digest('hex')
      })
      resolve(hashes)
    })

    stream.on('error', reject)
  })
}

// 使用示例
const hashes = await calculateFileHashes('./large-file.zip')
console.log('MD5:    ', hashes.md5)
console.log('SHA-1:  ', hashes.sha1)
console.log('SHA-256:', hashes.sha256)
console.log('SHA-512:', hashes.sha512)
```

---

## 示例 5：常见文件的哈希验证来源

| 软件 | 哈希验证页面位置 |
|------|----------------|
| Ubuntu | https://releases.ubuntu.com → SHA256SUMS 文件 |
| Debian | https://cdimage.debian.org → SHA512SUMS 文件 |
| Python | python.org 下载页 → "GPG Keys & Checksums" |
| Git | git-scm.com 下载页旁边 |
| Node.js | nodejs.org → SHASUMS256.txt |

## 哈希值格式对照

| 算法 | 哈希值示例（字符串"test"） |
|------|--------------------------|
| MD5 | `098f6bcd4621d373cade4e832627b4f6` |
| SHA-1 | `a94a8fe5ccb19ba61c4c0873d391e987982fbbd3` |
| SHA-256 | `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08` |
| SHA-512 | `ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27` + ... |


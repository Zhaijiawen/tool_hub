# 文件哈希校验 - 代码示例

## Ubuntu 系统镜像验证

假设你刚下载了一个 Ubuntu ISO。下载页面给出了这样的 SHA-256 哈希：

```
b5f2fec6e2d86da19ab7ea4b8df8afb4c7d2f0b8f4e3a6d7b9c0f1e2a3b4c5d6
```

把 ISO 拖进工具，等 SHA-256 跑完，把官方哈希粘贴到校验框。变绿就稳了。如果不匹配，说明下载过程中文件损坏了（或者更糟，被篡改了）。不管哪种情况，别拿这个文件安装，重新下载。

---

## 用 Web Crypto API 算文件哈希

下面是一个干净的浏览器端 SHA-256 实现。注意 `file.arrayBuffer()` 会把整个文件读进内存，所以几百 MB 以内没问题，再大就可能吃力了。

```javascript
// 浏览器端 SHA-256，不依赖任何后端
async function calculateSHA256(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

// 绑定到文件 input
const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const hash = await calculateSHA256(file)
  console.log(`SHA-256: ${hash}`)
})
```

每个字节后面的 `padStart(2, '0')` 很容易漏掉，漏了你会得到 `a` 而不是 `0a` 这种残缺的十六进制字符串。

---

## 大文件分片 MD5 带进度

MD5 不能用 SubtleCrypto，得靠 spark-md5。spark-md5 的好处是支持增量哈希 -- 边读边喂，可以实时显示进度：

```javascript
// 带进度的 MD5，利用 spark-md5 的增量 API
async function calculateMD5WithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const chunkSize = 2 * 1024 * 1024 // 每块 2MB
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

2MB 一块是个比较合理的值 -- 够小让进度条平滑，够大不会因为太多读取操作产生额外开销。

---

## Node.js 流式哈希

服务端用 Node 的 `crypto` 模块，原生支持流式。把文件读流同时 pipe 到多个哈希对象，比多次读文件高效得多：

```javascript
const crypto = require('crypto')
const fs = require('fs')

async function calculateFileHashes(filePath) {
  return new Promise((resolve, reject) => {
    const algorithms = ['md5', 'sha1', 'sha256', 'sha512']
    const hashes = {}

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

// 使用
const hashes = await calculateFileHashes('./large-file.zip')
console.log('MD5:    ', hashes.md5)
console.log('SHA-1:  ', hashes.sha1)
console.log('SHA-256:', hashes.sha256)
console.log('SHA-512:', hashes.sha512)
```

这段代码的巧妙之处：文件只从磁盘读一次。四个哈希对象同时处理流过的每个数据块。对于一个 4GB 的文件，这跟你读四次文件（16GB）的效率差距很明显。

---

## 去哪里找官方哈希值

| 软件 | 查找位置 |
|------|---------|
| Ubuntu | releases.ubuntu.com，找 SHA256SUMS 文件 |
| Debian | cdimage.debian.org，找 SHA512SUMS 文件 |
| Python | python.org 下载页，"GPG Keys & Checksums" 区域 |
| Git | git-scm.com，下载链接旁边 |
| Node.js | nodejs.org，找 SHASUMS256.txt |

一个实用建议：如果你从镜像站下载，一定要拿官方站的哈希来比对，别用镜像站的。被黑的镜像可以同时提供篡改过的文件和匹配的哈希值。

## "test" 字符串的哈希参考值

快速自检 -- 如果你对字符串 "test" 算哈希，应该得到：

| 算法 | 哈希值 |
|------|--------|
| MD5 | `098f6bcd4621d373cade4e832627b4f6` |
| SHA-1 | `a94a8fe5ccb19ba61c4c0873d391e987982fbbd3` |
| SHA-256 | `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08` |
| SHA-512 | `ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27...` |

用来验证你的哈希代码跑得对不对。

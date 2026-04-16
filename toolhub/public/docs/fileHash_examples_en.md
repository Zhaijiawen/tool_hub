# File Hash Verification - Examples

## Example 1: Verifying a Linux ISO Image

### Scenario
After downloading an Ubuntu ISO from the official website, you need to verify the download is complete and unmodified.

**Official SHA-256 hash:**
```
b5f2fec6e2d86da19ab7ea4b8df8afb4c7d2f0b8f4e3a6d7b9c0f1e2a3b4c5d6
```

**Steps:**
1. Drag the downloaded `.iso` file into the hash verification tool
2. Wait for SHA-256 computation to complete
3. Paste the official hash value into the verification box
4. Check if it shows green ✅

---

## Example 2: Web Crypto API in Code

```javascript
// Calculate SHA-256 of a file using Web Crypto API (browser)
async function calculateSHA256(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

// Usage example
const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const hash = await calculateSHA256(file)
  console.log(`SHA-256: ${hash}`)
})
```

---

## Example 3: Chunked MD5 Calculation with Progress

```javascript
// MD5 with progress using spark-md5
async function calculateMD5WithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const chunkSize = 2 * 1024 * 1024 // 2MB per chunk
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

## Example 4: Node.js Backend File Hash Calculation

```javascript
const crypto = require('crypto')
const fs = require('fs')

// Calculate multiple hash values for a file
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

// Usage
const hashes = await calculateFileHashes('./large-file.zip')
console.log('MD5:    ', hashes.md5)
console.log('SHA-1:  ', hashes.sha1)
console.log('SHA-256:', hashes.sha256)
console.log('SHA-512:', hashes.sha512)
```

---

## Example 5: Where to Find Official Hash Values

| Software | Where to Find Hash Values |
|----------|--------------------------|
| Ubuntu | https://releases.ubuntu.com → SHA256SUMS file |
| Debian | https://cdimage.debian.org → SHA512SUMS file |
| Python | python.org downloads page → "GPG Keys & Checksums" |
| Git | git-scm.com download page (next to download link) |
| Node.js | nodejs.org → SHASUMS256.txt |

## Hash Value Format Reference

| Algorithm | Hash value for string "test" |
|-----------|------------------------------|
| MD5 | `098f6bcd4621d373cade4e832627b4f6` |
| SHA-1 | `a94a8fe5ccb19ba61c4c0873d391e987982fbbd3` |
| SHA-256 | `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08` |
| SHA-512 | `ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27...` |


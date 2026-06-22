# File Hash Verification - Examples

## Verifying a Linux ISO download

Say you just downloaded an Ubuntu ISO. The download page gives you this SHA-256 hash:

```
b5f2fec6e2d86da19ab7ea4b8df8afb4c7d2f0b8f4e3a6d7b9c0f1e2a3b4c5d6
```

Drag the ISO into the tool, wait for SHA-256 to finish, paste the hash into the verification box. If it turns green, you're golden. If not, the download got corrupted somewhere along the way (or worse, someone tampered with it). Either way, don't install from that file -- redownload.

---

## Using Web Crypto API for file hashing

Here's a clean browser-side SHA-256 implementation. The key thing to note: `file.arrayBuffer()` reads the whole file into memory, so this works fine for files up to a few hundred MB but will struggle with really large ones.

```javascript
// Calculate SHA-256 of a file -- browser only, no backend
async function calculateSHA256(file) {
  const buffer = await file.arrayBuffer()
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
  return hashHex
}

// Hook it up to a file input
const fileInput = document.getElementById('fileInput')
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0]
  if (!file) return

  const hash = await calculateSHA256(file)
  console.log(`SHA-256: ${hash}`)
})
```

The `padStart(2, '0')` on each byte is important -- without it you get broken hex strings like `a` instead of `0a`.

---

## Chunked MD5 with progress tracking

For MD5 you can't use SubtleCrypto, so you reach for spark-md5. The nice thing about spark-md5 is it supports incremental hashing -- you feed it chunks as you read them, which means you can show real progress. Here's how that looks:

```javascript
// MD5 with progress -- uses spark-md5's incremental API
async function calculateMD5WithProgress(file, onProgress) {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const chunkSize = 2 * 1024 * 1024 // 2MB chunks
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

The 2MB chunk size is a reasonable default -- small enough for smooth progress updates, large enough to avoid overhead from too many read operations.

---

## Node.js: stream-based hashing

On the server side, Node's `crypto` module supports streaming natively. You pipe the file read stream through multiple hash objects simultaneously -- way more efficient than reading the file multiple times:

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

// Usage
const hashes = await calculateFileHashes('./large-file.zip')
console.log('MD5:    ', hashes.md5)
console.log('SHA-1:  ', hashes.sha1)
console.log('SHA-256:', hashes.sha256)
console.log('SHA-512:', hashes.sha512)
```

The neat part about this approach: the file only gets read once from disk. All four hash objects process the same chunks as they stream through. For a 4GB file, that's the difference between reading 4GB vs 16GB from disk.

---

## Where to find official hashes

| Software | Where to look |
|----------|--------------|
| Ubuntu | releases.ubuntu.com -- look for SHA256SUMS |
| Debian | cdimage.debian.org -- SHA512SUMS file |
| Python | python.org downloads page, "GPG Keys & Checksums" section |
| Git | git-scm.com, right next to the download link |
| Node.js | nodejs.org -- SHASUMS256.txt |

Pro tip: if you're downloading from a mirror, always cross-check the hash against the official site, not the mirror. A compromised mirror can serve both a tampered file and a matching hash.

## Hash output reference for "test"

Quick sanity check -- if you hash the string "test" you should get:

| Algorithm | Hash |
|-----------|------|
| MD5 | `098f6bcd4621d373cade4e832627b4f6` |
| SHA-1 | `a94a8fe5ccb19ba61c4c0873d391e987982fbbd3` |
| SHA-256 | `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08` |
| SHA-512 | `ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27...` |

Useful for verifying your hashing code is working correctly.

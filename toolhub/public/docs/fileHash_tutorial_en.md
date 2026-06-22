# File Hash Verification - Tutorial

Everything runs locally in your browser -- no file uploads, no server round-trips. Your data stays on your machine.

## How to use it

### Pick a file

Two ways to get a file in: drag and drop it onto the upload area, or click to browse. Works with any file type. The sweet spot is under 500MB -- bigger files work but you'll wait longer.

### Wait for the hashing

The tool kicks off all four algorithms automatically once you drop a file:

- **MD5** runs through the spark-md5 library (since SubtleCrypto doesn't support it)
- **SHA-1, SHA-256, SHA-512** all go through the browser's native Web Crypto API

You'll see a progress bar. Large files (a few GB) might take 10-30 seconds. Grab a coffee.

### Read the results

When it's done, you get something like:

```
File name: ubuntu-22.04-desktop-amd64.iso
File size: 3.71 GB

MD5:    a435f6f393dda581172490eda9f683c1
SHA-1:  c396e956b6a69b3b17b05b78e37f6a5e8e4c37...
SHA-256: b5f2fec6e2d86da19ab7ea4b8df8afb4c7d2f0b8f...
SHA-512: 3c8b5b0e8a54d3b0e6b4e7b31f9d0e3a4c9e7c1f...
```

### Verify against a known hash (optional)

If you've got an expected hash from the software vendor, paste it into the verification box. The tool figures out which algorithm it is based on the hash length (32 chars = MD5, 40 = SHA-1, 64 = SHA-256, 128 = SHA-512), compares it with the computed value, and shows you a green check or a red X. Green means the file's good. Red means something's off -- could be corruption, could be tampering.

## Real-world workflows

**Verifying a downloaded installer:** Download the file, find the SHA-256 hash on the vendor's download page (it's usually right next to the link), drag the file in, paste the hash, confirm the green check.

**Checking backup integrity:** Hash your backup files, save the hash values somewhere. Six months later when you need to restore, hash them again and compare. If the hashes still match, your backups are intact.

**Detecting file changes:** Hash a config file before and after a deployment. Different hash = something changed. Quick and dirty but effective.

## Quick reference: hash lengths

| Algorithm | Output | Hex chars |
|-----------|--------|-----------|
| MD5 | 128 bits | 32 |
| SHA-1 | 160 bits | 40 |
| SHA-256 | 256 bits | 64 |
| SHA-512 | 512 bits | 128 |

This is also how the tool auto-detects which algorithm a pasted hash belongs to -- count the hex characters.

## Things to know

All computation is client-side. Your files never touch a server. For files over 500MB, be patient -- the chunked reading approach is memory-efficient but CPU-bound. Case doesn't matter in hash comparison -- uppercase, lowercase, mixed, all treated the same. And remember: SHA-256 is your daily driver for file integrity; MD5 and SHA-1 are fine for casual checksums but don't bet security on them.

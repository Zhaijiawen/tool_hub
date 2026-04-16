# File Hash Verification - Tutorial

## Getting Started

The file hash verification tool computes file hashes locally in your browser. Files are never uploaded to any server, ensuring complete data privacy.

## Basic Usage

### Step 1: Select a File

There are two ways to select a file:
- **Drag and drop**: Drag the file directly into the upload area on the page
- **Click to select**: Click the upload area and choose a file in the file dialog

All file types are supported. File size should ideally be under 500MB.

### Step 2: Wait for Computation

After selecting a file, the tool automatically starts computing all hash values:
- **MD5**: Computed using the spark-md5 library
- **SHA-1**: Computed using the Web Crypto API
- **SHA-256**: Computed using the Web Crypto API
- **SHA-512**: Computed using the Web Crypto API

A progress bar shows the current calculation progress. Large files may take a few seconds to a few dozen seconds.

### Step 3: View Hash Values

Once computation is complete, the page displays the hash values for each algorithm, for example:

```
File name: ubuntu-22.04-desktop-amd64.iso
File size: 3.71 GB

MD5:    a435f6f393dda581172490eda9f683c1
SHA-1:  c396e956b6a69b3b17b05b78e37f6a5e8e4c37...
SHA-256: b5f2fec6e2d86da19ab7ea4b8df8afb4c7d2f0b8f...
SHA-512: 3c8b5b0e8a54d3b0e6b4e7b31f9d0e3a4c9e7c1f...
```

### Step 4: Verify Hash (Optional)

If you have an expected hash value from an official source, enter it in the "Verification" area:

1. Paste the official hash value into the input box
2. The system automatically identifies the algorithm type (based on hash length)
3. It compares with the computed result and displays:
   - ✅ **Green**: Hash matches — file is intact
   - ❌ **Red**: Hash does not match — file may be corrupted or tampered with

## Practical Use Cases

### Verify Software Downloads

1. Download a software installer from the official website
2. Find the file's SHA-256 hash on the download page (usually next to the download link)
3. Drag the downloaded file into this tool
4. Paste the official hash value into the verification box
5. Confirm it matches ✅

### Verify Backup File Integrity

Drag your backup file into the tool and record the SHA-256 value. When you need to verify the backup later, compute the hash again and compare — confirming the backup hasn't been corrupted.

### Check if a File Has Been Modified

Compute and record a file's hash value. If a later comparison shows a different hash, the file contents have been changed.

## Hash Length Reference

| Algorithm | Output Length | Hex Characters |
|-----------|-------------|---------------|
| MD5 | 128 bits | 32 characters |
| SHA-1 | 160 bits | 40 characters |
| SHA-256 | 256 bits | 64 characters |
| SHA-512 | 512 bits | 128 characters |

## Important Notes

1. **Privacy**: All computation happens locally in your browser — file contents never leave your device
2. **Large files**: Files over 500MB take longer to compute; please be patient
3. **Algorithm choice**:
   - Everyday file integrity checks: SHA-256 is sufficient
   - Security scenarios (passwords, etc.): Do not use MD5 or SHA-1
4. **Case insensitive**: Hash comparison is not case-sensitive


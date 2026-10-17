# Archive Tool — Technical Background

This tool uses a WASM build of **libarchive** to extract and create archives directly in the browser. It supports three container formats: **ZIP**, **TAR**, and **7Z**. Everything runs locally; files are not uploaded.

## What it does

- **Extract**: open an archive, list its entries, extract them one at a time or all at once. Encrypted archives can be unlocked with a password.
- **Create**: pack multiple files into one archive, with a choice of container format and compression algorithm.

## Compression algorithms

When creating an archive you can pick several algorithms (depending on what the container supports):

- **deflate**: default for ZIP / 7Z, universal and compatible.
- **store**: no compression, just packaging (good for already-compressed files, e.g. a set of images).
- **gzip / bzip2 / xz / zstd / lz4**: different speed/ratio trade-offs; xz compresses smallest but slowest, lz4 fastest but least.

## Why extraction has a size limit

libarchive expands archive contents inside WASM linear memory: the archive itself, the extracted content, and the per-entry buffer all reside at once. A highly compressed archive (e.g. lots of repetitive text) can balloon several times after extraction. So the tool sets conservative thresholds by archive size:

- **Safe limit 2GB**: above this it refuses outright.
- **Warn threshold 1GB**: above this it warns that extraction may use a lot of memory.

## Privacy

Archives and their contents are processed in your browser and never uploaded to any server — important when handling sensitive documents.

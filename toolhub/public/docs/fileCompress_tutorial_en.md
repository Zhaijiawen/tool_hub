# File Compression — Usage Tutorial

Drop a file onto the page, or click to select one, then compress or decompress.

## Compress a file

1. After uploading, set the mode to **Compress**.
2. Pick the format: **Gzip** / **Brotli** / **Zstd**.
   - Gzip needs no quality setting — it uses the browser-native streaming compressor directly.
   - Brotli or Zstd shows a quality slider: Brotli 1-11 (default 6), Zstd 1-19 (default 3). Higher = smaller but slower.
3. Click **Compress**. Gzip shows a live progress bar and can be cancelled at any time.
4. When done it shows original size, result size, and compression ratio; click download to save.

> A ratio >= 100% means it didn't get smaller (e.g. re-compressing an already-compressed file is pointless); the tool tells you so.

## Decompress a file

1. After uploading, set the mode to **Decompress**.
2. For `.gz` or `.zst` the tool detects the format automatically; for `.br` or others, select **Brotli** manually.
3. Click **Decompress** and download the result.

## Size limits

- Brotli / Zstd must read the whole file into memory. Above **2GB** it is refused outright; above **500MB** it warns first.
- Gzip is streaming and has no size limit, making it suitable for large files.

## Tips

- Need to quickly compress a multi-GB log or backup? Use **Gzip**.
- Long-term archive, smallest possible size? Use **Brotli** (higher quality).
- Want a balance of ratio and speed? Use **Zstd**.

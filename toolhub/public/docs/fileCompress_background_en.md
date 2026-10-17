# File Compression — Technical Background

This tool compresses and decompresses any file right in your browser, using three mainstream algorithms: **Gzip**, **Brotli**, and **Zstd**. Your file never leaves the device — no upload, no server, everything runs locally.

## Which algorithm to pick

- **Gzip**: The most universal. Almost every system and decompressor understands `.gz`. In this tool Gzip uses the browser-native `CompressionStream` / `DecompressionStream`, which is truly streaming — memory usage is independent of file size, so it is safe for large files.
- **Brotli**: Google's algorithm, typically 15-25% better compression than Gzip, but slower to compress. Great for long-term archives. Quality 1-11, default 6.
- **Zstd**: Facebook's algorithm, a good balance of ratio and speed. Quality 1-19, default 3. Good when you want both small size and reasonable speed.

## Streaming vs whole-buffer

This is the most important engineering trade-off:

- **Gzip is streaming.** The file is split into 4MB chunks fed into the compression stream one at a time; only one chunk lives in memory at once, so GB-scale files work and the operation can be cancelled mid-way.
- **Brotli / Zstd go through WASM**, which only expose a whole-buffer API — the entire file must be read into memory at once, and the result also resides in memory, peaking at roughly 2x the file size. These formats therefore have a memory ceiling.

## Why the size limits

When decompressing Brotli / Zstd, the archive size, the decompressed size, and the single buffer all occupy memory at once; very large files hit the browser's WASM heap limit (typically 2-4GB). So the tool enforces tiered thresholds:

- **Safe limit 2GB**: above this it refuses outright, so you don't wait minutes only to crash the browser.
- **Warn threshold 500MB**: above this it warns that memory peak is high, but you may still try.

Gzip has no limit because it is streaming.

## Automatic format detection

On decompression the tool reads the first 8 bytes to guess the format: Zstd magic is `28 B5 2F FD`, Gzip is `1F 8B`. Once detected it picks the right decompressor for you. Brotli has no standard magic number, so you must select it manually.

Output extensions: compression produces `.gz` / `.br` / `.zst`; decompression strips those suffixes automatically (or appends `.decompressed` if none found).

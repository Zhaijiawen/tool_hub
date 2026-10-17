# File Compression — Examples

## Compress a server log (large file)

**Input:** `app.log` (1.8 GB plain text)
**Action:** format Gzip, click compress
**Output:** `app.log.gz` (~120 MB, ratio ~7%)

Logs are highly repetitive text and Gzip crushes them. Because it is streaming, 1.8GB won't blow up memory and the progress bar runs to 100%.

## Archive a packed directory long-term

**Input:** `photos.tar` (640 MB)
**Action:** format Brotli, quality 11
**Output:** `photos.tar.br` (~410 MB)

Brotli at max quality trades speed for the smallest size — ideal for archives you rarely open but want minimal.

## Decompress a Zstd package from a colleague

**Input:** `dataset.zst` (320 MB)
**Action:** mode Decompress, tool auto-detects the Zstd magic
**Output:** `dataset` (original file)

You don't need to remember which algorithm they used — the tool reads the first 8 bytes and knows.

## Compress an already-compressed file (no gain)

**Input:** `report.pdf.gz` (already Gzip)
**Action:** compress again with Gzip
**Result:** ratio shows >= 100%, warns of no benefit

Re-compressing already-compressed content is pointless; the tool tells you honestly so you don't wait for nothing.

# PDF Tools — Technical Background

This tool uses a WASM build of **MuPDF** to process PDFs in the browser, with six features: **PDF to image**, **Merge PDF**, **Split PDF**, **Compress**, **Extract text**, and **Organize pages**. On first use it downloads the MuPDF core (with progress, cancellable, then cached). Files are not uploaded.

> Note: MuPDF is licensed under AGPL-3.0. This project ships the WASM build as a purely client-side tool; if you redistribute based on this project's code, mind the compliance requirements of that license.

## PDF to image

Render each page as an image, to **PNG** (lossless) or **JPEG** (lossy, smaller). Optional scale: **1x (72 DPI) / 2x (144 DPI) / 3x (216 DPI)** — higher = sharper but larger. You can render **all pages** or a **custom range** (e.g. `1-3,5,8-10`).

## Merge PDF

Combine multiple PDFs in order into one. Upload at least 2 files, reorder with the up/down arrows, then merge. Common for stitching scans or chapter documents into one.

## Split PDF

Two modes:

- **Split each page**: every page becomes its own PDF.
- **Split by range**: extract the pages you specify (e.g. `1-3,5`).

## Compress

Resaves the document with MuPDF write options: `garbage` to drop unused objects plus `compress=yes`, `compress-images` and `compress-fonts` to recompress streams.

Results depend entirely on how the source file was built. Measured numbers:

| Source | Size change |
|---|---|
| PDF with uncompressed images (scans) | 961 KB → 465 KB, about **-52%** |
| Chrome "Print to PDF" output | about **-1.4%** |
| Word / LaTeX exports | usually 0%–3%, occasionally slightly larger |

So the UI reports the actual percentage instead of claiming the file "always gets smaller".

## Extract text

Reads the text layer returned by `toStructuredText()` per page. This is **not OCR**, so two kinds of PDFs behave differently:

- **Has a text layer** (app-generated): extraction works directly.
- **Pure images** (scans, screenshots): no text layer, so results are empty and the UI suggests an OCR tool instead.

## Organize pages

Keep or delete pages by range. One implementation detail matters: `deletePage()` shifts the index of every following page, so deletions must run in **descending** order or multi-page deletions land on the wrong pages. The tool already does this, and "keep mode" is resolved into the complement set before deleting.

## Encrypted PDF

All six features accept an optional password to open encrypted PDFs. A wrong password only surfaces when the job runs; the tool will tell you.

## Privacy

All PDF parsing is local; sensitive contracts and reports never leave the device.

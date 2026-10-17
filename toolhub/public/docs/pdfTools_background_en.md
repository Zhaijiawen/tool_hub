# PDF Tools — Technical Background

This tool uses a WASM build of **MuPDF** to process PDFs in the browser, with three features: **PDF to image**, **Merge PDF**, and **Split PDF**. On first use it downloads the MuPDF core (with progress, cancellable, then cached). Files are not uploaded.

> Note: MuPDF is licensed under AGPL-3.0. This project ships the WASM build as a purely client-side tool; if you redistribute based on this project's code, mind the compliance requirements of that license.

## PDF to image

Render each page as an image, to **PNG** (lossless) or **JPEG** (lossy, smaller). Optional scale: **1x (72 DPI) / 2x (144 DPI) / 3x (216 DPI)** — higher = sharper but larger. You can render **all pages** or a **custom range** (e.g. `1-3,5,8-10`).

## Merge PDF

Combine multiple PDFs in order into one. Upload at least 2 files, reorder with the up/down arrows, then merge. Common for stitching scans or chapter documents into one.

## Split PDF

Two modes:

- **Split each page**: every page becomes its own PDF.
- **Split by range**: extract the pages you specify (e.g. `1-3,5`).

## Encrypted PDF

All three features accept an optional password to open encrypted PDFs. A wrong password only surfaces when extracting; the tool will tell you.

## Privacy

All PDF parsing is local; sensitive contracts and reports never leave the device.

# Image Text Recognition (OCR) — Technical Background

This tool uses **Tesseract.js** (the WASM build of the Tesseract OCR engine) to recognize text in images in the browser — fully local, no upload.

## How to use

1. Upload an image (PNG / JPEG / WebP / GIF / BMP / TIFF, etc.).
2. Pick recognition languages (multiple allowed, e.g. `chi_sim` + `eng` for mixed Chinese/English).
3. Pick a page segmentation mode (PSM) controlling how layout is interpreted: single line, word, block, automatic, etc.
4. Click **Recognize**; the result shows as editable text, copyable or downloadable as `.txt`.

## Language packs

Each language maps to a trained-data file (`.traineddata.gz`), downloaded and cached on first use. More languages = larger download and slower recognition.

## Progress and confidence

Recognition has three phases; the progress bar follows:

- **Download engine/lang packs** (0-50%)
- **Initialize** (50-85%)
- **Recognize text** (85-100%)

The result area shows: number of characters recognized, **confidence** (higher = more accurate; >=80% green, 60-80% yellow, <60% red), and elapsed time.

## Limits

- Handwriting, decorative fonts, heavily skewed, or low-resolution images recognize worse.
- The engine and language packs are WASM and download on first use, with a progress bar, cancellable.
- Images are not uploaded — good for screenshots with sensitive info.

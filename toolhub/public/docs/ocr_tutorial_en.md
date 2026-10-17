# Image Text Recognition (OCR) — Usage Tutorial

1. Upload an image. The tool shows a preview and size.
2. In **Languages** pick what to recognize (multiple allowed). For mixed Chinese/English select both `chi_sim` and `eng`. First use of a language downloads its pack.
3. Pick **Page segmentation mode (PSM)**: default "automatic" (3) works for most; for a single line choose single-line mode.
4. Click **Recognize**. The bar goes download, then initialize, then recognize.
5. The result appears in a text box, editable; click **Copy** or **Download** to save as `.txt`.

> The result area shows character count, confidence, and elapsed time. Low confidence means it may be wrong — check against the original.

## Tips

- Straighten the image and raise contrast before screenshotting; recognition improves noticeably.
- For English-only documents select just `eng` — don't add unused languages, it's much faster.
- Nothing recognized? Check whether it's handwriting or too low resolution.

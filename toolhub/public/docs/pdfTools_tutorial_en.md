# PDF Tools — Usage Tutorial

There are six tabs at the top: **PDF to Images**, **Merge PDFs**, **Split PDF**, **Compress**, **Extract Text** and **Organize Pages**. At the bottom there is an optional **password** box that applies to every tab.

## PDF to image

1. In the **PDF to Images** tab, upload a PDF.
2. Pick format (PNG / JPEG) and scale (1x/2x/3x).
3. Pick range: all pages, or custom (e.g. `1-3,5`).
4. Click **Start converting**; pages show in a grid afterward, download individually or **Download all**.

## Merge PDF

1. Switch to the **Merge PDFs** tab, upload at least 2 PDFs.
2. Reorder with the up/down arrows on each row (order decides the merged sequence).
3. Click **Start merge** and download.

## Split PDF

1. Switch to the **Split PDF** tab, upload a PDF.
2. Pick a mode:
   - **Each page into its own file**: one file per page.
   - **By page range**: enter a range (e.g. `1-3,5`); each range becomes one file.
3. Click **Start split**, download individually or **Download all**.

## Compress

1. Switch to the **Compress** tab, upload a PDF.
2. Click **Compress**. This drops unused objects and recompresses the internal streams.
3. The size change is shown, e.g. `961 KB → 465 KB (-51.6%)`, then download.

**What to realistically expect:**

- Uncompressed PDFs (scanner output, exports from older tools, image-stapling apps) benefit most — halves are common in our tests.
- Files already compressed elsewhere (Chrome "Print to PDF", Word / LaTeX exports) usually shrink only 1%–3%, and occasionally grow slightly, because re-packing costs a few bytes too.
- Results are never sugar-coated: if nothing could be saved, the badge turns amber with "This file could not be compressed further" instead of pretending success.

## Extract text

1. Switch to the **Extract Text** tab, upload a PDF.
2. Pick scope: all pages or specific pages (e.g. `1-3,5`).
3. Click **Extract text**; results appear per page, with per-page copy, **Copy all** and **Download .txt**.

Note: this reads the PDF's embedded **text layer** — it is **not OCR**. Scanned or screenshot-based PDFs have no text layer, so extraction comes back empty and the UI says so explicitly. Use an OCR tool for those.

## Organize pages

1. Switch to the **Organize Pages** tab, upload a PDF.
2. Pick an action:
   - **Delete selected pages**: removes the pages in your range.
   - **Keep selected pages**: keeps only the pages in your range, drops the rest.
3. Enter a page range (e.g. `1-3,5`), click **Apply**, then download.

You cannot remove every page — a PDF must keep at least one, and the tool reports an error otherwise.

## Encrypted files

Fill the password box at the bottom, then run the operation above to open an encrypted PDF. The password is used locally and never uploaded.

## Page range syntax

Every tab that supports ranges uses one shared syntax — 1-based and inclusive on both ends:

| Syntax | Meaning |
|---|---|
| `3` | Page 3 only |
| `1-3` | Pages 1 through 3 |
| `1-3,5` | Pages 1–3 plus page 5 |
| `8-` | Page 8 through the last page |
| `1-3,5,8-` | Mix freely, comma-separated |

## Tips

- Only need a certain page as an image? In PDF to Images, use a custom range to render just those pages — faster.
- Reorder before merging; the result is not reversible (unless you merge again).
- Many pages produce many files when rendering; pick a range when possible.
- Pulling one chapter out of a long document is easier with **Organize Pages** in keep mode than with split.
- Before compressing, ask yourself how the PDF was made — if it came out of an app, gains will be small.

# PDF Tools — Examples

## Turn one contract page into an image for WeChat

**Input:** `contract.pdf` (20 pages)
**Action:** to image, PNG, 2x, range `3`
**Output:** `contract-3.png` (one sharp page)

Render only page 3 in seconds — no need to export the whole book.

## Merge three scanned files

**Input:** `scan1.pdf` / `scan2.pdf` / `scan3.pdf`
**Action:** merge, order 1->2->3
**Output:** one 30-page merged PDF

Scanned in three batches after signing; stitch back into one for archiving.

## Extract specific chapters from a report

**Input:** `report.pdf` (50 pages)
**Action:** split, by range `12-18`
**Output:** 7 PDFs, one per page

Share only pages 12-18 with a colleague instead of the whole document.

## Save every slide of a deck as images

**Input:** `deck.pdf` (25 pages)
**Action:** to image, JPEG, 2x, all pages
**Output:** 25 images, downloadable in bulk

Useful for a thumbnail wall or importing into an editor that doesn't take PDF.

## Shrink a scan until it fits an email attachment

**Input:** `scan.pdf` (961 KB, straight from a scanner, uncompressed images)
**Action:** compress
**Output:** `compressed.pdf` (465 KB, about -51.6%)

Attachment limits make this a common need. A Word-generated PDF, by contrast, may only shrink ~1% — the UI reports the real number rather than pretending it worked.

## Copy a passage out of an English PDF

**Input:** `paper.pdf` (12 pages, app-generated, has a text layer)
**Action:** extract text, range `7`
**Output:** plain text of page 7, ready to paste into a dictionary or translator

This only works on PDFs with a text layer; scans need OCR first.

## Drop the cover and the ad pages

**Input:** `ebook.pdf` (200 pages)
**Action:** organize pages, delete selected, range `1-2,199-200`
**Output:** `organized.pdf` (196 pages)

Non-contiguous pages are removed in one pass without shifting your targets.

# Image Text Recognition (OCR) — Examples

## Recognize a Chinese screenshot

**Input:** `note.png` (phone screenshot with a Chinese paragraph)
**Action:** language `chi_sim`, PSM automatic
**Output:** editable Chinese text, confidence ~92%

Pull screenshot text into notes — far better than retyping.

## Mixed Chinese/English document

**Input:** `doc.png` (English body with Chinese terms)
**Action:** languages `chi_sim` + `eng`
**Output:** both Chinese and English recognized

Picking only one language misses the other; for mixed text pick both.

## Recognize a single-line code/serial

**Input:** `sn.png` (one line of digits/letters)
**Action:** `eng`, PSM single line
**Output:** the exact string pulled out

Restricting to single-line mode reduces misreads.

## Low-quality image, lower accuracy

**Input:** `blurry.jpg` (blurry photo)
**Action:** `eng` automatic
**Result:** confidence ~45%, several typos

Blurry or handwritten OCR falters; treat results as a reference and verify.

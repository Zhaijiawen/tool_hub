# Document Converter — Examples

## Turn Markdown notes into a Word file to hand over

**Input:** pasted text, meeting notes
**Action:** markdown → docx
**Output:** `out.docx`, opens in Word / WPS

For colleagues who only accept Word. Everything stays local — no uploading the draft first.

## Pull someone's Word document back into Markdown

**Input:** upload `spec.docx`
**Action:** upload file, source auto-detected as docx → markdown
**Output:** Markdown shown on screen, ready to copy into a repo

Handy when migrating legacy documents into Git.

## Build an EPUB ebook

**Input:** pasted text, several chapters of Markdown
**Action:** markdown → epub, with "table of contents" checked
**Output:** `out.epub`, importable into Kindle / Apple Books

The table of contents is generated from heading levels.

## Pull the images out of a docx

**Input:** upload `report.docx` (contains 3 images)
**Action:** docx → markdown, with "extract embedded images" checked
**Output:** Markdown text plus `media.zip` (the 3 original images)

Image references in the result point inside the archive, so extract `media.zip` next to the Markdown to see the full text and images.

If the source has no images, the UI says "no embedded images detected" and produces no archive — that is a normal message, not a failure.

## Save web page content as plain text

**Input:** paste a chunk of HTML source
**Action:** html → plain
**Output:** tag-free plain text

Useful for cleaning up copied web content into readable text.

## Preview a LaTeX paper as a web page

**Input:** upload `paper.tex`
**Action:** latex → html, with "standalone" checked
**Output:** a complete HTML file that opens by double-clicking

For showing drafts to colleagues who do not have LaTeX installed.

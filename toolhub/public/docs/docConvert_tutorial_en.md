# Document Converter — Usage Tutorial

Pick either "Paste text" or "Upload file" as input, choose the source and target formats, then click **Convert**. The first conversion downloads the Pandoc engine (about 56MB, with a progress bar and cancel, then cached). Files are never uploaded.

## Paste text

1. Select **Paste text** and drop your content into the box.
2. Set the source format to what you pasted (Markdown by default).
3. Set the target format.
4. Click **Convert**. Text results appear below and can be copied or downloaded; Word / EPUB / ODT / RTF results offer a download button.

## Upload a file

1. Select **Upload file** and drop or pick a file.
2. The source format is inferred from the extension (`.md`, `.docx`, `.tex`, `.rst`, …); pick manually if it is wrong.
3. Choose a target format and click **Convert**.

## Common paths

| Goal | From | To |
|---|---|---|
| Markdown → Word | markdown | docx |
| Word → Markdown | docx | markdown |
| Markdown → EPUB (ebook) | markdown | epub |
| HTML → Markdown | html | markdown |
| LaTeX → HTML | latex | html |
| Markdown → ODT | markdown | odt |
| Markdown → RTF | markdown | rtf |
| Anything → plain text | anything | plain |

## Extract embedded images

With **Extract embedded images** checked, converting image-bearing files like docx or epub makes Pandoc unpack the images into a `media.zip`, and a download button appears in the results.

Two things to know:

- When the source has no images, no `media.zip` is produced and the UI says so — that is a normal result, not an error.
- In the converted Markdown, image references point inside `media.zip` by relative path, so extract the archive next to the Markdown file before using it.

## Options

- **Standalone**: applies to outputs like HTML and LaTeX — wraps them in a full document with `<html>` / `<head>` so the file can be saved and opened directly. It does nothing for Markdown output.
- **Table of contents**: likewise only affects formats that support one.

## About the first load

The engine is about 56MB — larger than any other tool here, which is the price of Pandoc's coverage: there is essentially no in-browser alternative for this range of conversions. The download has a progress bar, can be cancelled, and is cached afterwards, so **reopening in the same browser never downloads it again**.

## Tips

- To inspect structure, convert to **Markdown → native** to see Pandoc's internal AST — handy for debugging odd formatting.
- Converting to Word without "standalone" still produces complete content; it just omits document-level settings.
- Tables survive Markdown → Word best. Converting from a scanned PDF makes no sense — PDF is not a Pandoc input format.

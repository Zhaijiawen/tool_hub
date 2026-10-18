# Document Converter — Technical Background

This tool compiles **Pandoc** — the de-facto standard for document conversion — to WebAssembly and runs the conversion in your browser. Pandoc is normally a command-line program; here its wasm build is instantiated inside a worker, and all input and output stays local.

> Note: Pandoc is licensed under GPL-2.0-or-later. This project distributes its wasm build as a purely client-side tool; if you redistribute based on this project's code, mind the compliance requirements (declared on the Licenses page).

## Why 56MB is worth it

There is barely a second option in the browser. The usual candidates fall into two groups:

- Single-purpose JS converters (`marked`, `turndown`, …) that only handle HTML ↔ Markdown and have nothing for Word / EPUB / LaTeX.
- Cloud services, which require uploading your files — exactly what this site avoids.

Pandoc covers **29 input and 37 output formats** (measured on this build) and is the only way to do that whole range locally. 56MB is the price of that coverage, which is why the engine loads on first use with progress and cancel, and only when you actually open this tool.

## Input formats (verified)

markdown, commonmark, gfm, html, latex, rst, docbook, opml, jira, man, native, asciidoc, org, json, textile, mediawiki, docx, epub, odt, rtf, typst, muse, texinfo, twiki, tikiwiki, vimwiki, csv, tsv, fb2, ipynb

## Output formats (verified)

html, markdown, gfm, commonmark, latex, rst, json, docbook, opml, jira, man, asciidoc, org, mediawiki, textile, typst, plain, native, plus the binary targets docx, epub, odt, rtf.

## Formats deliberately omitted

**Slide formats (revealjs / slidy / s5 / dzslides / slideous) do convert, but their output loads reveal.js and stylesheets from a CDN**, which breaks this site's "no external requests" rule — so they are not offered. `pptx` produces 0 bytes on this build and is excluded too. Better to ship fewer features than one that cannot run or quietly phones home.

## Implementation notes

- **Never let Rollup bundle pandoc-wasm**: its browser entry pulls all 56MB of wasm at import time and uses top-level await, so it cannot hook into this site's progress / cancel / Cache system. As with imgly and mermaid, `public/wasm/pandoc.wasm` is self-hosted (gitignored, copied from the npm package by `scripts/fetch-pandoc-assets.mjs`) and instantiated at runtime in a worker.
- A Vite alias `pandoc-wasm-core` points straight at the package's `src/core.js` — its `exports` map blocks deep imports, so the alias is the only way to reach the pure logic.
- Conversion runs in a Web Worker: FCCT init and conversion are heavy and would stall the UI on the main thread.
- **The empty `input-files` trap**: an empty array for `input-files` sends pandoc down its "no input files" path, producing a truncated file (a suspiciously small docx that reads back empty). The worker deletes the key.
- **extract-media used to be an empty promise**: checking the box did make pandoc produce `media.zip`, but the old worker only forwarded `output-file`, so the archive was silently dropped. It is now delivered, and the UI message is based on whether an archive actually appeared — far more reliable than guessing from image references in the output text.

## Privacy

All conversion happens locally; document content never leaves the device. The engine wasm is served from this site's own domain with no third-party requests.

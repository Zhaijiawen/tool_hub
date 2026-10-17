# Chart Renderer · Tutorial

## Quick start
1. Open the **Chart Renderer** tool. On first load it picks a flowchart template and renders it.
2. Write or paste Mermaid syntax in the left **source pane**; the right side renders live (about 0.3s after you stop typing).
3. To switch diagram types, pick one from the **"Templates"** dropdown — it loads a working skeleton you can rewrite.

## Switching themes
The **"Theme"** dropdown offers 5 options:
- **Follow site (auto)** (default): follows the site light/dark mode;
- Light / Dark / Forest / Neutral: pins one palette.

## Export
- **Download SVG**: vector file you can edit further in Figma, Illustrator or Inkscape.
- **Download PNG**: exported at 2x pixel density, good for slides, issues or places that cannot open SVG.
- **Copy source**: copies the Mermaid source for pasting back into docs / READMEs.

## FAQ
- **Error on the right?** The red alert shows the exact reason (e.g. missing `end`, unbalanced brackets, misspelled diagram name) — just follow the hint.
- **PNG export failed?** Usually a browser font/CORS restriction when rasterizing the SVG; use "Download SVG" and convert locally instead.
- **Diagram too crowded?** Group flowchart branches with `subgraph`; in sequence diagrams group participants with `box`.
- **Slow on first open?** The matching diagram engine is lazy-loaded once, then cached by the browser.

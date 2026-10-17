# Chart Renderer · Technical Background

## What it is
Chart Renderer turns **Mermaid syntax** into vector SVG entirely in your browser, with SVG / PNG export. Source never leaves your device and it works offline.

## How it works
- The engine is **Mermaid** (this site uses v12, self-hosted with site assets — no CDN).
- It is plain JavaScript with **no WebAssembly** — diagram layout and drawing are not performance-bound, so adding WASM would buy nothing (this project only uses WASM where it has a clear performance or capability advantage).
- Rendering runs locally; Mermaid operates with `securityLevel: 'strict'`, which sanitizes label content.
- Diagram families load **on demand**: flowchart, sequence, mindmap, the KaTeX math renderer and the ELK layout engine each ship as separate chunks, so unused types are never downloaded.

## Supported diagram types
12 common families built in: flowchart, sequence, class, state, entity relationship, user journey, gantt, pie, git graph, mindmap, timeline and quadrant chart — each with a ready-to-run template.

## Why local
- **Privacy**: diagram source often encodes unpublished interface designs, business workflows or org structure — it should not be uploaded to a third party.
- **Offline**: no network needed, usable on a plane or inside a corporate LAN.
- **Free**: no export caps or watermarks from a cloud editor.

## Export differences
| Format | Traits | Good for |
|---|---|---|
| SVG | Vector, infinitely scalable, editable in Figma / Illustrator | Document figures, print, further editing |
| PNG | Raster, exported here at 2x pixel density | Pasting into slides, chat or issue notes |

## License
Mermaid is licensed under **MIT**. This site only calls its API to draw diagrams and does not modify its source.

# Image Compression — How to Use

The whole thing runs in your browser. Nothing gets uploaded anywhere — your images stay on your machine. It handles JPG, PNG, and WebP, up to 10 images at a time.

## The basic flow

**Getting images in —** Drag and drop onto the upload area, or click it to browse files. JPG, PNG, and WebP are supported. Aim to keep individual files under 20MB or so for decent performance.

**Setting quality —** The slider goes from 0 to 100%. Here's what those numbers roughly translate to:

- **100%** — near-lossless, barely any size reduction
- **80%** (recommended) — sweet spot between visual quality and file size. Most people won't notice the difference vs. 100%, but your file might be 60% smaller
- **60%** — noticeable compression, good for web thumbnails where perfect fidelity isn't the goal
- **40%** — aggressive, only use this for small reference images

The quality setting applies to all uploaded images together.

**Reading the results —** Each image card shows you: original size vs. compressed size, the compression ratio (like `-65%`), and a preview thumbnail so you can visually check the output.

**Downloading —** Hit the download button on a single card to grab one file, or use "Download All" to get everything at once.

## Real-world scenarios

**Website image optimization —** You've got 5-10MB photos straight from a camera or design tool. Set quality to 80%, compress, and you'll typically land under 500KB per image. That's the difference between a 2-second page load and a 10-second one.

**Email attachments —** Photos that are too big for Gmail/Outlook limits. Bump quality down to 70%, the files shrink dramatically while staying perfectly viewable.

**Pre-processing before mobile upload —** If you're building an app where users upload photos, point them here first. Batch compress at 75-80% quality, then upload. Saves their data and your storage costs.

**E-commerce product shots —** Product images need to be crisp but fast-loading. Batch compress at 80% and you'll maintain enough detail while slashing page weight.

## Rough size estimates

These are ballpark figures from real testing:

| Original | At 80% | At 60% | At 40% |
|----------|--------|--------|--------|
| 5MB JPG | ~1.5MB | ~900KB | ~600KB |
| 3MB PNG | ~2.5MB | ~2MB | ~1.5MB |
| 10MB JPEG | ~3MB | ~1.8MB | ~1.2MB |

PNG compression is less effective because the format is inherently lossless. If file size matters more than transparency, convert PNG to JPG first.

## Heads up

Since everything runs locally, there's zero privacy concern — your images never leave your device. Compressed images keep their original format (JPG stays JPG). The tool compresses quality only, not pixel dimensions. And remember, compression is irreversible — keep your originals safe if you might need them later.

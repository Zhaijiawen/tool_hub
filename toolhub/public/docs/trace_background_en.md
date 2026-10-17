# Image to SVG: How It Works

## Why convert images to SVG

Bitmaps (PNG / JPG / WebP) are made of pixels. Scale them up past a certain point and they blur, alias and turn blocky. SVG describes shapes with mathematical curves, so it stays razor-sharp at any size, is usually much smaller, and its colors remain editable afterward.

Typical conversion needs:

- Turning a loose logo sketch into a reusable vector asset
- Using scanned signatures or stamps in digital documents
- Extracting line artwork for laser cutting, engraving or CNC milling
- Keeping icons crisp on high-DPI screens and large-format prints

## This tool traces — it does not magically reconstruct

One thing must be clear: **raster-to-vector is a lossy reconstruction**. There is no such thing as "one click, perfect result".

This tool is built on **Potrace**, a classic bitmap tracing engine by Peter Selinger, released under GPL-2.0. Its pipeline has three stages:

1. **Binarization** — split the image into pure black and white by brightness
2. **Outline extraction** — find the boundary contours of dark regions
3. **Curve fitting** — approximate those contours with line segments and Bézier curves, emitted as SVG paths

Potrace is a **monochrome** tracer: it can only express "present" or "absent". Which means:

- ✅ **Good fit**: logos, icons, signatures, line art, traced patterns, chart wireframes — anything inherently black-and-white with crisp edges
- ❌ **Poor fit**: color photos, gradients, realistic illustrations — these get crushed into black blobs and are usually unusable

If what you actually want is "make this photo sharper", that is super-resolution — a completely different technology.

## The two controls that matter: threshold and invert

Because the decision is already made at the binarization stage, this tool puts the two critical knobs in your hands.

**Black/white threshold (0–255)**
Every pixel's brightness is compared against this value. Pixels **darker** than the threshold are painted black and become shapes in the SVG; brighter ones become white background.
- **Higher** threshold → more pixels count as dark → traced area grows, strokes get thicker
- **Lower** threshold → only very dark pixels survive → thinner strokes, faint marks may vanish

**Invert**
Potrace treats dark pixels as the foreground. Therefore:
- Dark artwork on a light background → keep it **off**
- Light artwork on a dark background → turn it **on** to flip the relationship

These two settings decide success or failure more than any post-processing.

## A note on SVG fill rules

When Potrace outputs a shape with holes (e.g. a black square with a circle knocked out), it expresses it through multiple closed sub-paths. We verified the rendering in a real browser: the generated path winding already works correctly under SVG's default `nonzero` fill rule, so no `fill-rule` patching is needed.

## Privacy and technical notes

- Images **never leave your device**; everything runs locally in the browser and works offline once the page has loaded
- The engine comes from `potrace-wasm`, a WebAssembly port of Potrace. The wasm is inlined in the bundle (~230KB), so nothing is fetched from a third-party CDN
- Processing width can be the original size or capped at 1600 / 1000 / 600 px — tracing cost grows with pixel area, so downscaling is much faster
- Transparent pixels are flattened onto white so PNG transparency is not mistaken for black foreground
- License: Potrace is GPL-2.0, and the port follows the same terms. Full license notices and source availability are listed on the site's "Open Source Licenses" page

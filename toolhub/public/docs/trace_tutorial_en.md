# Tutorial: Converting an Image to SVG

## 1. Start with a suitable image

Before opening the tool, decide whether your image is even a candidate. This tool uses a monochrome tracer, so ideal inputs are:

- Black logos, icons or text on a white background
- Hand-drawn line art, scanned signatures
- Traced patterns and silhouettes

**Poor candidates**: color photos, gradient artwork, cluttered photos of documents. Those get crushed into black contours and the result is rarely usable.

If all you have is a photo, do two things first (you can use the other image tools on this site):
1. Crop away unrelated background, keep only the subject
2. Raise the contrast so strokes stand out clearly from the background

## 2. Upload the image

1. Click the dashed area, or click "Choose image"
2. Pick a local image file (PNG / JPG / WebP and other common formats)
3. A preview appears, along with the file name, size and pixel dimensions

Nothing is uploaded — the whole conversion happens locally in your browser.

## 3. Tune the parameters

### Black/white threshold (0–255)

This is the single most important control. The whole output is decided here.

| Symptom | Meaning | Fix |
| --- | --- | --- |
| Strokes too thin, broken lines | Faint parts are being dropped | Adjust the threshold until lines reconnect |
| A solid black blob | Too much area is counted as dark | Lower the threshold |
| Almost nothing appears | Too little counts as dark | Raise the threshold |

The default of 128 suits most dark-on-light artwork.

### Invert

Dark pixels are treated as the foreground. So:

- **Dark art on light background** → keep it off (default)
- **Light art on dark background** → turn it on

Quick test: if the result looks like a negative of your original — filled where it should be empty — just enable invert.

### Processing width

Choose "Original size" or cap it at 1600 / 1000 / 600 px.

Tracing cost grows with pixel area, so for anything wider than ~3000px, 1000 or 1600 is dramatically faster. For small logos, keep the original size.

## 4. Run the conversion

Click "Convert to SVG" — the button switches to "Tracing…". When it finishes you get a side-by-side view:

- Left: the original
- Right: the SVG vector result (checkerboard shows transparency)

Below that, the SVG file size, elapsed time and output dimensions are shown.

## 5. Export

- **Download SVG** — saves a `.svg` file named after the uploaded image
- **Copy SVG source** — copies the SVG markup to your clipboard for pasting into HTML or a design app

The output is filled black (`fill="#000000"`). To recolor, open it in a text editor and replace that value.

## 6. Troubleshooting

**Conversion failed or looks wrong**
Usually a bad threshold or an oversized image. Try another threshold, or drop the processing width to 1000 px.

**Lots of stray speckles**
Scan noise and dust become shapes. Clean the background first, or raise the threshold so faint specks fall into the background.

**The SVG is bigger than the original**
A forced-color photo produces thousands of fragmented paths. That kind of image is not a fit for this tool — redraw it as vector instead.

**I need multiple colors**
This tool emits a single-color vector. Multi-color vectorization requires a different approach (e.g. color-layer tracing), which this site does not offer yet.

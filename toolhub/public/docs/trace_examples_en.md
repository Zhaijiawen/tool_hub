# Practical Examples: Image to SVG

## Example 1: Black logo on white → vector asset

**Scenario**: You have an old logo as a PNG (black artwork, white background, 800×600) and need it crisp for high-res output.

**Settings**:
```
Input: logo.png  800×600  46 KB
Threshold: 128 (default)
Invert: off
Processing width: original (800px is small, no need to downscale)
```

**Steps**: upload → keep defaults → click "Convert to SVG"

**Result**: A monochrome path SVG, usually only a dozen KB, that scales to any size for posters or large prints without losing sharpness.

---

## Example 2: Scanned handwritten signature → transparent vector signature

**Scenario**: A signature signed on paper, scanned, now needed inside digital documents.

**Settings**:
```
Input: signature.jpg  (scan)
Threshold: 150  ← raised
Invert: off
Processing width: 1600 px
```

**Why raise it**: Scans tend to have light ink and off-white paper. Around 150 pulls faint strokes into the shape, so the lines connect.

**Result**: Download the SVG, replace `fill="#000000"` with your brand color in any editor, then embed it in a PDF or web page.

---

## Example 3: White icon on black → invert is mandatory

**Scenario**: A white line icon on a dark background, typical of dark-theme UI screenshots.

**Settings**:
```
Input: icon-white-on-black.png
Threshold: 128
Invert: ON  ← the key part
Processing width: original
```

**Without invert**: You get a solid filled rectangle, because the large dark background is taken as the subject.

**With invert**: The light/dark relationship flips and the white strokes become the shape — correct output.

---

## Example 4: Very large line art → cap the width for speed

**Scenario**: A 4000×3000 scanned line drawing.

**Settings**:
```
Input: drawing.jpg  4000×3000
Threshold: 128
Invert: off
Processing width: 1000 px  ← the key part
```

**Why**: Tracing cost scales with pixel area. A 4000px-wide scan is ~12 megapixels; capped at 1000px it's ~0.9 megapixels — about 1/13 the work, and much faster. For line art, 1000px of detail is usually plenty.

---

## Example 5: When not to use it (counter-example)

**Scenario**: Converting a color portrait photo to vector.

**Result**: Forced binarization destroys the tonal range. You get countless unrecognizable black fragments, and the SVG may even end up larger than the source image.

**Takeaway**: This tool is for line art and graphics, not photos. For photo scenarios consider:
- **Remove the background** → use the "AI Background Remover" tool
- **Upscale without blur** → that is super-resolution, a different technology from this one

---

## Settings cheat sheet

| Input type | Threshold | Invert | Width |
| --- | --- | --- | --- |
| Black logo / icon on white | 128 | off | original |
| Light-ink scanned signature | 140–160 | off | 1000–1600 |
| Faint pencil sketch | 150–180 | off | original |
| White icon on black | 128 | **ON** | original |
| Huge scan (>3000px) | 128 | off | 1000 |
| Color photo | N/A | N/A | avoid this tool |

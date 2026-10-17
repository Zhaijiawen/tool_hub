# AI Background Removal — Examples

## E-commerce product shots on white
You have a product photo taken on a cluttered desk, but the listing requires a pure white background.

**Input:** a product photo shot on a real desk
**Action:** pick the "Light" model, click "Remove background", then export the PNG.
**Output:** a transparent PNG you can drop onto any solid color (white / brand color) for the detail page — no Photoshop needed.

## Portrait ID photo background
You need to turn a casual photo into a blue- or red-background ID photo.

**Action:** upload the portrait, use the "HD" model (cleaner hair), remove the background, download the transparent PNG, then fill a background with an image editor.
**Note:** the HD model handles hair and edges better, suited to high-precision needs.

## Poster / PPT asset extraction
You are building a slide and want to lift one person out of a group photo as a foreground asset.

**Action:** upload the group photo, remove the background to get a transparent PNG, then drag it straight into PowerPoint / design software.
**Advantage:** everything runs locally in the browser; the photo is never uploaded, so sensitive assets stay safe.

## Quick batch pre-screening
You have dozens of assets and want to quickly see which subjects are clean enough for cutout.

**Action:** run all of them through the "Light" model for fast transparent previews, eyeball and drop the messy ones, then re-run the keepers with the "HD" model.
**Why:** the light model is fast and saves time — rough-screen first, refine later, instead of running HD on everything up front.

## Privacy-sensitive scenarios
You are processing a person from an internal scanned contract that must not leave the building.

**Note:** model weights are self-hosted on this site and images are inferred entirely in your local browser, going through no external server — unlike cloud services such as remove.bg, there is no outbound-data risk.

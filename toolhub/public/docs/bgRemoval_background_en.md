# AI Background Removal · Technical Background

## What it is
AI Background Removal uses a neural network running locally in your browser to cut out the subject of an image and produce a transparent PNG. The image never leaves your device, making it a privacy-friendly alternative to paid cloud services like remove.bg.

## How it works
- Built on the **ISNet (U²-Net)** salient-object segmentation model, which works well for people and most common objects.
- Inference runs in the browser via **onnxruntime-web** (WASM, with WebGPU acceleration where available).
- Model weights (`isnet_quint8` / `isnet_fp16`) are **self-hosted on this site** at `/imgly-bg/` in a content-addressed layout — no external CDN is used.

## Why local
- **Privacy**: images are processed entirely in your browser and never uploaded.
- **Free**: no per-call cloud API fees.
- **Cachable**: after the first download the weights are cached by the browser, so later runs are faster.

## Model choice
| Model | Size | Notes |
|---|---|---|
| Light isnet_quint8 | ~40MB | Faster, good for quick previews |
| HD isnet_fp16 | ~80MB | Higher quality, better on fine hair/details |

## Tips
- Best results when the subject contrasts clearly with the background.
- Complex hair or translucent edges may leave artifacts and can be touched up with an image editor.
- Large images are slower; resize to a sensible size first.

## License
`@imgly/background-removal` is licensed under **AGPL-3.0**. This site only calls its API without modifying the source; see the "Open Source Licenses" page for the notice.

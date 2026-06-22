# Image Processing — Usage Tutorial

The image tools let you convert, resize, crop, rotate, and compress images — all in the browser. Each operation has its own tab, and they work independently.

## Format conversion

Drag an image onto the page or click to browse. The tool shows the original format and file size. Pick a target format from the dropdown — JPEG, PNG, WebP, AVIF, or BMP. For lossy formats (JPEG, WebP, AVIF), a quality slider lets you balance file size against visual quality. The output updates in real time as you adjust.

Click download to save the converted image. The file never left your browser.

Quick format tips:
- PNG to JPEG: Transparent areas become white. If your PNG has transparency, either pick WebP or accept the white background.
- JPEG to PNG: File size will increase since PNG is lossless. You're not gaining quality — the JPEG artifacts are already baked in.
- Anything to WebP/AVIF: Best compression, but check the output if you're sending it to someone who might open it in older software.

## Resize

Enter target dimensions in pixels. The aspect ratio lock is on by default — change width and height scales together. Unlock it if you need a specific non-proportional size, but expect stretching.

The resize is done with the browser's built-in interpolation. For downscaling, this is perfectly fine. For upscaling, the result will look soft — there's no way around that without AI upscaling.

Common presets are available: half size, thumbnail (150px), and social media dimensions.

## Crop

Draw a selection rectangle on the image by clicking and dragging. The selection shows pixel coordinates and dimensions in real time. You can type exact pixel values if you need precision — useful for profile pictures that require specific dimensions.

Available constraint modes:
- **Free**: Any aspect ratio you want
- **Square** (1:1): For avatars, profile pictures, Instagram
- **4:3 / 16:9 / 3:2**: Common photo and video aspect ratios
- **Custom**: Lock to any ratio you specify

## Rotate and flip

Rotate in 90-degree increments or enter a custom angle. 90-degree rotations are lossless — pixels are just rearranged, not resampled. Custom angles require interpolation, so expect a slight quality change at non-right-angle rotations.

Flip horizontally and vertically are instant. Horizontally flipping a photo with text will mirror the text — useful for selfies (front cameras often mirror the preview), not useful for documents.

## Compression

If you just need to shrink a file without changing anything else, use the compress tab. Load any image and adjust the quality slider. The tool shows a before/after comparison with file sizes and a visual preview so you can see what you're trading off.

For JPEGs, going from quality 100 to 80 typically halves the file size with no visible difference. Below 60, artifacts start appearing — look for blocky areas in gradients and blurring around sharp edges.

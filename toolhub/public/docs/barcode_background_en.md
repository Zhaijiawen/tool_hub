# Barcode Scanner · Technical Background

## What it is
Barcode scanning decodes 1D / 2D barcodes from an uploaded image or a live camera view, locally in your browser, and returns the symbology and the decoded text. Images and camera frames never leave your device.

## Supported formats
Powered by the **ZXing** decoding engine, it supports common symbologies:
- 2D: QR Code, Data Matrix, Aztec, PDF 417
- 1D: EAN-13 / EAN-8, UPC-A / UPC-E, Code 128, Code 39, Code 93, ITF, Codabar, and more

## Two modes
- **Upload image**: pick or drop an image containing a barcode, then click scan.
- **Camera scan**: use the device camera for live scanning — ideal on phones or laptops with a front/back camera.

## Why local
- **Privacy**: images and camera frames are processed entirely in your browser and never uploaded.
- **Free**: no per-call cloud API fees.
- **Offline-capable**: the decoder runs in the browser, so it works without a network (after the library is cached).

## Tips
- Keep the barcode clear, evenly lit, and free of heavy distortion.
- For 1D codes, face the camera straight on and fill the frame; for QR, keep all four finder patterns intact.
- Glare, blur, or heavy compression lowers the success rate.

## Privacy
This tool only calls a local decoder — it collects and uploads no images or scan results.

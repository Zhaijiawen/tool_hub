# Image Compression - Tutorial

## Getting Started

The image compression tool runs entirely in your browser — images are never uploaded to any server. Supports JPG, PNG, and WebP formats, and can process up to 10 images at once.

## Basic Usage

### Step 1: Select Images

There are two ways to add images:
- **Drag and drop**: Drag images directly into the upload area on the page
- **Click to select**: Click the upload area and choose one or more images from the file dialog

Supported formats: JPG/JPEG, PNG, WebP
Maximum per upload: 10 images
Recommended single file size: Under 20MB

### Step 2: Adjust Compression Quality

Use the quality slider to set the compression level:
- **100%**: Near-lossless (file size barely changes)
- **80%** (recommended): Good balance between quality and size
- **60%**: Noticeable compression, suitable for web thumbnails
- **40%**: Heavy compression, suitable for preview images

The quality slider applies to all uploaded images simultaneously.

### Step 3: View Compression Results

Each image card displays:
- 📦 **Original size** vs **Compressed size**
- 📉 **Compression ratio** (e.g., `-65%`)
- 🖼️ Preview thumbnail (compressed result)

### Step 4: Download Results

- **Single download**: Click the download button on each image card
- **Batch download**: Click "Download All" at the top to download all compressed images

## Feature Details

### Real-time Comparison

Each image card shows a real-time size comparison before and after compression, helping you decide if the quality meets your needs.

### Drag Multiple Images

You can drag multiple images into the upload area at once, and the tool will process them all in parallel.

### Clear Image List

Click "Clear" to remove all uploaded images and start a fresh batch.

## Use Cases

### Scenario 1: Website Image Optimization

Upload high-resolution images from a camera or design software, set quality to 80%, and use the compressed images directly for your website. This typically reduces 5-10MB images to under 500KB.

### Scenario 2: Email Attachment Photos

Upload photos, set quality to 70%, and use the compressed versions as email attachments to stay within attachment size limits.

### Scenario 3: Pre-processing Images Before Mobile App Upload

Select multiple photos, set quality to 75-80%, compress them, then upload to the app — saving users' data usage.

### Scenario 4: E-commerce Product Images

Batch compress product images while maintaining sufficient visual quality, making e-commerce pages load faster.

## Quality Comparison Reference

| Original Size | Quality 80% | Quality 60% | Quality 40% |
|--------------|------------|------------|------------|
| 5MB JPG | ~1.5MB | ~900KB | ~600KB |
| 3MB PNG | ~2.5MB | ~2MB | ~1.5MB |
| 10MB JPEG | ~3MB | ~1.8MB | ~1.2MB |

> PNG compression is less effective than JPEG, because PNG is a lossless format with limited room for quality-based compression.

## Important Notes

1. **Privacy**: All compression happens locally in your browser — images are never uploaded to any server
2. **Format preserved**: Compressed images maintain their original format (JPG stays JPG, PNG stays PNG)
3. **Dimensions unchanged**: This tool only compresses quality, not pixel dimensions
4. **Irreversible**: Compression is a lossy operation — keep the original image as a backup
5. **PNG note**: PNG is a lossless format, so quality compression is less effective. For smallest file size, consider converting to JPG


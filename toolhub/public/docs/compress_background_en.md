# Image Compression - Technical Background

## Why Image Compression Matters

Images are typically the largest resources on a web page. Studies show images account for over 50% of the total page weight on average. Optimizing images can:
- Speed up page load times (user experience)
- Reduce data consumption (especially important on mobile)
- Lower server bandwidth costs
- Improve SEO rankings (Google uses page speed as a ranking factor)

## Image Format Comparison

### JPEG (JPG)
- **Characteristics**: Lossy compression, supports photo-quality color depth
- **Best for**: Photos, complex color images
- **Not ideal for**: Text, icons, images requiring transparent backgrounds
- **Compression principle**: Discrete Cosine Transform (DCT) — reduces precision of high-frequency details

### PNG
- **Characteristics**: Lossless compression, supports transparency (alpha channel)
- **Best for**: Icons, screenshots, images requiring transparent backgrounds
- **Not ideal for**: Large photos (larger file sizes)
- **Compression principle**: DEFLATE algorithm — lossless but larger files

### WebP
- **Characteristics**: Developed by Google, supports both lossy and lossless compression, transparency, and animation
- **Best for**: Most web use cases (can replace JPEG and PNG)
- **Size advantage**: ~25-35% smaller than JPEG, ~26% smaller than PNG
- **Browser support**: Chrome, Firefox, Safari (14+), Edge

### AVIF
- **Characteristics**: Next-generation format based on AV1 video encoding
- **Size advantage**: Even smaller than WebP, ~50% smaller than JPEG
- **Compatibility**: Newer format; some older browsers don't support it

## Compression Algorithms

### Lossy Compression
Reduces file size by discarding details that the human eye is less sensitive to:
1. Color quantization: Reducing the number of colors
2. Chroma subsampling: Color richness has less visual impact than brightness
3. Frequency domain compression: DCT + quantization to reduce precision of high-frequency details

### Lossless Compression
Reduces file size using statistical patterns and encoding — no information is lost:
1. Predictive coding: Predicting pixel values based on neighboring pixels
2. Entropy coding: Shorter codes for frequently occurring patterns (Huffman coding)
3. LZ77 and other dictionary compression algorithms

## browser-image-compression Library

This tool uses the `browser-image-compression` library to compress images in the browser:

- **Pure frontend**: Runs entirely in the browser — no server needed
- **Web Worker**: Compresses in a background thread without blocking the UI
- **Supported formats**: JPEG, PNG, WebP
- **Features**: Quality adjustment, max dimension limit, max file size limit

```javascript
import imageCompression from 'browser-image-compression'

const options = {
  maxSizeMB: 1,            // Max 1MB
  maxWidthOrHeight: 1920,   // Max dimension 1920px
  useWebWorker: true,       // Use Web Worker
  fileType: 'image/jpeg',   // Output format
  initialQuality: 0.8       // Initial quality 80%
}

const compressedFile = await imageCompression(originalFile, options)
```

## Quality Setting Recommendations

| Quality | Use Case | Size Savings |
|---------|---------|-------------|
| 90%+ | Important photos, commercial use | ~20-30% |
| 75-90% | Website display images, blogs | ~40-60% |
| 60-75% | Thumbnails, preview images | ~60-70% |
| 40-60% | Reference-only very small images | ~70-80% |

Note: Lossy compression is less effective for PNG because PNG is inherently a lossless format.


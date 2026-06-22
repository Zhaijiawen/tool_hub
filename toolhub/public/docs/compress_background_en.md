# Image Compression — What's Actually Happening

Images eat up more bandwidth than anything else on a web page. Seriously — the median page today is over 50% images by weight. Optimizing them isn't just a nice-to-have; it directly affects load times, mobile data bills, server costs, and your SEO scores (Google absolutely cares about page speed).

## The format landscape

**JPEG** is the workhorse for photos. It uses lossy compression based on the Discrete Cosine Transform — essentially, it throws away high-frequency detail that your eyes won't miss. Great for photographs, terrible for screenshots with text or anything needing transparency.

**PNG** is lossless and supports alpha transparency. It uses the DEFLATE algorithm — same as ZIP files. Perfect for icons, screenshots, and UI elements. But for photos, PNG files get huge, fast.

**WebP** is Google's answer to both. It does lossy and lossless, supports transparency and animation, and typically shaves 25-35% off JPEG sizes and ~26% off PNG. Browser support is universal now — even Safari has had it since version 14.

**AVIF** is the newest contender, built on AV1 video encoding. It's roughly 50% smaller than JPEG at the same quality. The catch? Some older browsers don't support it yet. If your audience is on modern browsers, switch yesterday.

## How compression actually works

Lossy compression uses a few tricks in sequence: color quantization (reducing the number of distinct colors), chroma subsampling (your eyes are way more sensitive to brightness changes than color saturation changes), and frequency-domain compression (DCT + quantization to drop high-frequency detail).

Lossless compression takes a different approach — predictive coding (guessing pixel values based on neighbors), entropy coding like Huffman (shorter codes for common patterns), and dictionary compression like LZ77.

## The library under the hood

We use `browser-image-compression` — it runs entirely in your browser. No server involved, no uploads. It spins up a Web Worker so the compression happens off the main thread and your UI stays responsive.

```javascript
import imageCompression from 'browser-image-compression'

const options = {
  maxSizeMB: 1,            // Target: under 1MB
  maxWidthOrHeight: 1920,   // Max dimension 1920px
  useWebWorker: true,       // Off the main thread
  fileType: 'image/jpeg',   // Output format
  initialQuality: 0.8       // Start at 80% quality
}

const compressedFile = await imageCompression(originalFile, options)
```

## Quality setting guide

Here's a rough table based on real-world testing:

| Quality | What it's good for | Typical savings |
|---------|-------------------|-----------------|
| 90%+ | Commercial photos, print-ready | ~20-30% |
| 75-90% | Website hero images, blog posts | ~40-60% |
| 60-75% | Thumbnails, previews | ~60-70% |
| 40-60% | Tiny reference images only | ~70-80% |

One thing to keep in mind: PNG doesn't benefit from quality-based compression the way JPEG does, because PNG is inherently lossless. If you need tiny files and don't need transparency, converting PNG to JPEG before compressing is often the better move.

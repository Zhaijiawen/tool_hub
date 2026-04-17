# Image EXIF Viewer — Tutorial

## Upload an Image

**Method 1**: Drag and drop an image file onto the upload area
**Method 2**: Click the upload area to open the file browser

Supports JPEG, TIFF, HEIC (iPhone format), and other formats with EXIF data.

## View Basic Info

After uploading, switch to the "Basic Info" tab to see:
- Camera brand and model
- Capture time (DateTimeOriginal)
- Image resolution
- Color space

## View Camera Settings

Switch to the "Camera" tab to see:
- **Shutter speed** (ExposureTime): e.g. 1/125s
- **Aperture** (FNumber): e.g. f/2.8
- **ISO**: e.g. ISO 800
- **Focal length** (FocalLength): e.g. 24mm
- **Flash**: whether it fired

## View GPS Location

Switch to the "GPS" tab. If GPS data exists:
- Latitude (GPSLatitude) and Longitude (GPSLongitude) are shown
- Copy and paste into Google Maps to find the photo location

## Copy Data

- Click the "Copy" button next to any row to copy that field's value
- Click "Copy All EXIF" at the top to copy all fields in `key: value` format

## FAQ

**Q: I uploaded a photo but it says "No EXIF data"?**

A: This happens when:
1. The image is a screenshot
2. The image was downloaded from WeChat/Weibo/etc. (platforms strip EXIF)
3. The image was saved by Photoshop or similar software
4. The image is a PNG (PNG doesn't support standard EXIF)


# Image EXIF Viewer — Background

## What is EXIF?

EXIF (Exchangeable Image File Format) is a metadata standard embedded in image files, established by the Japan Electronic Industries Development Association (JEITA) in 1995.

Most JPEG and TIFF images taken with digital cameras and smartphones automatically include EXIF data.

## Common EXIF Fields

### Device Info
- **Make**: Camera manufacturer (e.g. Apple, Canon, Nikon)
- **Model**: Specific model (e.g. iPhone 15 Pro)
- **Software**: Processing software version

### Camera Settings
- **ExposureTime**: Shutter speed (e.g. 1/1000)
- **FNumber**: Aperture f-number (e.g. f/1.8)
- **ISO**: ISO sensitivity
- **FocalLength**: Focal length (mm)
- **Flash**: Whether flash was used

### Time Info
- **DateTime**: File modification time
- **DateTimeOriginal**: Actual capture time

### GPS Info
- **GPSLatitude**: Latitude
- **GPSLongitude**: Longitude
- **GPSAltitude**: Altitude

## Privacy Considerations

GPS data can precisely identify where a photo was taken. Be aware:
- Platforms like WeChat and Instagram typically strip GPS info when sharing
- Sending the original file via email or AirDrop preserves full EXIF

## Library Used

Based on `exifr` (npm), which supports parsing EXIF, XMP, and IPTC data from JPEG, TIFF, HEIC, PNG, WebP, and more.


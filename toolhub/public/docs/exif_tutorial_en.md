# Image EXIF Viewer — How to Use

## Getting a photo in

Drag and drop an image onto the upload area, or click it to browse. JPEG and HEIC (iPhone's format) are the most common formats with EXIF data. The tool also handles TIFF and WebP.

## What you'll see

The tool organizes EXIF data into tabs so you're not staring at a wall of raw fields:

**Basic Info tab —** Camera make and model, capture time, image resolution, and color space. This is your quick overview.

**Camera tab —** Shutter speed, aperture, ISO, focal length, and flash status. These are the settings the camera used when the shot was taken.

**GPS tab —** If the photo has location data, latitude and longitude are displayed in decimal format. Copy them and paste into Google Maps or Apple Maps to see exactly where the photo was taken.

## Copy what you need

Each row has a copy button that grabs just that field's value. There's also a "Copy All EXIF" button that dumps everything as `key: value` pairs. Handy for pasting into documentation or debugging.

## Why a photo might have no EXIF

It happens more often than you'd think:

1. It's a screenshot — screenshots don't contain EXIF data
2. The image came from WeChat, Weibo, or similar — these platforms strip EXIF on upload
3. It was exported from Photoshop or Lightroom with "Remove metadata" checked
4. It's a PNG — PNG doesn't support standard EXIF (some tools embed XMP instead)
5. The photo was taken with a very old or very basic camera that didn't record EXIF

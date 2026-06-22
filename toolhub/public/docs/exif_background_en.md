# Image EXIF Viewer — What's Hidden in Your Photos

EXIF is metadata that cameras and phones embed in every photo they take. It's been around since 1995, defined by JEITA, and most JPEG and TIFF files carry it automatically.

## What gets recorded

**Device info —** Make (Apple, Canon, Nikon) and Model (iPhone 15 Pro, Canon EOS R5). Also the Software field, which is usually the OS version or the app that last processed the file.

**Camera settings —** ExposureTime (shutter speed like 1/1000), FNumber (aperture like f/1.8), ISO (sensor sensitivity), FocalLength in mm, and whether the flash fired. If you're into photography, these are the values you'd check to understand how a shot was taken.

**Time —** There's DateTime (file modification) and DateTimeOriginal (when the shutter actually clicked). The original capture time is usually the one you care about.

**GPS —** Latitude, longitude, and altitude. Your phone records this by default. The coordinates are precise enough to identify the exact building you were in.

## Privacy: GPS is the big one

GPS data in photos is surprisingly easy to overlook. A few things to know:

- Most social platforms (WeChat, Instagram, Twitter) strip EXIF data when you upload, including GPS
- But if you send someone the original file — email attachment, AirDrop, file transfer — all EXIF data comes along
- If you're selling something on a classifieds site and include a photo taken at home, the GPS coordinates can reveal your address

## The library

We use `exifr` under the hood. It handles JPEG, TIFF, HEIC, PNG, WebP, and can parse EXIF, XMP, and IPTC metadata. It's fast and works entirely in the browser.

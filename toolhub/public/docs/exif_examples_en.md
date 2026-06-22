# Image EXIF Viewer — Example Data

## Typical iPhone photo

| Field | Value |
|-------|-------|
| Make | Apple |
| Model | iPhone 15 Pro |
| Software | 17.1 |
| DateTimeOriginal | 2024:03:15 10:23:45 |
| ExposureTime | 1/1000 |
| FNumber | 1.78 |
| ISO | 50 |
| FocalLength | 6.765 |
| FocalLengthIn35mmFilm | 24 |
| GPSLatitude | 39.9042 |
| GPSLongitude | 116.4074 |
| GPSAltitude | 43 |

The FocalLengthIn35mmFilm field is worth noting — the iPhone's actual lens is 6.765mm, but the 35mm equivalent is 24mm, which tells you more about the field of view. Most phones report this.

## Typical DSLR photo

| Field | Value |
|-------|-------|
| Make | Canon |
| Model | Canon EOS R5 |
| DateTimeOriginal | 2024:06:20 15:30:22 |
| ExposureTime | 1/500 |
| FNumber | 2.8 |
| ISO | 400 |
| FocalLength | 85 |
| WhiteBalance | Manual |
| Flash | Flash did not fire |

DSLRs record more detailed settings — white balance mode, metering mode, exposure compensation. If you're learning photography, comparing EXIF data from photos you like is a great way to understand exposure settings.

## GPS format

EXIF stores GPS coordinates in Degrees Minutes Seconds (DMS), but this tool converts them to Decimal Degrees (DD) — the format map apps expect:

```
39.9042, 116.4074
```

Paste that into Google Maps and you'll land near Tiananmen Square in Beijing. The precision is within a few meters typically.

## An EXIF privacy check

Before sharing a photo online, especially with strangers (selling items, forums, etc.), run it through this tool and check the GPS tab. If there are coordinates you don't want public, most phones let you disable location tagging in the camera settings. On iPhone it's under Settings > Privacy > Location Services > Camera. On Android it varies by manufacturer but is usually in the camera app's settings menu.

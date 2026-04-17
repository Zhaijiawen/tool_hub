# Image EXIF Viewer — Examples

## Typical iPhone Photo EXIF

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

## Typical DSLR Camera EXIF

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

## GPS Coordinate Format

EXIF stores GPS in Degrees Minutes Seconds (DMS). This tool converts to Decimal Degrees (DD) for direct use in map applications:

```
39.9042, 116.4074
```

→ Near Tiananmen Square, Beijing


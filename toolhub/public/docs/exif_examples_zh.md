# 图片 EXIF 示例

## 典型 iPhone 照片 EXIF

| 字段 | 值 |
|------|-----|
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

## 典型 DSLR 相机 EXIF

| 字段 | 值 |
|------|-----|
| Make | Canon |
| Model | Canon EOS R5 |
| DateTimeOriginal | 2024:06:20 15:30:22 |
| ExposureTime | 1/500 |
| FNumber | 2.8 |
| ISO | 400 |
| FocalLength | 85 |
| WhiteBalance | Manual |
| Flash | Flash did not fire |

## GPS 坐标格式

EXIF 中的 GPS 坐标存储为度分秒（DMS）格式，本工具自动转换为十进制度数（DD）格式，可直接粘贴到地图搜索：

```
39.9042, 116.4074
```

→ 对应北京天安门广场附近


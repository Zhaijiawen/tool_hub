# 图片 EXIF — 示例数据

## 典型 iPhone 照片

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

FocalLengthIn35mmFilm 这个字段值得留意——iPhone 实际镜头焦距是 6.765mm，但 35mm 等效焦距是 24mm，后者更能说明视野角。大多数手机都会报这个等效值。

## 典型 DSLR 照片

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

单反记录的信息更全——白平衡模式、测光模式、曝光补偿都有。如果你在学摄影，拿喜欢的照片对比 EXIF 参数是学习曝光设置的好方法。

## GPS 坐标格式

EXIF 里 GPS 存的是度分秒（DMS）格式，这个工具自动帮你转成十进制度数（DD），直接能贴到地图搜索：

```
39.9042, 116.4074
```

贴进高德或百度地图，会定位到北京天安门广场附近。GPS 精度通常能做到几米以内。

## 分享照片前的隐私检查

在网上分享照片之前——尤其是对陌生人（闲鱼卖东西、论坛发帖等）——先用这个工具过一遍 GPS 标签。如果有不想透露的坐标，手机设置里可以关掉照片位置记录。iPhone 在「设置 > 隐私与安全性 > 定位服务 > 相机」，Android 因品牌而异，一般在相机 App 的设置菜单里。

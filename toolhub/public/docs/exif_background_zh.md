# 图片 EXIF 查看器 — 照片里藏了什么

EXIF 是相机和手机拍照时自动写入文件的元数据。这个标准从 1995 年就有了，是 JEITA 制定的，绝大多数 JPEG 和 TIFF 照片都会自带 EXIF。

## 记录了哪些信息

**设备信息 —** Make（制造商，比如 Apple、Canon、Nikon）和 Model（具体型号，比如 iPhone 15 Pro）。还有 Software 字段，一般是操作系统版本或者最后处理过这张图的软件。

**拍摄参数 —** ExposureTime（快门速度，比如 1/1000）、FNumber（光圈 f 值，比如 f/1.8）、ISO 感光度、FocalLength 焦距（mm）、Flash（闪光灯有没有触发）。玩摄影的话这些是必看的，能还原当时怎么拍的。

**时间 —** 有 DateTime（文件修改时间）和 DateTimeOriginal（快门按下的实际时间）。一般关注后者。

**GPS —** 纬度、经度、海拔。手机拍照默认记录 GPS，精度足够定位到具体是哪栋楼。

## 隐私问题：GPS 是最容易被忽略的

照片里的 GPS 信息经常被忽视，记住这几件事：

- 微信、Instagram 等社交平台上传图片时会自动剥离 EXIF，包括 GPS
- 但如果发的是原文件——邮件附件、AirDrop、文件传输——所有 EXIF 数据都跟着走
- 在闲鱼上卖东西拍了家里的照片，GPS 坐标直接暴露你家地址

## 用的什么库

底层是 `exifr`，支持解析 JPEG、TIFF、HEIC、PNG、WebP 等多种格式的 EXIF、XMP、IPTC 数据。完全在浏览器里跑。

# 图片 EXIF 查看器 技术背景

## 什么是 EXIF？

EXIF（Exchangeable Image File Format，可交换图像文件格式）是一种存储在图像文件中的元数据标准，由日本电子工业发展协会（JEITA）于 1995 年制定。

绝大多数数码相机和智能手机拍摄的 JPEG 和 TIFF 图片都会自动写入 EXIF 信息。

## 常见 EXIF 字段

### 设备信息
- **Make**：相机制造商（如 Apple、Canon、Nikon）
- **Model**：具体型号（如 iPhone 15 Pro）
- **Software**：处理软件版本

### 拍摄参数
- **ExposureTime**：快门速度（如 1/1000）
- **FNumber**：光圈 f 值（如 f/1.8）
- **ISO**：感光度
- **FocalLength**：焦距（mm）
- **Flash**：是否使用闪光灯

### 时间信息
- **DateTime**：文件修改时间
- **DateTimeOriginal**：实际拍摄时间

### GPS 信息
- **GPSLatitude**：纬度
- **GPSLongitude**：经度
- **GPSAltitude**：海拔高度

## 隐私注意事项

GPS 信息可以精确定位拍摄地点，在分享照片前请注意：
- 使用微信、Instagram 等平台分享通常会自动剥离 GPS 信息
- 通过邮件或 AirDrop 直接传输的原图保留完整 EXIF

## 本工具使用的库

基于 `exifr`（npm），支持解析 JPEG、TIFF、HEIC、PNG、WebP 等多种格式的 EXIF、XMP、IPTC 数据。


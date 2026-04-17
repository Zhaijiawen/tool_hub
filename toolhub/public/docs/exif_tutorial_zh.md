# 图片 EXIF 查看器 使用教程

## 上传图片

**方法 1**：直接将图片文件拖拽到上传区
**方法 2**：点击上传区，在文件选择器中选择图片

支持 JPEG、TIFF、HEIC（iPhone 格式）等含 EXIF 信息的格式。

## 查看基本信息

上传后切换到「基本信息」Tab，可以看到：
- 相机品牌和型号
- 拍摄时间（DateTimeOriginal）
- 图片分辨率
- 色彩空间

## 查看拍摄参数

切换到「拍摄参数」Tab，可以看到：
- **快门速度**（ExposureTime）：如 1/125 秒
- **光圈**（FNumber）：如 f/2.8
- **ISO 感光度**：如 ISO 800
- **焦距**（FocalLength）：如 24mm
- **闪光灯**（Flash）：是否触发

## 查看 GPS 位置

切换到「GPS」Tab，如果有 GPS 数据：
- 显示纬度（GPSLatitude）和经度（GPSLongitude）
- 点击复制，可以直接粘贴到 Google Maps 或高德地图搜索

## 复制数据

- 点击每行右侧「复制」按钮：复制该字段值
- 点击顶部「复制全部 EXIF」：将所有字段以 `key: value` 格式复制

## 常见问题

**Q：上传了图片但显示"不含 EXIF 信息"？**

A：以下情况会导致无 EXIF：
1. 图片是截图
2. 通过微信/微博等平台下载的图片（平台已清除 EXIF）
3. 经过 Photoshop 等软件保存（可能移除 EXIF）
4. PNG 格式（PNG 不支持标准 EXIF）


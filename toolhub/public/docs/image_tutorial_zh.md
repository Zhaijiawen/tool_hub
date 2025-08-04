# 图像处理使用教程

## 简介

本教程提供了实施和使用图像处理操作的全面指导，包括格式转换、压缩、几何变换和水印处理。每个部分都包含实用示例、最佳实践和性能考虑。

## 图像格式转换和压缩

### 理解图像格式

**选择合适的格式**
- **JPEG**：用于照片、复杂图像和文件大小重要的Web内容
- **PNG**：用于需要透明度、锐利边缘或无损质量的图形
- **WebP**：用于需要比JPEG/PNG更好压缩的现代Web应用
- **AVIF**：用于需要最大压缩效率的前沿应用

**质量与文件大小的权衡**
```
JPEG质量指南：
- 90-100：高质量，大文件（存档、打印）
- 70-89：良好质量，中等文件（Web、一般用途）
- 50-69：可接受质量，较小文件（缩略图、预览）
- 30-49：低质量，很小文件（图标、占位符）
```

### 格式转换最佳实践

**渐进式转换策略**
1. 从可用的最高质量源开始
2. 使用适当的质量设置转换为目标格式
3. 验证输出质量和文件大小
4. 如有必要，迭代以找到最佳平衡

**批处理指南**
```javascript
// 批转换工作流示例
const conversionQueue = [
  { input: 'photo.jpg', output: 'photo_webp.webp', quality: 80 },
  { input: 'logo.png', output: 'logo_jpeg.jpg', quality: 90 },
  { input: 'icon.png', output: 'icon_avif.avif', quality: 85 }
];

// 处理错误处理和进度跟踪
for (const task of conversionQueue) {
  try {
    await convertImage(task.input, task.output, task.quality);
    console.log(`已转换: ${task.input} → ${task.output}`);
  } catch (error) {
    console.error(`转换失败 ${task.input}:`, error);
  }
}
```

### 压缩优化

**有损压缩技术**
- **量化**：根据图像内容调整质量参数
- **子采样**：对彩色图像使用色度子采样
- **渐进编码**：对大图像启用以提高感知加载速度

**无损压缩策略**
- **优化**：使用工具移除不必要的元数据
- **调色板优化**：减少PNG-8图像的颜色调色板
- **压缩级别**：平衡压缩时间和文件大小

## 几何变换

### 图像旋转

**旋转实现**
```python
def rotate_image(image, angle, center=None, scale=1.0):
    """
    围绕中心点按给定角度旋转图像
    
    参数：
        image: 输入图像数组
        angle: 旋转角度（度）（正数=逆时针）
        center: 旋转中心点(x, y)，默认为图像中心
        scale: 输出图像的缩放因子
    
    返回：
        旋转后的图像数组
    """
    import cv2
    import numpy as np
    
    # 获取图像尺寸
    height, width = image.shape[:2]
    
    # 如果未提供，计算旋转中心
    if center is None:
        center = (width // 2, height // 2)
    
    # 获取旋转矩阵
    rotation_matrix = cv2.getRotationMatrix2D(center, angle, scale)
    
    # 计算新图像尺寸
    cos = np.abs(rotation_matrix[0, 0])
    sin = np.abs(rotation_matrix[0, 1])
    new_width = int((height * sin) + (width * cos))
    new_height = int((height * cos) + (width * sin))
    
    # 调整新尺寸的旋转矩阵
    rotation_matrix[0, 2] += (new_width / 2) - center[0]
    rotation_matrix[1, 2] += (new_height / 2) - center[1]
    
    # 执行旋转
    rotated_image = cv2.warpAffine(image, rotation_matrix, (new_width, new_height))
    
    return rotated_image
```

**旋转最佳实践**
- **插值**：大多数情况使用双线性插值，高质量结果使用双三次插值
- **抗锯齿**：启用平滑边缘，特别是文本和图形
- **内存管理**：考虑大旋转的图像大小限制
- **批处理**：为多个旋转实现队列系统

### 图像裁剪

**矩形裁剪**
```javascript
function cropImage(imageData, x, y, width, height) {
    // 验证裁剪参数
    if (x < 0 || y < 0 || width <= 0 || height <= 0) {
        throw new Error('无效的裁剪参数');
    }
    
    if (x + width > imageData.width || y + height > imageData.height) {
        throw new Error('裁剪区域超出图像边界');
    }
    
    // 为裁剪图像创建新画布
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = width;
    canvas.height = height;
    
    // 绘制裁剪区域
    ctx.drawImage(
        imageData,
        x, y, width, height,  // 源矩形
        0, 0, width, height   // 目标矩形
    );
    
    return canvas;
}
```

**智能裁剪技术**
- **宽高比保持**：保持原始比例或强制特定比例
- **内容感知裁剪**：使用AI/ML识别重要图像区域
- **人脸检测**：自动裁剪以包含检测到的人脸
- **三分法则**：应用摄影构图指南

### 缩放和调整大小

**调整大小算法**
```python
def resize_image(image, target_width, target_height, method='bilinear'):
    """
    使用指定插值方法调整图像大小
    
    方法：
    - 'nearest': 快速，像素化结果
    - 'bilinear': 速度和质量的良好平衡
    - 'bicubic': 高质量，较慢
    - 'lanczos': 最佳质量，最慢
    """
    import cv2
    
    interpolation_methods = {
        'nearest': cv2.INTER_NEAREST,
        'bilinear': cv2.INTER_LINEAR,
        'bicubic': cv2.INTER_CUBIC,
        'lanczos': cv2.INTER_LANCZOS4
    }
    
    method = interpolation_methods.get(method, cv2.INTER_LINEAR)
    
    resized = cv2.resize(image, (target_width, target_height), 
                        interpolation=method)
    
    return resized
```

**缩放最佳实践**
- **放大**：使用双三次或Lanczos获得更好质量
- **缩小**：速度用双线性，质量用双三次
- **宽高比**：保持比例，除非故意失真
- **多种尺寸**：生成缩略图和响应式图像尺寸

## 水印实现

### 可见水印

**文本水印实现**
```javascript
function addTextWatermark(image, text, options = {}) {
    const {
        position = 'bottom-right',
        fontSize = 24,
        fontFamily = 'Arial',
        color = 'rgba(255, 255, 255, 0.7)',
        padding = 10
    } = options;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布尺寸
    canvas.width = image.width;
    canvas.height = image.height;
    
    // 绘制原始图像
    ctx.drawImage(image, 0, 0);
    
    // 配置文本样式
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    
    // 计算位置
    const textMetrics = ctx.measureText(text);
    let x, y;
    
    switch (position) {
        case 'top-left':
            x = padding;
            y = fontSize + padding;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            break;
        case 'top-right':
            x = canvas.width - padding;
            y = fontSize + padding;
            ctx.textBaseline = 'top';
            break;
        case 'bottom-left':
            x = padding;
            y = canvas.height - padding;
            ctx.textAlign = 'left';
            break;
        case 'bottom-right':
        default:
            x = canvas.width - padding;
            y = canvas.height - padding;
            break;
    }
    
    // 添加文本阴影以提高可见性
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    
    // 绘制水印文本
    ctx.fillText(text, x, y);
    
    return canvas;
}
```

**图像水印实现**
```python
def add_image_watermark(base_image, watermark_image, position='bottom-right', opacity=0.7):
    """
    向基础图像添加图像水印
    
    参数：
        base_image: 要添加水印的主图像
        watermark_image: 要叠加的水印图像
        position: 水印位置('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center')
        opacity: 水印透明度(0.0到1.0)
    
    返回：
        添加水印的图像
    """
    import cv2
    import numpy as np
    
    # 获取图像尺寸
    base_height, base_width = base_image.shape[:2]
    wm_height, wm_width = watermark_image.shape[:2]
    
    # 计算水印位置
    if position == 'top-left':
        x, y = 10, 10
    elif position == 'top-right':
        x, y = base_width - wm_width - 10, 10
    elif position == 'bottom-left':
        x, y = 10, base_height - wm_height - 10
    elif position == 'bottom-right':
        x, y = base_width - wm_width - 10, base_height - wm_height - 10
    elif position == 'center':
        x = (base_width - wm_width) // 2
        y = (base_height - wm_height) // 2
    else:
        x, y = 10, 10
    
    # 为水印放置创建ROI
    roi = base_image[y:y+wm_height, x:x+wm_width]
    
    # 将水印与ROI混合
    if watermark_image.shape[2] == 4:  # RGBA水印
        alpha = watermark_image[:, :, 3] / 255.0 * opacity
        for c in range(3):
            roi[:, :, c] = (1 - alpha) * roi[:, :, c] + alpha * watermark_image[:, :, c]
    else:  # RGB水印
        blended = cv2.addWeighted(roi, 1 - opacity, watermark_image, opacity, 0)
        base_image[y:y+wm_height, x:x+wm_width] = blended
    
    return base_image
```

### 隐形水印

**LSB隐写术实现**
```python
def embed_lsb_watermark(image, watermark_text):
    """
    使用LSB隐写术嵌入文本水印
    
    参数：
        image: 输入图像数组
        watermark_text: 要嵌入的文本
    
    返回：
        嵌入水印的图像
    """
    import numpy as np
    
    # 将文本转换为二进制
    binary_text = ''.join(format(ord(char), '08b') for char in watermark_text)
    binary_text += '00000000'  # 空终止符
    
    # 展平图像
    flat_image = image.flatten()
    
    # 检查图像是否能容纳水印
    if len(binary_text) > len(flat_image):
        raise ValueError("图像太小，无法容纳水印")
    
    # 嵌入水印
    for i, bit in enumerate(binary_text):
        flat_image[i] = (flat_image[i] & 0xFE) | int(bit)
    
    # 重塑回原始尺寸
    watermarked_image = flat_image.reshape(image.shape)
    
    return watermarked_image.astype(np.uint8)

def extract_lsb_watermark(image):
    """
    使用LSB隐写术从图像中提取文本水印
    
    参数：
        image: 嵌入水印的图像
    
    返回：
        提取的文本
    """
    import numpy as np
    
    # 展平图像
    flat_image = image.flatten()
    
    # 提取二进制数据
    binary_data = ''
    for i in range(len(flat_image)):
        binary_data += str(flat_image[i] & 1)
        
        # 检查空终止符
        if len(binary_data) >= 8 and binary_data[-8:] == '00000000':
            break
    
    # 将二进制转换为文本
    text = ''
    for i in range(0, len(binary_data) - 8, 8):
        byte = binary_data[i:i+8]
        if byte == '00000000':
            break
        text += chr(int(byte, 2))
    
    return text
```

## 性能优化

### 内存管理

**流式处理**
```python
def process_large_image(input_path, output_path, operation_func):
    """
    使用流式处理大图像以管理内存
    
    参数：
        input_path: 输入图像路径
        output_path: 输出图像路径
        operation_func: 应用于图像瓦片的函数
    """
    from PIL import Image
    import numpy as np
    
    # 打开图像
    with Image.open(input_path) as img:
        # 获取图像尺寸
        width, height = img.size
        
        # 定义瓦片大小（根据可用内存调整）
        tile_size = 1024
        
        # 创建输出图像
        output_img = Image.new(img.mode, img.size)
        
        # 按瓦片处理图像
        for y in range(0, height, tile_size):
            for x in range(0, width, tile_size):
                # 计算瓦片尺寸
                tile_width = min(tile_size, width - x)
                tile_height = min(tile_size, height - y)
                
                # 提取瓦片
                tile = img.crop((x, y, x + tile_width, y + tile_height))
                tile_array = np.array(tile)
                
                # 应用操作
                processed_tile = operation_func(tile_array)
                
                # 粘贴处理的瓦片
                output_img.paste(Image.fromarray(processed_tile), (x, y))
        
        # 保存输出
        output_img.save(output_path)
```

### 批处理

**高效批操作**
```javascript
class ImageProcessor {
    constructor(maxConcurrent = 4) {
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.processing = 0;
    }
    
    async addTask(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({ task, resolve, reject });
            this.processQueue();
        });
    }
    
    async processQueue() {
        if (this.processing >= this.maxConcurrent || this.queue.length === 0) {
            return;
        }
        
        this.processing++;
        const { task, resolve, reject } = this.queue.shift();
        
        try {
            const result = await this.processImage(task);
            resolve(result);
        } catch (error) {
            reject(error);
        } finally {
            this.processing--;
            this.processQueue();
        }
    }
    
    async processImage(task) {
        // 实现特定的图像处理逻辑
        const { input, output, operation, params } = task;
        
        // 加载图像
        const image = await this.loadImage(input);
        
        // 应用操作
        let processed;
        switch (operation) {
            case 'resize':
                processed = await this.resizeImage(image, params);
                break;
            case 'crop':
                processed = await this.cropImage(image, params);
                break;
            case 'watermark':
                processed = await this.addWatermark(image, params);
                break;
            default:
                throw new Error(`未知操作: ${operation}`);
        }
        
        // 保存结果
        await this.saveImage(processed, output);
        
        return { input, output, success: true };
    }
}
```

## 错误处理和验证

### 输入验证

**全面验证**
```python
def validate_image_input(image_path, allowed_formats=None, max_size_mb=50):
    """
    处理前验证图像输入
    
    参数：
        image_path: 图像文件路径
        allowed_formats: 允许的文件扩展名列表
        max_size_mb: 最大文件大小（MB）
    
    返回：
        包含详细信息的验证结果
    """
    import os
    from PIL import Image
    
    result = {
        'valid': True,
        'errors': [],
        'warnings': []
    }
    
    # 检查文件存在性
    if not os.path.exists(image_path):
        result['valid'] = False
        result['errors'].append(f"文件未找到: {image_path}")
        return result
    
    # 检查文件大小
    file_size_mb = os.path.getsize(image_path) / (1024 * 1024)
    if file_size_mb > max_size_mb:
        result['valid'] = False
        result['errors'].append(f"文件过大: {file_size_mb:.2f}MB > {max_size_mb}MB")
    
    # 检查文件格式
    if allowed_formats:
        file_ext = os.path.splitext(image_path)[1].lower()
        if file_ext not in allowed_formats:
            result['valid'] = False
            result['errors'].append(f"不支持的格式: {file_ext}")
    
    # 验证图像数据
    try:
        with Image.open(image_path) as img:
            # 检查图像尺寸
            width, height = img.size
            if width > 10000 or height > 10000:
                result['warnings'].append(f"大图像尺寸: {width}x{height}")
            
            # 检查颜色模式
            if img.mode not in ['RGB', 'RGBA', 'L', 'P']:
                result['warnings'].append(f"异常颜色模式: {img.mode}")
                
    except Exception as e:
        result['valid'] = False
        result['errors'].append(f"无效图像文件: {str(e)}")
    
    return result
```

### 错误恢复

**优雅错误处理**
```javascript
async function processImageWithFallback(imageData, operations) {
    const results = [];
    
    for (const operation of operations) {
        try {
            const result = await applyImageOperation(imageData, operation);
            results.push({
                operation: operation.name,
                success: true,
                result: result
            });
            
            // 使用结果作为下一个操作的输入
            imageData = result;
            
        } catch (error) {
            console.warn(`操作 ${operation.name} 失败:`, error);
            
            results.push({
                operation: operation.name,
                success: false,
                error: error.message
            });
            
            // 使用前一个结果继续下一个操作
            continue;
        }
    }
    
    return {
        finalResult: imageData,
        operationResults: results,
        success: results.some(r => r.success)
    };
}
```

## 最佳实践总结

### 质量指南

**格式选择**
- 照片和复杂图像使用JPEG
- 需要透明度的图形使用PNG
- 现代Web应用使用WebP
- 最大压缩效率使用AVIF

**压缩设置**
- JPEG：Web用70-85质量，打印用90+
- PNG：使用优化工具获得更小文件
- WebP：80-90质量获得良好平衡
- AVIF：70-85质量获得出色压缩

### 性能技巧

**处理优化**
- 缩放使用适当的插值方法
- 多个图像实现批处理
- 大图像应用内存管理
- 尽可能使用并行处理

**用户体验**
- 长时间操作提供进度指示器
- 实现预览功能
- 允许操作取消
- 显示前后对比

### 安全考虑

**输入验证**
- 验证所有输入参数
- 检查文件格式和大小
- 必要时清理元数据
- 批操作实现速率限制

**输出安全**
- 移除敏感元数据
- 验证输出文件完整性
- 实现访问控制
- 记录处理活动

本教程为实施具有适当错误处理、性能优化和安全考虑的强大图像处理功能提供了全面基础。 
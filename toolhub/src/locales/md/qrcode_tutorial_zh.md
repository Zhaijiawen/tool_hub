# 二维码使用教程

## 简介

本教程提供了实施和使用二维码生成功能的全面指导。它涵盖了各种用例的实用示例、最佳实践、参数选择和性能优化。

## 基础二维码生成

### 理解参数

**基本参数**
- **数据**：要编码的内容（文本、URL、联系信息等）
- **纠错级别**：L（7%）、M（15%）、Q（25%）、H（30%）
- **版本**：二维码大小（1-40，未指定时自动选择）
- **模块大小**：每个黑白方块的像素大小
- **静区**：二维码周围的白色边框（最少4个模块）

**参数选择指南**
```
纠错级别选择：
- L级别：清洁环境，大打印尺寸，最大数据容量
- M级别：通用目的，平衡方法（推荐默认值）
- Q级别：挑战环境，较小尺寸，中等损坏容差
- H级别：最大可靠性，损坏/部分遮挡的代码
```

### 基础实现

**简单二维码生成**
```python
import qrcode

def generate_basic_qr(data, filename="qrcode.png"):
    """生成基础二维码"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img

# 使用示例
generate_basic_qr("https://example.com", "website_qr.png")
generate_basic_qr("Hello, World!", "text_qr.png")
```

**JavaScript实现**
```javascript
// 使用qrcode.js库
function generateQRCode(data, containerId) {
    const qrcode = new QRCode(containerId, {
        text: data,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

// 使用
generateQRCode("https://example.com", "qrcode-container");
```

## 高级二维码功能

### 自定义样式

**颜色定制**
```python
def generate_colored_qr(data, foreground_color, background_color, filename):
    """生成自定义颜色的二维码"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # 颜色需要更高纠错
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color=foreground_color, back_color=background_color)
    img.save(filename)
    return img

# 使用
generate_colored_qr("自定义二维码", "#FF6B6B", "#4ECDC4", "colored_qr.png")
```

**Logo集成**
```python
from PIL import Image

def generate_qr_with_logo(data, logo_path, filename, logo_size=0.3):
    """生成嵌入Logo的二维码"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # Logo需要高纠错
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    qr_image = qr.make_image(fill_color="black", back_color="white").convert('RGBA')
    
    # 添加Logo
    logo = Image.open(logo_path).convert("RGBA")
    logo_size_pixels = int(qr_image.size[0] * logo_size)
    logo = logo.resize((logo_size_pixels, logo_size_pixels))
    
    # 计算位置（中心）
    pos = ((qr_image.size[0] - logo_size_pixels) // 2,
           (qr_image.size[1] - logo_size_pixels) // 2)
    
    qr_image.paste(logo, pos, logo)
    qr_image.save(filename)
    return qr_image
```

### 数据类型优化

**URL编码**
```python
def generate_url_qr(url, filename):
    """生成针对URL优化的二维码"""
    # 验证URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    qr = qrcode.QRCode(
        version=None,  # 自动选择版本
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img
```

**联系信息（vCard）**
```python
def generate_contact_qr(name, phone, email, company="", filename="contact_qr.png"):
    """生成包含联系信息的二维码"""
    vcard_data = f"""BEGIN:VCARD
VERSION:3.0
FN:{name}
TEL:{phone}
EMAIL:{email}
ORG:{company}
END:VCARD"""
    
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(vcard_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img
```

**WiFi配置**
```python
def generate_wifi_qr(ssid, password, security="WPA", filename="wifi_qr.png"):
    """生成WiFi配置二维码"""
    wifi_data = f"WIFI:S:{ssid};T:{security};P:{password};;"
    
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(wifi_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)
    return img
```

## 批处理

### 多个二维码生成

**批处理实现**
```python
import os
from typing import List, Dict

def batch_generate_qr(data_list: List[Dict], output_dir: str):
    """从数据列表生成多个二维码"""
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    for i, item in enumerate(data_list):
        try:
            filename = f"qr_{i+1:03d}.png"
            filepath = os.path.join(output_dir, filename)
            
            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=10,
                border=4
            )
            qr.add_data(item['data'])
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save(filepath)
            
            results.append({
                'index': i,
                'data': item['data'],
                'filename': filename,
                'success': True
            })
            
        except Exception as e:
            results.append({
                'index': i,
                'data': item['data'],
                'error': str(e),
                'success': False
            })
    
    return results

# 使用
data_list = [
    {'data': 'https://example1.com'},
    {'data': 'https://example2.com'},
    {'data': '联系人：张三，123-456-7890'}
]

results = batch_generate_qr(data_list, "output_qrcodes")
```

### 性能优化

**并行处理**
```python
import concurrent.futures
from functools import partial

def generate_single_qr(data, output_dir, index):
    """生成单个二维码"""
    filename = f"qr_{index:03d}.png"
    filepath = os.path.join(output_dir, filename)
    
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=4
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filepath)
    return {'index': index, 'filename': filename, 'success': True}

def parallel_batch_generate_qr(data_list: List[str], output_dir: str, max_workers=4):
    """使用并行处理生成二维码"""
    os.makedirs(output_dir, exist_ok=True)
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = [
            executor.submit(generate_single_qr, data, output_dir, i)
            for i, data in enumerate(data_list)
        ]
        
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    
    return sorted(results, key=lambda x: x['index'])
```

## 错误处理和验证

### 输入验证

**数据验证**
```python
def validate_qr_data(data, max_length=2953):
    """验证二维码生成数据"""
    if not data or not isinstance(data, str):
        raise ValueError("数据必须是非空字符串")
    
    if len(data.encode('utf-8')) > max_length:
        raise ValueError(f"数据过长。最多允许{max_length}字节。")
    
    # 检查问题字符
    problematic_chars = ['\x00', '\x01', '\x02', '\x03', '\x04', '\x05', '\x06', '\x07']
    for char in problematic_chars:
        if char in data:
            raise ValueError(f"数据包含问题字符：{repr(char)}")
    
    return True

def safe_generate_qr(data, filename, **kwargs):
    """安全生成带验证的二维码"""
    try:
        validate_qr_data(data)
        
        qr = qrcode.QRCode(
            version=kwargs.get('version', None),
            error_correction=kwargs.get('error_correction', qrcode.constants.ERROR_CORRECT_M),
            box_size=kwargs.get('box_size', 10),
            border=kwargs.get('border', 4)
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(
            fill_color=kwargs.get('fill_color', 'black'),
            back_color=kwargs.get('back_color', 'white')
        )
        img.save(filename)
        return img
        
    except Exception as e:
        print(f"生成二维码时出错：{e}")
        return None
```

### 错误恢复

**优雅错误处理**
```python
def robust_batch_generate_qr(data_list, output_dir):
    """具有强大错误处理的二维码生成"""
    os.makedirs(output_dir, exist_ok=True)
    
    successful = []
    failed = []
    
    for i, data in enumerate(data_list):
        try:
            filename = f"qr_{i+1:03d}.png"
            filepath = os.path.join(output_dir, filename)
            
            result = safe_generate_qr(data, filepath)
            
            if result:
                successful.append({
                    'index': i,
                    'data': data,
                    'filename': filename
                })
            else:
                failed.append({
                    'index': i,
                    'data': data,
                    'error': '生成失败'
                })
                
        except Exception as e:
            failed.append({
                'index': i,
                'data': data,
                'error': str(e)
            })
    
    return {
        'successful': successful,
        'failed': failed,
        'total': len(data_list),
        'success_rate': len(successful) / len(data_list) * 100
    }
```

## 最佳实践

### 参数选择

**版本选择**
```python
def estimate_qr_version(data, error_correction_level='M'):
    """估算给定数据所需的二维码版本"""
    # 简化估算
    data_bytes = len(data.encode('utf-8'))
    
    # 每个版本的近似容量（M级别）
    capacities = {
        1: 14, 2: 26, 3: 42, 4: 62, 5: 84, 6: 106, 7: 130, 8: 154,
        9: 182, 10: 213, 11: 251, 12: 287, 13: 331, 14: 362, 15: 412,
        16: 450, 17: 504, 18: 560, 19: 624, 20: 666, 21: 711, 22: 779,
        23: 857, 24: 911, 25: 997, 26: 1059, 27: 1125, 28: 1190, 29: 1264,
        30: 1370, 31: 1452, 32: 1538, 33: 1628, 34: 1722, 35: 1809,
        36: 1911, 37: 1989, 38: 2099, 39: 2213, 40: 2334
    }
    
    for version, capacity in capacities.items():
        if data_bytes <= capacity:
            return version
    
    raise ValueError("数据对二维码来说太大（最大版本40）")
```

**纠错级别选择**
```python
def select_error_correction_level(use_case, environment, data_size):
    """选择适当的纠错级别"""
    if use_case == 'print_large':
        return 'L'  # 大打印，清洁环境
    elif use_case == 'web_display':
        return 'M'  # 通用目的
    elif use_case == 'small_print':
        return 'Q'  # 较小尺寸，中等损坏容差
    elif use_case == 'damaged_expected':
        return 'H'  # 最大可靠性
    else:
        return 'M'  # 默认
```

### 质量保证

**二维码验证**
```python
def validate_generated_qr(filepath):
    """验证生成的二维码文件"""
    try:
        # 检查文件存在且可读
        if not os.path.exists(filepath):
            return False, "文件不存在"
        
        # 检查文件大小
        file_size = os.path.getsize(filepath)
        if file_size < 100:  # 最小合理大小
            return False, "文件太小"
        
        # 尝试作为图像打开
        img = Image.open(filepath)
        width, height = img.size
        
        if width < 50 or height < 50:  # 最小合理尺寸
            return False, "图像太小"
        
        return True, "有效二维码"
        
    except Exception as e:
        return False, f"验证错误：{str(e)}"
```

## 性能优化

### 内存管理

**高效处理**
```python
def memory_efficient_batch_generate(data_list, output_dir, batch_size=10):
    """具有内存管理的二维码生成"""
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i:i+batch_size]
        
        for j, data in enumerate(batch):
            index = i + j
            filename = f"qr_{index+1:03d}.png"
            filepath = os.path.join(output_dir, filename)
            
            qr = qrcode.QRCode(
                version=None,
                error_correction=qrcode.constants.ERROR_CORRECT_M,
                box_size=10,
                border=4
            )
            qr.add_data(data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save(filepath)
            img.close()  # 显式关闭以释放内存
        
        # 可选：批次间添加延迟
        import time
        time.sleep(0.1)
```

### 缓存策略

**结果缓存**
```python
import hashlib
import json

class QRCodeCache:
    def __init__(self, cache_dir="qr_cache"):
        self.cache_dir = cache_dir
        os.makedirs(cache_dir, exist_ok=True)
    
    def _get_cache_key(self, data, **params):
        """从数据和参数生成缓存键"""
        param_str = json.dumps(params, sort_keys=True)
        content = f"{data}:{param_str}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def get_cached_qr(self, data, **params):
        """如果可用则获取缓存的二维码"""
        cache_key = self._get_cache_key(data, **params)
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.png")
        
        if os.path.exists(cache_file):
            return cache_file
        return None
    
    def cache_qr(self, data, qr_image, **params):
        """缓存生成的二维码"""
        cache_key = self._get_cache_key(data, **params)
        cache_file = os.path.join(self.cache_dir, f"{cache_key}.png")
        qr_image.save(cache_file)
        return cache_file

# 使用
cache = QRCodeCache()
cached_file = cache.get_cached_qr("https://example.com", error_correction='M')
if cached_file:
    print(f"使用缓存的二维码：{cached_file}")
else:
    # 生成新二维码并缓存
    qr = generate_basic_qr("https://example.com")
    cache.cache_qr("https://example.com", qr, error_correction='M')
```

本教程为实施具有适当错误处理、性能优化和最佳实践的强大二维码生成功能提供了全面指导。 
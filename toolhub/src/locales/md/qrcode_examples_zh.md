# 二维码示例

## 基础示例

### 简单文本二维码
```python
import qrcode

# 生成简单文本的二维码
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("Hello, World!")
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("hello_world_qr.png")
```

### URL二维码
```python
import qrcode

# 生成网站URL的二维码
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("https://www.example.com")
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("website_qr.png")
```

### 联系信息（vCard）
```python
import qrcode

# 生成包含联系信息的二维码
vcard_data = """BEGIN:VCARD
VERSION:3.0
FN:张三
TEL:+86-138-1234-5678
EMAIL:zhangsan@example.com
ORG:示例公司
TITLE:软件工程师
ADR:北京市朝阳区某某街道123号
END:VCARD"""

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(vcard_data)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("contact_qr.png")
```

### WiFi配置
```python
import qrcode

# 生成WiFi网络的二维码
wifi_data = "WIFI:S:我的WiFi网络;T:WPA;P:我的密码123;;"

qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(wifi_data)
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("wifi_qr.png")
```

## 高级示例

### 自定义颜色
```python
import qrcode

# 生成自定义颜色的二维码
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("自定义颜色二维码")
qr.make(fit=True)

# 使用自定义颜色（前景色和背景色）
img = qr.make_image(fill_color="#FF6B6B", back_color="#4ECDC4")
img.save("colored_qr.png")
```

### 带Logo的二维码
```python
import qrcode
from PIL import Image

# 生成二维码
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data("https://www.example.com")
qr.make(fit=True)

# 创建二维码图像
qr_image = qr.make_image(fill_color="black", back_color="white").convert('RGBA')

# 打开并调整Logo大小
logo = Image.open("logo.png").convert("RGBA")
logo_size = int(qr_image.size[0] * 0.3)  # Logo大小 = 二维码的30%
logo = logo.resize((logo_size, logo_size))

# 计算居中位置
pos = ((qr_image.size[0] - logo_size) // 2, (qr_image.size[1] - logo_size) // 2)

# 将Logo粘贴到二维码上
qr_image.paste(logo, pos, logo)
qr_image.save("qr_with_logo.png")
```

### 不同纠错级别
```python
import qrcode

# 生成不同纠错级别的二维码
text = "二维码示例文本"

# L级别（低） - 7%恢复能力
qr_l = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=5)
qr_l.add_data(text)
qr_l.make(fit=True)
img_l = qr_l.make_image(fill_color="black", back_color="white")
img_l.save("qr_level_l.png")

# M级别（中） - 15%恢复能力（默认）
qr_m = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10, border=5)
qr_m.add_data(text)
qr_m.make(fit=True)
img_m = qr_m.make_image(fill_color="black", back_color="white")
img_m.save("qr_level_m.png")

# Q级别（四分之一） - 25%恢复能力
qr_q = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_Q, box_size=10, border=5)
qr_q.add_data(text)
qr_q.make(fit=True)
img_q = qr_q.make_image(fill_color="black", back_color="white")
img_q.save("qr_level_q.png")

# H级别（高） - 30%恢复能力
qr_h = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=5)
qr_h.add_data(text)
qr_h.make(fit=True)
img_h = qr_h.make_image(fill_color="black", back_color="white")
img_h.save("qr_level_h.png")
```

### 不同尺寸
```python
import qrcode

# 生成不同尺寸的二维码
text = "示例文本"

# 小尺寸（box_size=5）
qr_small = qrcode.QRCode(version=1, box_size=5, border=4)
qr_small.add_data(text)
qr_small.make(fit=True)
img_small = qr_small.make_image(fill_color="black", back_color="white")
img_small.save("qr_small.png")

# 中等尺寸（box_size=10）
qr_medium = qrcode.QRCode(version=1, box_size=10, border=4)
qr_medium.add_data(text)
qr_medium.make(fit=True)
img_medium = qr_medium.make_image(fill_color="black", back_color="white")
img_medium.save("qr_medium.png")

# 大尺寸（box_size=20）
qr_large = qrcode.QRCode(version=1, box_size=20, border=4)
qr_large.add_data(text)
qr_large.make(fit=True)
img_large = qr_large.make_image(fill_color="black", back_color="white")
img_large.save("qr_large.png")
```

## JavaScript示例

### 基础二维码生成
```javascript
// 使用qrcode.js库
function generateBasicQR(text, containerId) {
    const qrcode = new QRCode(containerId, {
        text: text,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

// 使用
generateBasicQR("Hello, World!", "qrcode-container");
```

### 自定义样式二维码
```javascript
function generateStyledQR(text, containerId) {
    const qrcode = new QRCode(containerId, {
        text: text,
        width: 300,
        height: 300,
        colorDark: "#FF6B6B",
        colorLight: "#4ECDC4",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// 使用
generateStyledQR("样式化二维码", "styled-qr-container");
```

### 带Logo的二维码（JavaScript）
```javascript
function generateQRWithLogo(text, containerId, logoUrl) {
    const qrcode = new QRCode(containerId, {
        text: text,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    // 添加Logo覆盖层
    const logo = document.createElement('img');
    logo.src = logoUrl;
    logo.style.position = 'absolute';
    logo.style.top = '50%';
    logo.style.left = '50%';
    logo.style.transform = 'translate(-50%, -50%)';
    logo.style.width = '60px';
    logo.style.height = '60px';
    
    document.getElementById(containerId).appendChild(logo);
}

// 使用
generateQRWithLogo("带Logo的二维码", "qr-logo-container", "logo.png");
```

## 批处理示例

### 生成多个二维码
```python
import qrcode
import os

def generate_multiple_qr_codes(data_list, output_dir):
    """从数据列表生成多个二维码"""
    os.makedirs(output_dir, exist_ok=True)
    
    for i, data in enumerate(data_list):
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(os.path.join(output_dir, f"qr_{i+1}.png"))

# 使用
data_list = [
    "https://example1.com",
    "https://example2.com",
    "联系人：张三",
    "WiFi：我的网络"
]

generate_multiple_qr_codes(data_list, "qr_codes_output")
```

### 带元数据的二维码
```python
import qrcode
import json

def generate_qr_with_metadata(data, metadata, filename):
    """生成包含嵌入元数据的二维码"""
    # 合并数据和元数据
    combined_data = {
        "data": data,
        "metadata": metadata,
        "timestamp": "2024-01-01T00:00:00Z"
    }
    
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(json.dumps(combined_data))
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filename)

# 使用
metadata = {
    "type": "product",
    "id": "12345",
    "category": "electronics"
}

generate_qr_with_metadata("产品信息", metadata, "product_qr.png")
```

## 错误处理示例

### 安全二维码生成
```python
import qrcode
import os

def safe_generate_qr(data, filename, max_length=2953):
    """安全生成带错误处理的二维码"""
    try:
        # 验证输入
        if not data or not isinstance(data, str):
            raise ValueError("数据必须是非空字符串")
        
        if len(data.encode('utf-8')) > max_length:
            raise ValueError(f"数据过长。最多允许{max_length}字节。")
        
        # 生成二维码
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        img.save(filename)
        
        return True, "二维码生成成功"
        
    except Exception as e:
        return False, f"生成二维码时出错：{str(e)}"

# 使用
success, message = safe_generate_qr("测试数据", "test_qr.png")
print(message)
```

### 带错误处理的批处理生成
```python
import qrcode
import os

def batch_generate_with_errors(data_list, output_dir):
    """生成多个带错误处理的二维码"""
    os.makedirs(output_dir, exist_ok=True)
    
    results = []
    for i, data in enumerate(data_list):
        try:
            filename = os.path.join(output_dir, f"qr_{i+1}.png")
            success, message = safe_generate_qr(data, filename)
            
            results.append({
                "index": i,
                "data": data,
                "success": success,
                "message": message,
                "filename": filename if success else None
            })
            
        except Exception as e:
            results.append({
                "index": i,
                "data": data,
                "success": False,
                "message": str(e),
                "filename": None
            })
    
    return results

# 使用
data_list = [
    "有效数据1",
    "",  # 无效空数据
    "有效数据2",
    "x" * 3000  # 无效长数据
]

results = batch_generate_with_errors(data_list, "batch_output")
for result in results:
    print(f"项目{result['index']}：{result['success']} - {result['message']}")
```

## 性能示例

### 内存高效生成
```python
import qrcode
import gc

def memory_efficient_batch_generate(data_list, output_dir, batch_size=10):
    """具有内存管理的二维码生成"""
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(0, len(data_list), batch_size):
        batch = data_list[i:i+batch_size]
        
        for j, data in enumerate(batch):
            index = i + j
            filename = os.path.join(output_dir, f"qr_{index+1}.png")
            
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(data)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            img.save(filename)
            img.close()  # 显式关闭以释放内存
        
        # 批次间强制垃圾回收
        gc.collect()

# 使用
large_data_list = [f"数据项{i}" for i in range(1000)]
memory_efficient_batch_generate(large_data_list, "large_batch_output")
```

### 缓存二维码生成
```python
import qrcode
import hashlib
import json
import os

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

def generate_cached_qr(data, **params):
    """带缓存的二维码生成"""
    # 首先检查缓存
    cached_file = cache.get_cached_qr(data, **params)
    if cached_file:
        print(f"使用缓存的二维码：{cached_file}")
        return cached_file
    
    # 生成新二维码
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # 缓存结果
    cache.cache_qr(data, img, **params)
    return img

# 使用
generate_cached_qr("缓存数据", error_correction='M')
```

这些示例演示了生成具有不同功能、错误处理和性能优化的二维码的各种方法。 
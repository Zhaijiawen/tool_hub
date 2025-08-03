# 编码方案使用教程

## 环境设置

### 前置条件
- 支持编码库的编程语言
- 二进制数据表示理解
- 字符编码概念知识
- 编码安全考虑意识

### 库选择

#### Python内置库
```python
import base64
import binascii
import urllib.parse
import html
import json
```

#### Node.js内置模块
```javascript
const crypto = require('crypto');
const querystring = require('querystring');
const Buffer = require('buffer');
```

#### Go标准库
```go
import (
    "encoding/base64"
    "encoding/hex"
    "net/url"
    "html"
    "encoding/json"
)
```

## 基本概念

### 编码概述
```python
def encoding_overview():
    """不同编码方案概述"""
    print("编码方案概述:")
    print("1. Base64: 二进制到文本编码 (A-Z, a-z, 0-9, +, /)")
    print("2. Hex: 二进制到十六进制 (0-9, A-F)")
    print("3. URL: URL的百分号编码")
    print("4. HTML: HTML的字符实体")
    print("5. JWT: 使用Base64URL的JSON Web令牌")

# 显示概述
encoding_overview()
```

### 字符集理解
```python
def character_sets():
    """理解不同编码的字符集"""
    print("字符集:")
    print("Base64: A-Z, a-z, 0-9, +, /, = (填充)")
    print("Hex: 0-9, A-F (大小写不敏感)")
    print("URL: ASCII + 百分号编码")
    print("HTML: Unicode + 实体引用")
    print("JWT: Base64URL (无填充，URL安全)")
```

## Base64编码

### 基本Base64操作
```python
import base64

def basic_base64_example():
    """基本Base64编码和解码"""
    # 原始数据
    original_data = b"Hello, Base64 encoding!"
    
    # 编码为Base64
    encoded_data = base64.b64encode(original_data)
    print(f"原始: {original_data}")
    print(f"Base64: {encoded_data.decode()}")
    
    # 从Base64解码
    decoded_data = base64.b64decode(encoded_data)
    print(f"解码: {decoded_data}")
    
    # 验证往返
    assert original_data == decoded_data
    print("✓ 往返验证成功")

basic_base64_example()
```

### 不同数据类型的Base64
```python
def base64_data_types():
    """不同数据类型的Base64编码"""
    # 字符串编码
    text = "Hello, World!"
    text_encoded = base64.b64encode(text.encode('utf-8'))
    print(f"文本: {text}")
    print(f"Base64: {text_encoded.decode()}")
    
    # 二进制数据编码
    binary_data = b'\x00\x01\x02\x03\x04\x05'
    binary_encoded = base64.b64encode(binary_data)
    print(f"二进制: {binary_data.hex()}")
    print(f"Base64: {binary_encoded.decode()}")
    
    # 文件类编码
    file_content = b"This is file content with special chars: !@#$%^&*()"
    file_encoded = base64.b64encode(file_content)
    print(f"文件内容: {file_content}")
    print(f"Base64: {file_encoded.decode()}")

base64_data_types()
```

### Base64URL编码
```python
def base64url_example():
    """Base64URL编码（URL安全的Base64）"""
    # 原始数据
    data = b"URL-safe encoding test"
    
    # 标准Base64
    standard_b64 = base64.b64encode(data)
    print(f"标准Base64: {standard_b64.decode()}")
    
    # Base64URL（用-替换+，用_替换/，移除填充）
    base64url = base64.urlsafe_b64encode(data)
    print(f"Base64URL: {base64url.decode()}")
    
    # 解码Base64URL
    decoded = base64.urlsafe_b64decode(base64url)
    print(f"解码: {decoded}")
    
    assert data == decoded
    print("✓ Base64URL往返成功")

base64url_example()
``` 
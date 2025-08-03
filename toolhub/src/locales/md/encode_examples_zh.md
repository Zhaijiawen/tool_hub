# 编码方案代码示例

## 基本编码操作

### Base64编码示例
```python
import base64

def base64_basic_examples():
    """基本Base64编码和解码示例"""
    # 字符串转Base64
    text = "Hello, World!"
    encoded = base64.b64encode(text.encode('utf-8'))
    decoded = base64.b64decode(encoded)
    
    print(f"原始: {text}")
    print(f"Base64: {encoded.decode()}")
    print(f"解码: {decoded.decode()}")
    
    # 二进制数据转Base64
    binary_data = b'\x00\x01\x02\x03\x04\x05'
    binary_encoded = base64.b64encode(binary_data)
    binary_decoded = base64.b64decode(binary_encoded)
    
    print(f"二进制: {binary_data.hex()}")
    print(f"Base64: {binary_encoded.decode()}")
    print(f"解码: {binary_decoded.hex()}")

base64_basic_examples()
```

### 十六进制编码示例
```python
import binascii

def hex_basic_examples():
    """基本十六进制编码和解码示例"""
    # 字符串转十六进制
    text = "Hello, World!"
    hex_encoded = binascii.hexlify(text.encode('utf-8'))
    hex_decoded = binascii.unhexlify(hex_encoded)
    
    print(f"原始: {text}")
    print(f"十六进制: {hex_encoded.decode()}")
    print(f"解码: {hex_decoded.decode()}")
    
    # 二进制数据转十六进制
    binary_data = b'\x00\xFF\xA5\x42\x7F\xE3'
    binary_hex = binascii.hexlify(binary_data)
    binary_decoded = binascii.unhexlify(binary_hex)
    
    print(f"二进制: {binary_data}")
    print(f"十六进制: {binary_hex.decode()}")
    print(f"解码: {binary_decoded}")

hex_basic_examples()
```

### URL编码示例
```python
import urllib.parse

def url_encoding_examples():
    """URL编码和解码示例"""
    # 基本URL编码
    url = "https://example.com/path?name=John Doe&age=25"
    encoded_url = urllib.parse.quote(url)
    decoded_url = urllib.parse.unquote(encoded_url)
    
    print(f"原始: {url}")
    print(f"编码: {encoded_url}")
    print(f"解码: {decoded_url}")
    
    # 查询参数编码
    params = {'name': 'John Doe', 'email': 'john@example.com'}
    query_string = urllib.parse.urlencode(params)
    parsed_params = urllib.parse.parse_qs(query_string)
    
    print(f"参数: {params}")
    print(f"查询: {query_string}")
    print(f"解析: {parsed_params}")

url_encoding_examples()
```

## 高级编码操作

### Base64URL编码
```python
def base64url_examples():
    """Base64URL编码示例"""
    # 标准Base64 vs Base64URL
    data = b"URL-safe encoding test"
    
    # 标准Base64
    standard = base64.b64encode(data)
    print(f"标准Base64: {standard.decode()}")
    
    # Base64URL（URL安全）
    url_safe = base64.urlsafe_b64encode(data)
    print(f"Base64URL: {url_safe.decode()}")
    
    # 解码Base64URL
    decoded = base64.urlsafe_b64decode(url_safe)
    print(f"解码: {decoded}")
    
    # 手动Base64URL转换
    manual_url_safe = standard.decode().replace('+', '-').replace('/', '_').rstrip('=')
    print(f"手动Base64URL: {manual_url_safe}")

base64url_examples()
```

### 十六进制格式变体
```python
def hex_format_examples():
    """十六进制格式变体"""
    data = b"Test data for hex encoding"
    
    # 不同十六进制格式
    formats = {
        '小写': binascii.hexlify(data).decode(),
        '大写': binascii.hexlify(data).decode().upper(),
        '带冒号': ':'.join(f'{b:02x}' for b in data),
        '带空格': ' '.join(f'{b:02x}' for b in data),
        '带0x': '0x' + binascii.hexlify(data).decode()
    }
    
    for format_name, hex_string in formats.items():
        print(f"{format_name}: {hex_string}")

hex_format_examples()
```

### HTML编码示例
```python
import html

def html_encoding_examples():
    """HTML编码和解码示例"""
    # 基本HTML编码
    text = "<script>alert('Hello, World!')</script>"
    encoded = html.escape(text)
    decoded = html.unescape(encoded)
    
    print(f"原始: {text}")
    print(f"编码: {encoded}")
    print(f"解码: {decoded}")
    
    # HTML实体
    entities = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;'
    }
    
    for char, entity in entities.items():
        print(f"'{char}' -> '{entity}'")
    
    # Unicode编码
    unicode_text = "Hello, 世界! © 2024"
    unicode_encoded = html.escape(unicode_text)
    print(f"Unicode: {unicode_text}")
    print(f"编码: {unicode_encoded}")

html_encoding_examples()
```

## 文件和数据处理

### 文件编码示例
```python
def file_encoding_examples():
    """文件编码示例"""
    # 创建测试文件
    test_content = "This is a test file with special characters: !@#$%^&*()"
    with open("test_file.txt", "w") as f:
        f.write(test_content)
    
    # 读取并编码文件
    with open("test_file.txt", "rb") as f:
        file_data = f.read()
    
    # Base64编码文件
    file_base64 = base64.b64encode(file_data)
    print(f"文件Base64: {file_base64.decode()}")
    
    # 十六进制编码文件
    file_hex = binascii.hexlify(file_data)
    print(f"文件十六进制: {file_hex.decode()}")
    
    # 解码并验证
    decoded_data = base64.b64decode(file_base64)
    print(f"解码匹配: {decoded_data == file_data}")

file_encoding_examples()
```

### 二进制数据处理
```python
def binary_data_examples():
    """二进制数据编码示例"""
    # 生成随机二进制数据
    import os
    random_data = os.urandom(16)
    
    print(f"随机数据: {random_data}")
    print(f"Base64: {base64.b64encode(random_data).decode()}")
    print(f"十六进制: {binascii.hexlify(random_data).decode()}")
    
    # 处理不同数据类型
    data_types = {
        '文本': b"Hello, World!",
        '数字': b'\x00\x01\x02\x03\x04\x05',
        '混合': b'Text\x00\xFF\x42Numbers'
    }
    
    for data_type, data in data_types.items():
        print(f"\n{data_type}:")
        print(f"  Base64: {base64.b64encode(data).decode()}")
        print(f"  十六进制: {binascii.hexlify(data).decode()}")

binary_data_examples()
```

## Web和API示例

### URL参数编码
```python
def url_parameter_examples():
    """URL参数编码示例"""
    # 复杂查询参数
    params = {
        'name': 'John Doe',
        'email': 'john.doe@example.com',
        'message': 'Hello, world! How are you?',
        'special': '!@#$%^&*()',
        'unicode': 'Hello, 世界!'
    }
    
    # 编码参数
    query_string = urllib.parse.urlencode(params)
    print(f"编码查询: {query_string}")
    
    # 解析编码查询
    parsed = urllib.parse.parse_qs(query_string)
    print(f"解析参数: {parsed}")
    
    # 构建URL
    base_url = "https://api.example.com/search"
    full_url = f"{base_url}?{query_string}"
    print(f"完整URL: {full_url}")

url_parameter_examples()
```

### API响应编码
```python
def api_encoding_examples():
    """API响应编码示例"""
    # 模拟包含二进制数据的API响应
    api_response = {
        'status': 'success',
        'data': {
            'image': base64.b64encode(b'fake_image_data').decode(),
            'hash': binascii.hexlify(b'fake_hash_data').decode(),
            'message': 'Hello, API!'
        }
    }
    
    import json
    json_response = json.dumps(api_response, indent=2)
    print(f"API响应: {json_response}")
    
    # 解码响应数据
    decoded_image = base64.b64decode(api_response['data']['image'])
    decoded_hash = binascii.unhexlify(api_response['data']['hash'])
    
    print(f"解码图像: {decoded_image}")
    print(f"解码哈希: {decoded_hash}")

api_encoding_examples()
```

## 安全和验证

### 输入验证示例
```python
def validation_examples():
    """编码输入验证"""
    # 验证Base64输入
    def is_valid_base64(data):
        try:
            base64.b64decode(data)
            return True
        except Exception:
            return False
    
    # 验证十六进制输入
    def is_valid_hex(data):
        try:
            binascii.unhexlify(data)
            return True
        except Exception:
            return False
    
    # 测试用例
    test_cases = [
        ("SGVsbG8=", "Base64"),
        ("48656c6c6f", "十六进制"),
        ("Invalid", "无效"),
        ("SGVsbG8", "Base64"),
        ("48656c6c6f7", "十六进制")
    ]
    
    for data, data_type in test_cases:
        if data_type == "Base64":
            valid = is_valid_base64(data)
        elif data_type == "十六进制":
            valid = is_valid_hex(data)
        else:
            valid = False
        
        print(f"{data_type}: {data} -> 有效: {valid}")

validation_examples()
```

### XSS防护示例
```python
def xss_prevention_examples():
    """HTML编码XSS防护"""
    # 恶意输入
    malicious_inputs = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '"><script>alert("XSS")</script>'
    ]
    
    for malicious in malicious_inputs:
        # 安全编码
        safe_output = html.escape(malicious)
        print(f"原始: {malicious}")
        print(f"安全: {safe_output}")
        print()
    
    # 上下文特定编码
    user_input = '<script>alert("XSS")</script>'
    
    contexts = {
        'html内容': html.escape(user_input),
        'html属性': html.escape(user_input, quote=True),
        'javascript字符串': f"'{user_input.replace(\"'\", \"\\'\")}'",
        'url参数': urllib.parse.quote(user_input)
    }
    
    for context, encoded in contexts.items():
        print(f"{context}: {encoded}")

xss_prevention_examples()
```

## 性能和优化

### 性能比较
```python
import time

def performance_examples():
    """编码方法性能比较"""
    test_data = b"Hello, World! This is a test string for performance comparison."
    
    # 测试Base64性能
    start_time = time.time()
    for _ in range(10000):
        base64.b64encode(test_data)
    base64_time = time.time() - start_time
    
    # 测试十六进制性能
    start_time = time.time()
    for _ in range(10000):
        binascii.hexlify(test_data)
    hex_time = time.time() - start_time
    
    # 测试URL编码性能
    start_time = time.time()
    for _ in range(10000):
        urllib.parse.quote(test_data.decode())
    url_time = time.time() - start_time
    
    print("性能结果（10,000次迭代）:")
    print(f"Base64: {base64_time:.4f} 秒")
    print(f"十六进制: {hex_time:.4f} 秒")
    print(f"URL: {url_time:.4f} 秒")
    
    # 大小比较
    base64_size = len(base64.b64encode(test_data))
    hex_size = len(binascii.hexlify(test_data))
    original_size = len(test_data)
    
    print(f"\n大小比较:")
    print(f"原始: {original_size} 字节")
    print(f"Base64: {base64_size} 字节 ({base64_size/original_size:.1%} 增加)")
    print(f"十六进制: {hex_size} 字节 ({hex_size/original_size:.1%} 增加)")

performance_examples()
```

### 内存高效编码
```python
def memory_efficient_examples():
    """内存高效编码示例"""
    # 大文件处理
    large_data = b"Large data " * 1000  # 11KB数据
    
    # 分块处理
    chunk_size = 1024
    encoded_chunks = []
    
    for i in range(0, len(large_data), chunk_size):
        chunk = large_data[i:i + chunk_size]
        encoded_chunk = base64.b64encode(chunk)
        encoded_chunks.append(encoded_chunk)
    
    # 合并块
    full_encoded = b''.join(encoded_chunks)
    print(f"原始大小: {len(large_data)} 字节")
    print(f"编码大小: {len(full_encoded)} 字节")
    print(f"块数量: {len(encoded_chunks)}")
    
    # 验证往返
    decoded_data = base64.b64decode(full_encoded)
    print(f"往返成功: {decoded_data == large_data}")

memory_efficient_examples()
```

## 错误处理

### 健壮编码函数
```python
def robust_encoding_examples():
    """带错误处理的健壮编码"""
    def safe_base64_encode(data):
        """安全编码数据为Base64"""
        try:
            if isinstance(data, str):
                data = data.encode('utf-8')
            return base64.b64encode(data).decode()
        except Exception as e:
            print(f"Base64编码错误: {e}")
            return None
    
    def safe_hex_encode(data):
        """安全编码数据为十六进制"""
        try:
            if isinstance(data, str):
                data = data.encode('utf-8')
            return binascii.hexlify(data).decode()
        except Exception as e:
            print(f"十六进制编码错误: {e}")
            return None
    
    # 测试各种输入
    test_inputs = [
        "Hello, World!",
        b"Binary data",
        "Unicode: 你好世界",
        None,
        "",
        "A" * 10000  # 长字符串
    ]
    
    for test_input in test_inputs:
        print(f"\n输入: {test_input}")
        base64_result = safe_base64_encode(test_input)
        hex_result = safe_hex_encode(test_input)
        
        print(f"Base64: {base64_result}")
        print(f"十六进制: {hex_result}")

robust_encoding_examples()
```

### 编码错误恢复
```python
def error_recovery_examples():
    """编码操作中的错误恢复"""
    # 处理格式错误的Base64
    malformed_base64 = "SGVsbG8"  # 缺少填充
    
    try:
        # 尝试用填充解码
        decoded = base64.b64decode(malformed_base64 + "=")
        print(f"恢复: {decoded}")
    except Exception as e:
        print(f"恢复失败: {e}")
    
    # 处理格式错误的十六进制
    malformed_hex = "48656c6c6f7"  # 奇数长度
    
    try:
        # 尝试用填充解码
        if len(malformed_hex) % 2 == 1:
            malformed_hex = "0" + malformed_hex
        decoded = binascii.unhexlify(malformed_hex)
        print(f"恢复: {decoded}")
    except Exception as e:
        print(f"恢复失败: {e}")
    
    # 处理URL编码错误
    malformed_url = "Invalid%URL%Encoding"
    
    try:
        decoded = urllib.parse.unquote(malformed_url)
        print(f"恢复: {decoded}")
    except Exception as e:
        print(f"恢复失败: {e}")

error_recovery_examples()
```

## JavaScript示例

### Node.js编码示例
```javascript
// Node.js中的Base64编码
const crypto = require('crypto');

function base64Examples() {
    // 字符串转Base64
    const text = "Hello, World!";
    const encoded = Buffer.from(text).toString('base64');
    const decoded = Buffer.from(encoded, 'base64').toString();
    
    console.log(`原始: ${text}`);
    console.log(`Base64: ${encoded}`);
    console.log(`解码: ${decoded}`);
    
    // 二进制数据转Base64
    const binaryData = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05]);
    const binaryEncoded = binaryData.toString('base64');
    const binaryDecoded = Buffer.from(binaryEncoded, 'base64');
    
    console.log(`二进制: ${binaryData.toString('hex')}`);
    console.log(`Base64: ${binaryEncoded}`);
    console.log(`解码: ${binaryDecoded.toString('hex')}`);
}

// Node.js中的十六进制编码
function hexExamples() {
    const text = "Hello, World!";
    const encoded = Buffer.from(text).toString('hex');
    const decoded = Buffer.from(encoded, 'hex').toString();
    
    console.log(`原始: ${text}`);
    console.log(`十六进制: ${encoded}`);
    console.log(`解码: ${decoded}`);
}

// Node.js中的URL编码
function urlExamples() {
    const url = "https://example.com/path?name=John Doe&age=25";
    const encoded = encodeURIComponent(url);
    const decoded = decodeURIComponent(encoded);
    
    console.log(`原始: ${url}`);
    console.log(`编码: ${encoded}`);
    console.log(`解码: ${decoded}`);
}

// 使用示例（在Python文件中注释掉）
// base64Examples();
// hexExamples();
// urlExamples();
```

## 测试和验证

### 编码测试用例
```python
def encoding_test_cases():
    """综合编码测试用例"""
    # 测试数据
    test_cases = [
        ("Hello, World!", "基本字符串"),
        ("", "空字符串"),
        ("Unicode: 你好世界", "Unicode字符串"),
        ("Special chars: !@#$%^&*()", "特殊字符"),
        ("A" * 1000, "长字符串"),
        (b"\x00\x01\x02\x03", "二进制数据"),
        ("Line1\nLine2\r\nLine3", "多行字符串")
    ]
    
    for test_data, description in test_cases:
        print(f"\n{description}:")
        
        # 如果是字符串则转换为字节
        if isinstance(test_data, str):
            data_bytes = test_data.encode('utf-8')
        else:
            data_bytes = test_data
        
        # 测试所有编码
        base64_result = base64.b64encode(data_bytes).decode()
        hex_result = binascii.hexlify(data_bytes).decode()
        url_result = urllib.parse.quote(test_data if isinstance(test_data, str) else test_data.decode())
        
        print(f"  Base64: {base64_result}")
        print(f"  十六进制: {hex_result}")
        print(f"  URL: {url_result}")
        
        # 验证往返
        base64_decoded = base64.b64decode(base64_result.encode())
        hex_decoded = binascii.unhexlify(hex_result.encode())
        
        print(f"  Base64往返: {base64_decoded == data_bytes}")
        print(f"  十六进制往返: {hex_decoded == data_bytes}")

encoding_test_cases()
``` 
# ECDSA 使用教程

## 环境设置

### 前置条件
- 具有ECC库的编程语言
- 理解椭圆曲线密码学
- 数字签名概念知识
- ECDSA安全考虑意识

### 库选择

#### PyCryptodome (Python)
```bash
pip install pycryptodome
```

#### Node.js crypto (JavaScript)
```bash
# 内置crypto模块，无需安装
```

#### Bouncy Castle (Java)
```xml
<dependency>
    <groupId>org.bouncycastle</groupId>
    <artifactId>bcprov-jdk15on</artifactId>
    <version>1.70</version>
</dependency>
```

#### OpenSSL (C/C++)
```bash
# 安装OpenSSL
sudo apt-get install libssl-dev  # Ubuntu/Debian
brew install openssl             # macOS
```

## 基本概念

### ECDSA密钥结构
```python
from Crypto.PublicKey import ECC

# 生成ECDSA密钥对
key = ECC.generate(curve='P-256')

# 公钥组件
public_key = key.public_key()
x = public_key.x  # X坐标
y = public_key.y  # Y坐标
curve = public_key.curve  # 曲线名称

# 私钥组件
private_key = key
d = private_key.d  # 私钥标量
curve = private_key.curve  # 曲线名称

print(f"曲线: {curve}")
print(f"公钥: ({x}, {y})")
print(f"密钥大小: {key.pointQ.size_in_bits()} 位")
```

### 曲线选择
```python
def curve_recommendations():
    """ECDSA曲线建议"""
    print("ECDSA曲线建议:")
    print("P-256: 最广泛使用，256位安全性")
    print("P-384: 更高安全性，性能较慢")
    print("P-521: 最大安全性，最大密钥大小")
    print("secp256k1: 比特币曲线，256位安全性")
    
    # 安全级别
    security_levels = {
        'P-256': "128位（当前标准）",
        'P-384': "192位（高安全性）",
        'P-521': "256位（最大安全性）",
        'secp256k1': "128位（比特币标准）"
    }
    
    return security_levels
```

## 密钥生成

### 基本密钥生成
```python
from Crypto.PublicKey import ECC
import os

def generate_ecdsa_key_pair(curve='P-256'):
    """生成ECDSA密钥对"""
    # 生成随机密钥
    key = ECC.generate(curve=curve)
    
    # 提取公钥和私钥
    private_key = key
    public_key = key.public_key()
    
    print(f"在{curve}上生成ECDSA密钥对")
    print(f"公钥: ({public_key.x}, {public_key.y})")
    print(f"私钥: {private_key.d}")
    
    return private_key, public_key

def save_key_pair(private_key, public_key, filename_prefix):
    """保存ECDSA密钥对到文件"""
    # 保存私钥
    with open(f"{filename_prefix}_private.pem", "wb") as f:
        f.write(private_key.export_key(format='PEM'))
    
    # 保存公钥
    with open(f"{filename_prefix}_public.pem", "wb") as f:
        f.write(public_key.export_key(format='PEM'))
    
    print(f"密钥保存为{filename_prefix}_private.pem和{filename_prefix}_public.pem")
```

### 自定义参数的密钥生成
```python
def generate_ecdsa_with_custom_curve(curve_name):
    """使用自定义曲线生成ECDSA密钥"""
    available_curves = ['P-256', 'P-384', 'P-521', 'secp256k1']
    
    if curve_name not in available_curves:
        print(f"不支持的曲线: {curve_name}")
        return None
    
    key = ECC.generate(curve=curve_name)
    print(f"在{curve_name}上生成ECDSA密钥")
    return key

def validate_key_parameters(key):
    """验证ECDSA密钥参数"""
    # 检查曲线
    if key.curve not in ['P-256', 'P-384', 'P-521', 'secp256k1']:
        print("警告: 非标准曲线")
    
    # 检查密钥大小
    key_size = key.pointQ.size_in_bits()
    if key_size < 256:
        print("警告: 密钥大小小于256位")
    
    # 检查私钥范围
    if key.d <= 0 or key.d >= key.pointQ.order:
        print("错误: 私钥超出有效范围")
        return False
    
    return True
``` 
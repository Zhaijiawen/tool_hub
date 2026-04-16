# 文件哈希校验 - 技术背景

## 什么是哈希函数

哈希函数（Hash Function）是一种将任意长度的数据映射为固定长度输出（哈希值/摘要）的数学函数。哈希函数具有以下关键特性：

1. **确定性**：相同输入总是产生相同输出
2. **单向性**：从哈希值无法反推原始数据（理论上）
3. **雪崩效应**：输入的微小改变会导致输出完全不同
4. **碰撞抵抗性**：找到两个不同输入产生相同哈希值极其困难

## 常用哈希算法

### MD5（Message Digest 5）
- 输出长度：128 位（32 个十六进制字符）
- 速度：非常快
- 安全性：⚠️ **已不安全**，存在已知碰撞攻击
- 用途：文件完整性校验（非安全场景）、数据校验和

```
示例：
MD5("hello") = 5d41402abc4b2a76b9719d911017c592
```

### SHA-1（Secure Hash Algorithm 1）
- 输出长度：160 位（40 个十六进制字符）
- 速度：较快
- 安全性：⚠️ **已不安全**，2017年Google实现了实际碰撞攻击（SHAttered）
- 用途：Git 对象标识（历史原因）、遗留系统

```
示例：
SHA1("hello") = aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d
```

### SHA-256（SHA-2 系列）
- 输出长度：256 位（64 个十六进制字符）
- 速度：中等
- 安全性：✅ **目前安全**，广泛使用
- 用途：文件下载校验、数字签名、密码存储、比特币挖矿

```
示例：
SHA256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
```

### SHA-512（SHA-2 系列）
- 输出长度：512 位（128 个十六进制字符）
- 速度：在 64 位系统上比 SHA-256 更快
- 安全性：✅ **非常安全**，安全余量更大
- 用途：高安全性场景、SSL/TLS 证书

## 哈希值的用途

### 文件完整性验证
软件发布时，官方网站通常提供文件的 SHA-256 哈希值。下载后计算文件哈希，对比官方值，可验证：
- 文件未损坏
- 文件未被篡改（中间人攻击）
- 下载的是正版文件

### 数字指纹
每个文件都有唯一的哈希值（类比指纹），可用于：
- 文件去重
- 快速比较文件是否相同（无需逐字节比较）
- 版权证明（时间戳哈希）

### 密码存储
用户密码不应明文存储，应存储其哈希值（配合盐值）。

## Web Crypto API

现代浏览器内置了 `SubtleCrypto` API，支持直接在浏览器中计算 SHA 系列哈希，无需后端服务：

```javascript
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
```

支持的算法：`SHA-1`、`SHA-256`、`SHA-384`、`SHA-512`（注意：不支持 MD5）

## 性能考量

- SHA-256 计算 1GB 文件约需 3-10 秒（取决于设备性能）
- 大文件需要分片（chunked）读取，避免内存溢出
- 使用 `FileReader.readAsArrayBuffer` 或 `File.arrayBuffer()` 读取文件
- MD5 通过 `spark-md5` 等第三方库在浏览器中实现


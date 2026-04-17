# UUID / NanoID 技术背景

## 什么是 UUID？

UUID（Universally Unique Identifier，通用唯一标识符）是一种 128 位的标识符，设计目标是在全球范围内保证唯一性，无需中央注册机构协调。

### 主要版本

| 版本 | 特点 | 适用场景 |
|------|------|---------|
| v1 | 基于时间戳 + MAC 地址 | 有序、可追溯，但可能泄露 MAC 地址 |
| v4 | 完全随机 | 最常用，通用唯一标识 |
| v7 | 基于 Unix 时间戳（毫秒级），RFC 9562 新标准 | 有序且随机，适合数据库主键 |

### 格式

标准格式：`xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx`，共 32 个十六进制字符 + 4 个连字符。

## 什么是 NanoID？

NanoID 是 UUID 的现代替代品：

- 比 UUID 短约 30%（默认 21 字符 vs UUID 的 36 字符）
- 使用 URL 安全字符（`A-Za-z0-9_-`）
- 使用 `crypto.getRandomValues()` 保证密码学安全随机性
- 支持自定义字母表和长度

## 碰撞概率

UUID v4 生成 10 亿个 ID 后，发生碰撞的概率约为 1/100 万亿，实际使用中可视为唯一。NanoID（默认 21 位）的安全性与 UUID v4 相当。


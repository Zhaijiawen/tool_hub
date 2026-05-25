# User Agent 解析器 — 技术背景

## 什么是 User Agent？

**User Agent（UA）** 是浏览器或 HTTP 客户端在 `User-Agent` 请求头中发送的字符串，用于标识客户端软件，包括浏览器名称、版本、操作系统和渲染引擎。

## User Agent 的重要性

服务器和分析工具使用 UA 字符串来：
- 提供适配设备的内容（桌面端 vs. 移动端）
- 追踪浏览器使用统计
- 调试兼容性问题
- 实现特定浏览器的兼容处理

## User Agent 字符串结构

典型的浏览器 UA 字符串遵循以下通用模式：

```
Mozilla/5.0 (OS信息) AppleWebKit/版本 (KHTML, like Gecko) 浏览器/版本
```

### 示例
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

| 部分 | 含义 |
|---|---|
| `Mozilla/5.0` | 历史兼容性标记（所有浏览器都包含） |
| `Windows NT 10.0; Win64; x64` | 操作系统：Windows 10，64位 |
| `AppleWebKit/537.36` | 渲染引擎版本 |
| `Chrome/120.0.0.0` | 浏览器名称和版本 |
| `Safari/537.36` | 兼容性标记 |

## 常见组成部分

### 操作系统
- `Windows NT 10.0` → Windows 10
- `Macintosh; Intel Mac OS X 13_0` → macOS Ventura
- `Linux x86_64` → Linux 64位
- `iPhone; CPU iPhone OS 17_0` → iOS 17
- `Android 14` → Android 14

### 浏览器引擎
- **Blink**（Chrome、Edge、Opera）：`AppleWebKit/537.36 (KHTML, like Gecko)`
- **WebKit**（Safari）：`AppleWebKit/605.1.15`
- **Gecko**（Firefox）：`Gecko/20100101 Firefox/120.0`

## UA 伪造问题

User Agent 可以被轻易伪造——它由客户端自行上报，服务器无法验证其真实性。应将其作为参考提示，而非可靠的身份标识。


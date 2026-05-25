# User Agent 解析器 — 使用示例

## 示例 1：Windows 上的 Chrome

**UA 字符串：**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```
**解析结果：**
- 浏览器：Chrome 120
- 操作系统：Windows 10（64位）
- 引擎：Blink（WebKit 537.36）
- 设备：桌面端

## 示例 2：iPhone 上的 Safari

**UA 字符串：**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```
**解析结果：**
- 浏览器：Safari 17
- 操作系统：iOS 17
- 引擎：WebKit 605.1.15
- 设备：移动端

## 示例 3：macOS 上的 Firefox

**UA 字符串：**
```
Mozilla/5.0 (Macintosh; Intel Mac OS X 14.0; rv:120.0) Gecko/20100101 Firefox/120.0
```
**解析结果：**
- 浏览器：Firefox 120
- 操作系统：macOS Sonoma（14.0）
- 引擎：Gecko
- 设备：桌面端

## 示例 4：Googlebot 爬虫

**UA 字符串：**
```
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```
**解析结果：**
- 浏览器：Googlebot 2.1
- 类型：网络爬虫 / Bot


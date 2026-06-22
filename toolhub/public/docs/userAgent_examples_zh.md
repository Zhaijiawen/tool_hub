# User Agent 解析器 — 使用示例

## Windows 上的 Chrome

**UA 字符串：**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```
**解析结果：**
- 浏览器：Chrome 120
- 操作系统：Windows 10（64位）
- 引擎：Blink（WebKit 537.36）
- 设备：桌面端

这大概是你网站 65% 访客都在发送的内容。注意 `Win64; x64`——架构信息在 OS 字段里，不是单独的属性。另外，这也可能是 Windows 11——微软把 NT 版本冻结在 10.0 以避免破坏 UA 检测，所以 Windows 10 和 11 在 UA 字符串里看起来一模一样。客户端区分它们的唯一办法是 `navigator.userAgentData`（User-Agent Client Hints API），但不是所有浏览器都支持。

## iPhone 上的 Safari

**UA 字符串：**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```
**解析结果：**
- 浏览器：Safari 17
- 操作系统：iOS 17
- 引擎：WebKit 605.1.15
- 设备：移动端

iOS 上所有浏览器——Chrome、Firefox、Edge、Brave——全用 WebKit。苹果强制要求。所以当你看到 UA 里有 `iPhone`，渲染引擎就一定是 WebKit，不管浏览器名怎么说。`Version/17.0` 是 Safari 的真实版本，而 `Safari/604.1` 是苹果随着 WebKit 更新递增的内部构建号。`Mobile` 标记确认这是 iPhone 而不是 iPad（iPad 以前发不同的 UA——现在默认发送类似桌面端的 UA）。

## macOS 上的 Firefox

**UA 字符串：**
```
Mozilla/5.0 (Macintosh; Intel Mac OS X 14.0; rv:120.0) Gecko/20100101 Firefox/120.0
```
**解析结果：**
- 浏览器：Firefox 120
- 操作系统：macOS Sonoma（14.0）
- 引擎：Gecko
- 设备：桌面端

跟 Chromium 系列浏览器相比，Firefox 的 UA 清爽得令人感动。没有 `AppleWebKit`、没有 `Safari`、没有 `KHTML, like Gecko`——只有 `Gecko` 和 `Firefox`。`rv:120.0` 是 Gecko 修订号，通常跟 Firefox 版本号一致。`Gecko/` 后面的 `20100101` 是冻结的——从 2010 年起就是这个日期，因为 Firefox 4 改了 Gecko 的版本号方案，这个日期被保留下来避免破坏那些天真地解析它的网站。

## Googlebot 爬虫

**UA 字符串：**
```
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```
**解析结果：**
- 浏览器：Googlebot 2.1
- 类型：网络爬虫 / Bot

`compatible` 标记和指向 Google bot 文档页面的 URL 是合法爬虫 UA 的标志。但记住——任何人都能伪造这个。如果你在检查请求是否真的来自 Google，不要仅靠 UA 字符串；应该拿 IP 地址跟 Google 公开的 IP 范围对照，或者用它们的反向 DNS 验证方法。

## Windows 上的 Edge（Chromium 内核）

**UA 字符串：**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0
```
**解析结果：**
- 浏览器：Edge 120
- 操作系统：Windows 10（64位）
- 引擎：Blink
- 设备：桌面端

Edge 用最后的 `Edg/` 标记标识自己。前面的所有内容看起来跟 Chrome 一模一样，因为它们共享 Blink 引擎。如果你在做字符串匹配来检测浏览器，先检查 `Edg/` 再检查 `Chrome/`——否则你会把 Edge 误判为 Chrome。同样的方法适用于其他 Chromium 浏览器：Opera 有 `OPR/`、Brave 有 `Brave/`、Vivaldi 有 `Vivaldi/`。

## 老旧 Internet Explorer（遗留调试用）

**UA 字符串：**
```
Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko
```
**解析结果：**
- 浏览器：Internet Explorer 11
- 操作系统：Windows 10
- 引擎：Trident 7.0
- 设备：桌面端

IE11 用 `Trident/` 引擎标记而不是 `AppleWebKit`。`WOW64` 表示 32 位 IE 运行在 64 位 Windows 上。`rv:11.0` 是 IE 的版本号。这个 UA 可能仍然出现在尚未从 IE 迁移的企业环境或政府系统中。如果你的分析工具在 2024 年还显示 IE 流量，大概率要么是公司内网，要么是假装的爬虫。

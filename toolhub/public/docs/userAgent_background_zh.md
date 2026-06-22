# User Agent 解析器 — 技术背景

每次你的浏览器发起 HTTP 请求，它都会发送一个 `User-Agent` 头——一个告诉服务器你在用什么浏览器、什么版本、什么操作系统的字符串。这是浏览器的自我介绍方式。服务器用它来推送适配移动端的页面、统计浏览器市场份额、有时也用来拦截或限制某些客户端。

UA 字符串有着漫长而古怪的历史，搞清楚它的各种怪癖，你就明白为什么解析器有用了。

## 为什么所有 UA 都以 "Mozilla/5.0" 开头

上世纪 90 年代，Netscape Navigator 的标识是 `Mozilla/1.0`。当 Internet Explorer 出现时，它希望那些检查 "Mozilla" 的网站也能给它内容，所以把自己的 UA 开头写成了 `Mozilla/4.0 (compatible; MSIE ...)`。Chrome 发布时，希望被当作 Safari 来处理那些针对 WebKit 优化的网站，于是在字符串里同时包含了 `AppleWebKit` 和 `Safari`——尽管它不是 Safari。Firefox 则包含了 `Gecko/20100101`，一个从 2010 年就没再变过的日期，因为改它会搞崩那些硬编码日期检查的网站。

这一切意味着现代 UA 字符串是层层历史包袱堆出来的。一个 Chrome 120 的 UA 仍然写着 `Mozilla/5.0`，仍然提到 `Safari`，仍然说了 `like Gecko`——没有一条准确描述了 Chrome 到底是什么。解析器从这些噪声中提取结构化信息，穿透这层混乱。

## 典型 UA 的结构

这是一个 Windows 上 Chrome 的字符串拆解：

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

| 部分 | 实际含义 |
|---|---|
| `Mozilla/5.0` | 历史兼容标记——所有浏览器都说这句话 |
| `Windows NT 10.0; Win64; x64` | Windows 10，64位，x86_64 架构 |
| `AppleWebKit/537.36` | Blink 引擎的版本标识（从 WebKit 分叉而来） |
| `(KHTML, like Gecko)` | 「我们大概类似 KHTML 和 Gecko」——兼容说明 |
| `Chrome/120.0.0.0` | 实际浏览器和版本，你真正关心的信息 |
| `Safari/537.36` | 「声称自己也是 Safari」——又一条兼容标记 |

版本号 `537.36` 同时出现在 `AppleWebKit` 和 `Safari` 里——这不是巧合。它是 Blink 从 WebKit 分叉时的版本号，这么多年在所有基于 Chromium 的浏览器里都冻在这个数字上了。

## 操作系统信号

OS 信息放在括号里，使用特定的标记：

- `Windows NT 10.0` — Windows 10 或 11（是的，Windows 11 仍然报告 `Windows NT 10.0`，因为改了会大面积破坏 UA 检测）
- `Macintosh; Intel Mac OS X 14_0` — macOS Sonoma（下划线分隔版本号）
- `Linux x86_64` — 64位 x86 架构 Linux
- `iPhone; CPU iPhone OS 17_0 like Mac OS X` — iOS 17，iPhone。`like Mac OS X` 是苹果表示「在网页平台表现上跟桌面 Safari 一致」
- `Android 14; SM-S908B` — Android 14，附带设备型号提示

## 浏览器引擎

渲染引擎通常可以通过周边标记来识别：

- **Blink**（Chrome、Edge、Opera、Brave、Vivaldi）：使用 `AppleWebKit/537.36` 且提到 `Chrome/`——但 `Chrome/` 的版本号才是把它跟 Safari 区分开的标志
- **WebKit**（Safari、所有 iOS 浏览器）：`AppleWebKit/605.1.15` 且没有 `Chrome/` 标记（苹果要求所有 iOS 浏览器必须使用 WebKit）
- **Gecko**（Firefox）：`Gecko/20100101 Firefox/120.0`——Firefox 是唯一一个把引擎名放在显眼位置的主流浏览器

## UA 伪造

UA 字符串是客户端自己报的。没有验证机制。任何人都可以在 User-Agent 头里发 `Googlebot/2.1`，即使他根本不是 Google。机器人、爬虫、自动化工具经常伪造 UA 来避免被拦截。

这意味着基于 UA 的逻辑应该当作便利工具而非安全措施。不要用 UA 字符串做身份验证、频率限制或访问控制。用它做分析、调试和内容适配。

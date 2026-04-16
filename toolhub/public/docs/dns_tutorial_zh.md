# DNS 查询工具 - 使用教程

## 快速开始

DNS 查询工具通过 Cloudflare 的 DoH（DNS over HTTPS）接口查询域名的 DNS 记录，无需安装任何工具，直接在浏览器中使用。

## 基本使用流程

### 步骤 1：输入域名

在输入框中输入要查询的域名，**不要加 `http://` 或 `https://` 前缀**。

正确示例：
- `example.com`
- `www.google.com`
- `mail.qq.com`

错误示例：
- ~~`https://example.com`~~
- ~~`example.com/path`~~

### 步骤 2：选择记录类型

从下拉菜单中选择要查询的 DNS 记录类型：

| 类型 | 用途 |
|------|------|
| **A** | 查询 IPv4 地址（最常用） |
| **AAAA** | 查询 IPv6 地址 |
| **MX** | 查询邮件服务器 |
| **TXT** | 查询文本记录（SPF/DKIM 等） |
| **CNAME** | 查询别名指向 |
| **NS** | 查询权威 DNS 服务器 |
| **SOA** | 查询区域授权信息 |

### 步骤 3：点击查询

点击 **"查询"** 按钮，等待结果返回（通常在 1-3 秒内）。

### 步骤 4：查看结果

结果以表格形式展示，包含以下列：
- **名称**：记录对应的域名
- **类型**：记录类型（A、MX 等）
- **TTL**：缓存时间（秒）
- **值**：记录内容（IP 地址、域名等）

## 常见查询场景

### 查询网站 IP 地址

```
域名: google.com
类型: A

结果示例:
名称          类型  TTL   值
google.com    A     300   142.250.64.46
google.com    A     300   142.250.64.78
```

> Google 等大型网站通常有多个 A 记录，实现负载均衡。

### 查询邮件服务器

```
域名: gmail.com
类型: MX

结果示例:
名称        类型  TTL    优先级  邮件服务器
gmail.com   MX    3600   5      gmail-smtp-in.l.google.com
gmail.com   MX    3600   10     alt1.gmail-smtp-in.l.google.com
```

> 优先级数字越小，优先级越高。

### 查询 TXT 记录（SPF/DKIM）

```
域名: example.com
类型: TXT

结果示例:
名称           类型  TTL    值
example.com    TXT   3600   "v=spf1 include:_spf.google.com ~all"
example.com    TXT   3600   "google-site-verification=abc123..."
```

### 查询 CDN 的 CNAME

```
域名: www.example.com
类型: CNAME

结果示例:
名称               类型   TTL   值
www.example.com    CNAME  3600  example.com.cdn.cloudflare.net
```

## 理解 DNS 传播延迟

当你修改了 DNS 记录后，使用本工具查询到的仍然是旧记录，这是因为：
1. DNS 变更需要从权威服务器传播到全球缓存服务器
2. 传播时间等于原来记录的 TTL 值
3. 短 TTL（如 300 秒）5 分钟后生效；长 TTL（如 86400 秒）最多 24 小时

## 注意事项

1. **输入纯域名**：不要包含协议、路径或端口
2. **国际化域名**：支持 IDN（如含汉字的域名会自动转换为 Punycode）
3. **频率限制**：Cloudflare DoH 有一定频率限制，正常使用无需担心
4. **结果准确性**：返回的是 Cloudflare DoH 的查询结果，可能与本地 DNS 结果略有差异


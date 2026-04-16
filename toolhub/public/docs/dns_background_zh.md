# DNS 查询工具 - 技术背景

## 什么是 DNS

DNS（Domain Name System，域名系统）是互联网的"电话簿"，负责将人类可读的域名（如 `example.com`）转换为机器可读的 IP 地址（如 `93.184.216.34`）。

## DNS 工作原理

当你在浏览器输入 `www.example.com` 时，DNS 解析流程如下：

1. **检查本地缓存**：浏览器和操作系统首先检查本地 DNS 缓存
2. **查询本地 DNS 服务器**：向配置的 DNS 服务器（通常是路由器或 ISP 提供的）发送查询
3. **递归查询**：DNS 服务器没有缓存时，从根域名服务器开始递归查询
   - 根服务器 → 告知 `.com` 顶级域服务器地址
   - 顶级域服务器 → 告知 `example.com` 权威服务器地址
   - 权威服务器 → 返回最终 IP 地址
4. **缓存结果**：结果按照 TTL 时间缓存，下次查询直接返回缓存

## DNS 记录类型

| 记录类型 | 全称 | 用途 |
|---------|------|------|
| **A** | Address | 将域名映射到 IPv4 地址 |
| **AAAA** | IPv6 Address | 将域名映射到 IPv6 地址 |
| **CNAME** | Canonical Name | 域名别名，指向另一个域名 |
| **MX** | Mail Exchange | 指定邮件服务器 |
| **TXT** | Text | 存储任意文本（SPF、DKIM、验证等） |
| **NS** | Name Server | 指定域名的权威 DNS 服务器 |
| **SOA** | Start of Authority | 域名区域的授权起始记录 |
| **PTR** | Pointer | IP 地址到域名的反向解析 |
| **SRV** | Service | 指定特定服务的主机和端口 |

## TTL（Time To Live）

TTL 是 DNS 记录的缓存时间（单位：秒）。

- **短 TTL（如 300 秒）**：变更传播快，但增加 DNS 服务器负载
- **长 TTL（如 86400 秒/1天）**：减少查询次数，但变更生效慢
- **DNS 迁移建议**：迁移前将 TTL 降为 300，完成后再恢复

## DoH（DNS over HTTPS）

传统 DNS 查询使用 UDP 53 端口，是明文的，存在隐私泄露和中间人攻击风险。

DoH 将 DNS 查询封装在 HTTPS 请求中，具有以下优势：
- **隐私保护**：DNS 查询内容加密，ISP 无法监视
- **防止篡改**：HTTPS 加密防止中间人修改查询结果
- **防火墙穿透**：使用 HTTPS 端口，不会被专门屏蔽 DNS 的防火墙拦截

### Cloudflare DoH API

本工具使用 Cloudflare 的 DoH API：

```
GET https://cloudflare-dns.com/dns-query?name={domain}&type={type}
Headers: Accept: application/dns-json
```

返回 JSON 格式的 DNS 记录，包含：
- `Status`：响应状态码（0 = 无错误）
- `TC`：是否被截断
- `RD`：是否请求递归
- `RA`：是否支持递归
- `AD`：DNSSEC 验证是否成功
- `CD`：是否禁用检查
- `Question`：查询的问题
- `Answer`：查询结果列表

## 常见 DNS 问题

### DNS 传播延迟
修改 DNS 记录后，新值需要时间在全球 DNS 服务器中传播，通常需要 24-48 小时（取决于 TTL 设置）。

### DNSSEC
DNSSEC 是对 DNS 的安全扩展，通过数字签名验证 DNS 响应的真实性，防止 DNS 欺骗攻击。

### DNS 污染
某些网络环境会对 DNS 查询返回错误的 IP（DNS 污染），导致无法访问正确的网站。使用 DoH 可以一定程度上规避此问题。


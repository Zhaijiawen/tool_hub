# DNS 查询工具 - 使用示例

## 示例 1：查询 GitHub 的 A 记录

**查询：** `github.com` / 类型：A

**预期结果：**
```
名称           类型  TTL   值
github.com     A     60    140.82.113.3
github.com     A     60    140.82.114.3
```

---

## 示例 2：查询 Google 的 MX 记录（邮件服务器）

**查询：** `google.com` / 类型：MX

**预期结果：**
```
名称         类型  TTL    优先级  服务器
google.com   MX    3600   10     aspmx.l.google.com
google.com   MX    3600   20     alt1.aspmx.l.google.com
google.com   MX    3600   30     alt2.aspmx.l.google.com
google.com   MX    3600   40     alt3.aspmx.l.google.com
google.com   MX    3600   50     alt4.aspmx.l.google.com
```

---

## 示例 3：查询域名的 NS 记录（权威 DNS 服务器）

**查询：** `cloudflare.com` / 类型：NS

**预期结果：**
```
名称              类型  TTL    值
cloudflare.com    NS    86400  ns1.cloudflare.com
cloudflare.com    NS    86400  ns2.cloudflare.com
cloudflare.com    NS    86400  ns3.cloudflare.com
cloudflare.com    NS    86400  ns4.cloudflare.com
```

---

## 示例 4：查询 TXT 记录（SPF 邮件验证）

**查询：** `gmail.com` / 类型：TXT

**预期结果（包含 SPF 记录）：**
```
名称        类型  TTL    值
gmail.com   TXT   3600   "v=spf1 redirect=_spf.google.com"
```

---

## 示例 5：查询 CNAME 记录（CDN 配置验证）

**查询：** `docs.github.com` / 类型：CNAME

**预期结果：**
```
名称              类型   TTL   值
docs.github.com   CNAME  60    github.github.io
```

---

## 常见应用场景

### 场景 1：验证域名解析是否生效

```
步骤：
1. 修改 DNS A 记录，将域名指向新 IP（如 192.168.1.100）
2. 使用 DNS 查询工具查询域名的 A 记录
3. 如果已显示新 IP，说明解析已生效
4. 如果仍显示旧 IP，需要等待 TTL 时间后再检查
```

### 场景 2：排查邮件发送失败

```
可能原因：MX 记录配置错误
排查步骤：
1. 查询发件方域名的 TXT 记录（检查 SPF）
2. 查询收件方域名的 MX 记录（确认邮件服务器）
3. 检查 MX 记录指向的主机名是否有 A 记录

示例 SPF 记录解读：
"v=spf1 include:_spf.google.com ~all"
└── 允许 Google 邮件服务器代表此域名发送邮件
    ~all = 软失败（其他 IP 可能通过，但标记为可疑）
```

### 场景 3：确认 CDN 是否已接管域名

```
查询 www.yourdomain.com 的 CNAME 记录：
- 如果 CNAME 指向 CDN 提供商的域名（如 *.cloudflare.net）→ CDN 已接管
- 如果 CNAME 不存在或指向原来的服务器 → CDN 未配置或未生效
```

### 场景 4：SSL 证书域名验证

```
申请 SSL 证书时，CA 机构要求在 DNS 添加验证记录：

查询类型：TXT
记录名：_acme-challenge.yourdomain.com

如果查询到对应的 TXT 值，证明验证记录已添加成功。
```

### 场景 5：通过代码查询 DNS

```javascript
// 使用 Cloudflare DoH 查询 DNS（浏览器/Node.js）
async function queryDNS(domain, type = 'A') {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/dns-json' }
  })
  const data = await res.json()

  if (data.Status !== 0) {
    throw new Error(`DNS 查询失败，状态码: ${data.Status}`)
  }

  return data.Answer || []
}

// 查询 A 记录示例
const records = await queryDNS('example.com', 'A')
records.forEach(r => {
  console.log(`${r.name} -> ${r.data} (TTL: ${r.TTL}s)`)
})
```

## DNS 记录类型速查

| 记录类型 | 示例值 | 用途 |
|---------|--------|------|
| A | `93.184.216.34` | IPv4 地址 |
| AAAA | `2606:2800:220:1:248:1893:25c8:1946` | IPv6 地址 |
| CNAME | `www.example.com.cdn.cloudflare.net` | 别名 |
| MX | `10 mail.example.com` | 邮件服务器 |
| TXT | `v=spf1 include:...` | 文本验证 |
| NS | `ns1.cloudflare.com` | 权威 DNS |
| SOA | `ns1.example.com. admin.example.com. 2024010101 3600 900 604800 300` | 区域信息 |


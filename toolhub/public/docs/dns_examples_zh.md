# DNS 查询工具 — 使用示例

## GitHub 的 A 记录

**查询：** `github.com` / 类型：A

```
名称           类型  TTL   值
github.com     A     60    140.82.113.3
github.com     A     60    140.82.114.3
```

GitHub 把 TTL 设得非常短（60 秒），这样出故障或需要维护时可以快速切换流量。

## Google 的 MX 记录

**查询：** `google.com` / 类型：MX

```
名称         类型  TTL    优先级  服务器
google.com   MX    3600   10     aspmx.l.google.com
google.com   MX    3600   20     alt1.aspmx.l.google.com
google.com   MX    3600   30     alt2.aspmx.l.google.com
google.com   MX    3600   40     alt3.aspmx.l.google.com
google.com   MX    3600   50     alt4.aspmx.l.google.com
```

五台邮件服务器按优先级排列，优先级 10 的连不上自动试 20，以此类推。

## Cloudflare 的 NS 记录

**查询：** `cloudflare.com` / 类型：NS

```
名称              类型  TTL    值
cloudflare.com    NS    86400  ns1.cloudflare.com
cloudflare.com    NS    86400  ns2.cloudflare.com
cloudflare.com    NS    86400  ns3.cloudflare.com
cloudflare.com    NS    86400  ns4.cloudflare.com
```

86400 秒 = 24 小时。NS 记录的 TTL 通常设得很长，因为换 DNS 服务器很少发生，传播慢也无所谓。

## Gmail 的 TXT（SPF）记录

**查询：** `gmail.com` / 类型：TXT

```
名称        类型  TTL    值
gmail.com   TXT   3600   "v=spf1 redirect=_spf.google.com"
```

把 SPF 策略委托给 `_spf.google.com`——常见做法。Google 在那条记录下维护授权发信 IP 列表，gmail.com 直接 redirect 过去。

## GitHub Pages 的 CNAME

**查询：** `docs.github.com` / 类型：CNAME

```
名称              类型   TTL   值
docs.github.com   CNAME  60    github.github.io
```

GitHub Pages 站点都挂在 `github.github.io` 下面。注意又是 60 秒 TTL——快速故障切换是 GitHub 基础设施的一大特点。

## 实际场景

**验证 DNS 改动生效没 —**
1. 把 A 记录改成新 IP
2. 隔几分钟用工具查一次
3. 新 IP 出现说明 Cloudflare 解析器这边已经生效了
4. 再用你运营商的解析器验证一下，缓存行为可能不一样

**排查邮件发不出去 —**
1. 查发件方域名的 TXT 记录——SPF 配了没？
2. 查收件方域名的 MX 记录——存在吗？能解析吗？
3. 查每个 MX 主机名的 A 记录——邮件服务器自己得有 IP

**SSL 证书域名验证 —**
申请证书时 CA 会让你加一条 `_acme-challenge.yourdomain.com` 的 TXT 记录。用工具查一下确认这条记录已经在 DNS 中可见，再让 CA 继续验证。

**代码里查 DNS —**

```javascript
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

const records = await queryDNS('example.com', 'A')
records.forEach(r => {
  console.log(`${r.name} -> ${r.data} (TTL: ${r.TTL}s)`)
})
```

## 记录类型速查

| 记录类型 | 示例值 |
|---------|--------|
| A | `93.184.216.34` |
| AAAA | `2606:2800:220:1:248:1893:25c8:1946` |
| CNAME | `www.example.com.cdn.cloudflare.net` |
| MX | `10 mail.example.com` |
| TXT | `v=spf1 include:...` |
| NS | `ns1.cloudflare.com` |
| SOA | `ns1.example.com. admin.example.com. 2024010101 3600 900 604800 300` |

# DNS 查询工具 — 怎么用

工具通过 Cloudflare 的 DoH 接口在浏览器里直接查询 DNS，不需要安装任何东西。

## 基本操作

**输入域名 —** 只填域名本身，不要加 `https://`、不要加路径、不要加端口。`example.com` 是对的，`https://example.com/page` 会报错。

**选记录类型 —**

| 类型 | 什么时候查它 |
|------|------------|
| A | 这个网站的 IP 是什么？（最常用）|
| AAAA | 同上，IPv6 版 |
| MX | 这个域名的邮件发到哪？|
| TXT | 查 SPF、DKIM、验证 token |
| CNAME | 这个域名是不是指向了别的域名？|
| NS | 谁在管这个域名的 DNS？|
| SOA | 区域元信息、序列号 |

**点查询 —** 结果通常 1-3 秒返回。表格展示 Name、Type、TTL、Value。

## 常见查询

**查网站 IP —**

```
域名: google.com
类型: A

名称          类型  TTL   值
google.com    A     300   142.250.64.46
google.com    A     300   142.250.64.78
```

大网站返回多个 A 记录做负载均衡，浏览器自己选一个。

**查邮件服务器 —**

```
域名: gmail.com
类型: MX

名称        类型  TTL    优先级  邮件服务器
gmail.com   MX    3600   5      gmail-smtp-in.l.google.com
gmail.com   MX    3600   10     alt1.gmail-smtp-in.l.google.com
```

优先级数字越小越优先。5 连不上就试 10，以此类推。

**查 SPF 记录 —**

```
域名: example.com
类型: TXT

名称           类型  TTL    值
example.com    TXT   3600   "v=spf1 include:_spf.google.com ~all"
```

这条 TXT 的意思是：Google 的邮件服务器可以代表 @example.com 发信，其他服务器发的标记为可疑（~all = 软拒绝）。

**验证 CDN 配置 —**

```
域名: www.example.com
类型: CNAME

名称               类型   TTL   值
www.example.com    CNAME  3600  example.com.cdn.cloudflare.net
```

CNAME 指向 CDN 的域名说明 CDN 已生效。如果指向你源站 IP 或域名，说明 CDN 还没配置好。

## 理解传播延迟

改了 DNS 记录后工具可能还是显示旧值，这不是 bug——DNS 本身就是分布式的，旧记录的 TTL 决定了缓存多久。短 TTL 改完几分钟就生效，长 TTL 最多等 24 小时。

## 注意

输入纯域名，不要带协议和路径。IDN 域名（含非 ASCII 字符）会自动转成 Punycode 编码。Cloudflare DoH 有频率限制，正常使用不会碰到。结果反映的是 Cloudflare 解析器看到的，可能和你本地运营商的解析结果略有出入。

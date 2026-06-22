# IP 查询工具 - 使用示例

## 查询常用 DNS 服务器

**Google DNS（8.8.8.8）：**
```
IP 地址:   8.8.8.8
国家:      美国
地区:      加利福尼亚州
城市:      Mountain View
ISP:       Google LLC
ASN:       AS15169
时区:      America/Los_Angeles
经纬度:    37.3861, -122.0839
```

**Cloudflare DNS（1.1.1.1）：**
```
IP 地址:   1.1.1.1
国家:      澳大利亚
地区:      昆士兰州
城市:      Brisbane
ISP:       Cloudflare, Inc.
ASN:       AS13335
时区:      Australia/Brisbane
```
`1.1.1.1` 显示澳大利亚，提醒一下：IP 归属地反映的是 IP 段的注册地，不是服务器的物理位置。Cloudflare 全球都有服务器，但这个 IP 段注册在澳大利亚。

**Google IPv6 DNS（2001:4860:4860::8888）：**
```
IP 地址:   2001:4860:4860::8888
类型:      IPv6
国家:      美国
ISP:       Google LLC
ASN:       AS15169
```

---

## 实际场景

### 验证 VPN

未开 VPN：
```
IP:   203.0.113.1
国家:  美国
城市:  芝加哥
ISP:  Comcast
```

连接英国 VPN 节点后：
```
IP:   185.xxx.xxx.xxx
国家:  英国
城市:  伦敦
ISP:  某 VPN 服务商
```
ISP 变成 VPN 公司名字就是确凿证据。如果 ISP 还显示 Comcast，说明 VPN 没生效或者漏流量了。

### 排查 API 地理限制

调用某个支付 API 一直报 403，查一下 IP：
```
国家: [受限区域]
```
确认是地理封锁问题。解决方向：走允许区域的代理中转、联系 API 方加白名单、或者用 VPN。

### 代码集成 -- 前端

```javascript
// 根据 IP 获取用户位置，做自动本地化
async function getUserLocation() {
  try {
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()
    return {
      ip: data.ip,
      country: data.country_name,
      countryCode: data.country_code,
      city: data.city,
      timezone: data.timezone,
      currency: data.currency
    }
  } catch (err) {
    console.error('IP 查询失败:', err)
    return null
  }
}

// 根据 IP 自动设置语言
const location = await getUserLocation()
if (location?.countryCode === 'CN') {
  setLanguage('zh-CN')
} else if (location?.countryCode === 'JP') {
  setLanguage('ja')
} else {
  setLanguage('en-US')
}
```
别拿这个做关键逻辑 -- VPN 和代理会让它不准。但用来设置默认语言、货币显示之类的合理默认值足够了。

### 批量查询 -- Node.js

```javascript
const ips = ['8.8.8.8', '1.1.1.1', '114.114.114.114']

for (const ip of ips) {
  const res = await fetch(`https://ipapi.co/${ip}/json/`)
  const data = await res.json()
  console.log(`${ip}: ${data.country_name}, ${data.city}, ${data.org}`)
  // 免费版频次限制约 1 次/秒，批量查询加延迟
  await new Promise(r => setTimeout(r, 1100))
}
```
如果一次要查几十个以上的 IP，免费版很快会限流。生产环境批量查询建议用付费方案或者本地 GeoIP 数据库（比如 MaxMind）。

## 常见公共 DNS IP

| IP | 服务 | 注册地 |
|---|---|---|
| `8.8.8.8` | Google DNS | 美国，Google |
| `8.8.4.4` | Google DNS（备用） | 美国，Google |
| `1.1.1.1` | Cloudflare DNS | 澳大利亚，Cloudflare |
| `9.9.9.9` | Quad9 DNS | 瑞士，Quad9 |
| `114.114.114.114` | 国内 DNS | 中国，南京信风 |
| `223.5.5.5` | 阿里 DNS | 中国，阿里巴巴 |

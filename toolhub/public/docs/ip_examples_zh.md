# IP 查询工具 - 使用示例

## 示例 1：查询 Google DNS 服务器

**查询 IP：** `8.8.8.8`

**预期结果：**
```
IP 地址:   8.8.8.8
国家:      美国 🇺🇸
地区:      加利福尼亚州
城市:      Mountain View
ISP:       Google LLC
ASN:       AS15169
时区:      America/Los_Angeles
经纬度:    37.3861° N, 122.0839° W
```

---

## 示例 2：查询 Cloudflare DNS

**查询 IP：** `1.1.1.1`

**预期结果：**
```
IP 地址:   1.1.1.1
国家:      澳大利亚 🇦🇺
地区:      昆士兰州
城市:      Brisbane
ISP:       Cloudflare, Inc.
ASN:       AS13335
时区:      Australia/Brisbane
```

---

## 示例 3：查询国内 IP

**查询 IP：** `114.114.114.114`（国内 DNS）

**预期结果：**
```
IP 地址:   114.114.114.114
国家:      中国 🇨🇳
地区:      江苏省
城市:      南京
ISP:       China Unicom Jiangsu Province Network
ASN:       AS4837
时区:      Asia/Shanghai
```

---

## 示例 4：查询 IPv6 地址

**查询 IP：** `2001:4860:4860::8888`（Google IPv6 DNS）

**预期结果：**
```
IP 地址:   2001:4860:4860::8888
类型:      IPv6
国家:      美国 🇺🇸
ISP:       Google LLC
ASN:       AS15169
```

---

## 实际应用场景示例

### 场景 1：验证 VPN 连接

**未开启 VPN 时的结果：**
```
IP:   221.xxx.xxx.xxx
国家:  中国
城市:  北京
ISP:  中国电信
```

**开启 VPN（香港节点）后的结果：**
```
IP:   103.xxx.xxx.xxx
国家:  香港 🇭🇰
城市:  Hong Kong
ISP:  VPN Provider
```

---

### 场景 2：排查 API 访问限制

当调用某国际 API 出现地理位置限制错误时，查询当前 IP：

```
IP:   43.xxx.xxx.xxx
国家:  中国大陆
地区:  限制区域
```

确认是地理封锁问题后，可以：
- 使用国际服务器中转
- 配置代理或 VPN

---

### 场景 3：在代码中集成 IP 查询

```javascript
// 获取用户 IP 和国家信息（前端）
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

// 使用示例：根据 IP 自动设置语言
const location = await getUserLocation()
if (location?.countryCode === 'CN') {
  setLanguage('zh-CN')
} else {
  setLanguage('en-US')
}
```

---

### 场景 4：批量查询（Node.js 后端）

```javascript
const ips = ['8.8.8.8', '1.1.1.1', '114.114.114.114']

for (const ip of ips) {
  const res = await fetch(`https://ipapi.co/${ip}/json/`)
  const data = await res.json()
  console.log(`${ip}: ${data.country_name}, ${data.city}, ${data.org}`)
  // 注意：免费版有频次限制，批量查询需加延迟
  await new Promise(r => setTimeout(r, 1100))
}
```

## 常见 IP 归属对照

| IP | 用途 | 归属 |
|----|------|------|
| `8.8.8.8` | Google DNS | 美国，Google |
| `8.8.4.4` | Google DNS | 美国，Google |
| `1.1.1.1` | Cloudflare DNS | 澳大利亚，Cloudflare |
| `114.114.114.114` | 国内 DNS | 中国，南京信风 |
| `223.5.5.5` | 阿里 DNS | 中国，阿里巴巴 |
| `119.29.29.29` | 腾讯 DNS | 中国，腾讯 |


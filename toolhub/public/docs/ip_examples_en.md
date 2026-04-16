# IP Query Tool - Examples

## Example 1: Query Google DNS Server

**Query IP:** `8.8.8.8`

**Expected result:**
```
IP Address:  8.8.8.8
Country:     United States 🇺🇸
Region:      California
City:        Mountain View
ISP:         Google LLC
ASN:         AS15169
Timezone:    America/Los_Angeles
Lat/Long:    37.3861° N, 122.0839° W
```

---

## Example 2: Query Cloudflare DNS

**Query IP:** `1.1.1.1`

**Expected result:**
```
IP Address:  1.1.1.1
Country:     Australia 🇦🇺
Region:      Queensland
City:        Brisbane
ISP:         Cloudflare, Inc.
ASN:         AS13335
Timezone:    Australia/Brisbane
```

---

## Example 3: Query an IPv6 Address

**Query IP:** `2001:4860:4860::8888` (Google IPv6 DNS)

**Expected result:**
```
IP Address:  2001:4860:4860::8888
Type:        IPv6
Country:     United States 🇺🇸
ISP:         Google LLC
ASN:         AS15169
```

---

## Real-World Application Examples

### Scenario 1: Verify VPN Connection

**Without VPN:**
```
IP:      203.0.113.1
Country: United States
City:    Chicago
ISP:     Comcast
```

**With VPN (UK node) enabled:**
```
IP:      185.xxx.xxx.xxx
Country: United Kingdom 🇬🇧
City:    London
ISP:     VPN Provider
```

---

### Scenario 2: Diagnose API Geo-restriction

When a call to an international API returns a geo-restriction error, query your current IP:

```
IP:       203.0.113.10
Country:  [Restricted Region]
```

After confirming it's a geo-block issue, options include:
- Route through an international proxy server
- Configure a VPN

---

### Scenario 3: Integrate IP Query in Code

```javascript
// Get user IP and country (frontend)
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
    console.error('IP query failed:', err)
    return null
  }
}

// Example: Auto-set language based on IP location
const location = await getUserLocation()
if (location?.countryCode === 'GB') {
  setLanguage('en-GB')
} else if (location?.countryCode === 'DE') {
  setLanguage('de')
} else {
  setLanguage('en-US')
}
```

---

### Scenario 4: Batch Query (Node.js Backend)

```javascript
const ips = ['8.8.8.8', '1.1.1.1', '208.67.222.222']

for (const ip of ips) {
  const res = await fetch(`https://ipapi.co/${ip}/json/`)
  const data = await res.json()
  console.log(`${ip}: ${data.country_name}, ${data.city}, ${data.org}`)
  // Note: Free tier has rate limits — add delay between requests
  await new Promise(r => setTimeout(r, 1100))
}
```

## Common IP Reference Table

| IP | Purpose | Owner |
|----|---------|-------|
| `8.8.8.8` | Google DNS | USA, Google |
| `8.8.4.4` | Google DNS | USA, Google |
| `1.1.1.1` | Cloudflare DNS | Australia, Cloudflare |
| `9.9.9.9` | Quad9 DNS | Switzerland, Quad9 |
| `208.67.222.222` | OpenDNS | USA, Cisco |
| `208.67.220.220` | OpenDNS | USA, Cisco |


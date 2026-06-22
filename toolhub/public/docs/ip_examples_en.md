# IP Query Tool - Examples

## Querying well-known DNS servers

**Google DNS (8.8.8.8):**
```
IP Address:  8.8.8.8
Country:     United States
Region:      California
City:        Mountain View
ISP:         Google LLC
ASN:         AS15169
Timezone:    America/Los_Angeles
Lat/Long:    37.3861, -122.0839
```

**Cloudflare DNS (1.1.1.1):**
```
IP Address:  1.1.1.1
Country:     Australia
Region:      Queensland
City:        Brisbane
ISP:         Cloudflare, Inc.
ASN:         AS13335
Timezone:    Australia/Brisbane
```
Cloudflare's `1.1.1.1` showing Australia is a good reminder that IP geolocation reflects where the IP was registered, not where the servers physically are. Cloudflare has servers globally, but the IP block is registered in Australia.

**Google IPv6 DNS (2001:4860:4860::8888):**
```
IP Address:  2001:4860:4860::8888
Type:        IPv6
Country:     United States
ISP:         Google LLC
ASN:         AS15169
```

---

## Real-world scenarios

### Verify your VPN

Without VPN:
```
IP:      203.0.113.1
Country: United States
City:    Chicago
ISP:     Comcast
```

After connecting to a UK VPN node:
```
IP:      185.xxx.xxx.xxx
Country: United Kingdom
City:    London
ISP:     Some VPN Provider Ltd
```
The ISP name changing to a VPN company is a dead giveaway that it's working. If the ISP still says Comcast, your VPN isn't routing traffic properly.

### Debug a geo-restricted API

You're getting 403 errors from a payment API. Query your IP and see:
```
Country: [Restricted Region]
```
Now you know it's a geo-block issue. Options: route through a proxy in an allowed region, contact the API provider about whitelisting, or use a VPN.

### Code integration -- frontend

```javascript
// Get user's location info from IP, useful for auto-localization
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

// Auto-detect locale based on IP
const location = await getUserLocation()
if (location?.countryCode === 'GB') {
  setLanguage('en-GB')
} else if (location?.countryCode === 'DE') {
  setLanguage('de')
} else {
  setLanguage('en-US')
}
```
Don't rely on this for anything critical -- VPNs and proxies make it unreliable. But for setting sensible defaults (language, currency display), it's good enough.

### Batch query -- Node.js

```javascript
const ips = ['8.8.8.8', '1.1.1.1', '208.67.222.222']

for (const ip of ips) {
  const res = await fetch(`https://ipapi.co/${ip}/json/`)
  const data = await res.json()
  console.log(`${ip}: ${data.country_name}, ${data.city}, ${data.org}`)
  // Free tier is rate-limited to ~1 req/sec. Add delay between calls.
  await new Promise(r => setTimeout(r, 1100))
}
```
If you're querying more than a handful of IPs, you'll hit free tier limits fast. For production batch lookups, use a paid plan or a local GeoIP database like MaxMind.

## Common public DNS IPs

| IP | Service | Registered Location |
|---|---|---|
| `8.8.8.8` | Google DNS | USA, Google |
| `8.8.4.4` | Google DNS (secondary) | USA, Google |
| `1.1.1.1` | Cloudflare DNS | Australia, Cloudflare |
| `9.9.9.9` | Quad9 DNS | Switzerland, Quad9 |
| `208.67.222.222` | OpenDNS | USA, Cisco |
| `208.67.220.220` | OpenDNS (secondary) | USA, Cisco |

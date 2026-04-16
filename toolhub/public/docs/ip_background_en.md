# IP Query Tool - Technical Background

## What is an IP Address

An IP (Internet Protocol) address is a unique identifier assigned to each device on a network, used for routing communication between devices. IPv4 and IPv6 are the two versions currently in use.

## IPv4 vs IPv6

### IPv4
- 32-bit number in dotted-decimal notation: `192.168.1.1`
- ~4.3 billion total addresses — nearly exhausted
- Private address ranges: `10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`

### IPv6
- 128-bit number in colon-hexadecimal notation: `2001:0db8:85a3::8a2e:0370:7334`
- ~3.4×10³⁸ addresses — enough to assign an IP to every grain of sand on Earth
- Gradually rolling out globally

## How IP Geolocation Works

IP geolocation databases are built through:
1. **WHOIS registration**: Geographic info provided when IP ranges are registered with Regional Internet Registries (RIRs)
2. **BGP routing analysis**: Inferring geographic location from internet routing announcements
3. **Active probing**: Using tools like traceroute to detect router locations along the path
4. **User feedback and calibration**: Continuously improving accuracy with user reports and GPS data

## IP Information Fields

| Field | Description |
|-------|-------------|
| IP | The IP address itself |
| Country/Region | Country and region code |
| City | City location (may be inaccurate) |
| Latitude/Longitude | Approximate geographic coordinates |
| ISP/ASN | Internet Service Provider and Autonomous System Number |
| Timezone | Timezone used in the region |
| Currency | Currency used in the country |
| Language | Official language |

## Common IP Query APIs

### ipapi.co
- Free tier: 1,000 requests/day
- Supports IPv4 and IPv6
- Returns JSON format
- Endpoint: `https://ipapi.co/{ip}/json/`

### ip-api.com
- Free tier: 45 requests/minute
- Supports Chinese responses (`lang=zh-CN`)
- HTTP only (no HTTPS for free tier)
- Endpoint: `http://ip-api.com/json/{ip}?lang=zh-CN`

### ipinfo.io
- Free tier: 50,000 requests/month
- Provides detailed ASN information
- Supports HTTPS

## Accuracy Limitations

IP geolocation is **not precise positioning** and has the following limitations:
- City-level accuracy is typically within 50-100 km
- ISP datacenter address ≠ user's actual physical address
- VPN/proxy users show the exit node location
- Corporate VPN users show their headquarters or datacenter location
- Satellite network users (e.g., Starlink) may show very inaccurate locations

## Public IP vs Private IP

- **Private IPs** (e.g., `192.168.1.1`) are only used within local networks. They can't be routed on the internet and have no geolocation data.
- **Public IPs** are routable on the internet and are assigned by ISPs. Geolocation data is available.
- Most home users share a single public IP through NAT (Network Address Translation) across multiple devices.


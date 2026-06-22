# IP Query Tool - Technical Background

An IP address is your device's identifier on a network -- the digital equivalent of a return address on an envelope. Without IP addresses, the internet has no way to route data to the right machine.

## IPv4 vs IPv6

**IPv4** is what most people picture: `192.168.1.1`. It's 32 bits, formatted as four decimal numbers separated by dots. There are about 4.3 billion possible addresses, and they've been running out since the 1990s. That's why your home router uses NAT to share one public IP across all your devices. Private ranges like `10.x.x.x`, `172.16-31.x.x`, and `192.168.x.x` are reserved for local networks -- they never appear on the public internet.

**IPv6** is the long-term fix: 128 bits, written in colon-separated hex like `2001:0db8:85a3::8a2e:0370:7334`. The address space is absurdly large -- 3.4 x 10^38 addresses. We could assign one to every atom on the planet and still have leftovers. Adoption has been slow but steady; about 45% of Google's traffic is now IPv6.

## How IP geolocation actually works

It's less "GPS" and more "educated guess." The databases are built from several sources:

1. **WHOIS records** -- when ISPs register IP blocks with Regional Internet Registries, they provide a physical address.
2. **BGP routing data** -- analyzing which networks announce which IP ranges from where.
3. **Latency triangulation** -- measuring ping times to known locations to estimate distance.
4. **User-reported data** -- some services use GPS data from mobile apps to calibrate their databases.

## What you get from an IP lookup

| Field | What it tells you |
|---|---|
| IP | The address itself |
| Country/Region | Usually accurate at the country level |
| City | Approximate, often 50-100km off |
| Lat/Long | Rough coordinates -- don't send a drone |
| ISP/ASN | Who owns the IP block |
| Timezone | Based on the registered location |
| Currency | National currency, useful for localization |
| Language | Official language of the country |

## Public vs private IPs

Private IPs (`192.168.x.x`, `10.x.x.x`, `172.16-31.x.x`) only work within a local network. They're not routable on the internet, and there's no geolocation data for them. Public IPs are what your ISP assigns and what external services see. If you're behind a router, the IP this tool shows is your router's public IP, not your laptop's local one.

## The accuracy problem

IP geolocation is rough. City-level accuracy for fixed-line connections is typically within 50-100km. Mobile connections are worse. VPNs and proxies make it meaningless -- you see the exit node's location, not the user's. Corporate VPN users often appear to be at their company's HQ or datacenter. Satellite ISPs like Starlink can show wildly wrong locations because the ground station might be in a different country than the user.

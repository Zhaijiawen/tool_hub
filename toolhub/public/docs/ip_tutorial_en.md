# IP Query Tool - Tutorial

Open the tool, it auto-detects your public IP and pulls up whatever geolocation data is available. No signup, no setup.

## What happens when you open it

The tool immediately calls an IP geolocation API with your current connection. You'll see:

- Your public IP address
- Country and region (with a flag)
- Approximate city
- ISP and ASN (Autonomous System Number)
- Timezone
- Latitude/longitude -- clickable, opens in a map
- Currency and language info

## Looking up a specific IP

Type an IP into the box and hit Query. Supports both IPv4 and IPv6:

- `8.8.8.8` -- Google's public DNS
- `1.1.1.1` -- Cloudflare's DNS
- `2001:4860:4860::8888` -- Google's IPv6 DNS

## Understanding what you're looking at

The geographic fields (country, city, lat/long) come from whichever IP database the API uses. The network fields (ISP, ASN, org) come from WHOIS and BGP data. These are two separate data sources that don't always agree -- sometimes the geographic location is where the ISP registered the block, while the network info reflects who actually operates it.

The lat/long link is particularly handy -- click it to open Google Maps or OpenStreetMap and see exactly where the database thinks this IP lives.

## Practical uses

**Check if your VPN is working.** Open the tool before and after connecting your VPN. If the country changes, your traffic is routing through the VPN. If it stays the same, your VPN might be leaking (or you connected to a node in your own country).

**Verify where your server lives.** Spin up a cloud VM and the provider says it's in Frankfurt? Look up its public IP to confirm the datacenter's actual location. Occasionally cloud providers' "regions" don't match the physical location they tell you.

**Debug geo-restrictions.** If a service gives you a geo-block error, check what country your IP resolves to. That tells you whether the block is targeting your actual location or if there's a misconfiguration.

**Script it.** Need your server's public IP in a shell script? `curl -s https://ipapi.co/json/` gives you JSON with IP, country, city, and more. Parse with `jq` and you've got a one-liner.

## Important caveats

Private IPs (`192.168.x.x`, `10.x.x.x`) return nothing useful -- they're local network addresses with no geolocation data. Free IP APIs have rate limits (ipapi.co gives you 1,000 requests/day on the free tier). And remember: the results are approximate. If the tool says you're in a city 200km away, that's within normal accuracy range for IP geolocation. It's not broken -- it's just how IP databases work.

# DNS Query Tool — What's Going On Behind the Scenes

DNS is the internet's phone book. You type `example.com`, DNS figures out the actual IP address (`93.184.216.34`) your browser needs to connect to. Without it, you'd be memorizing IP addresses for every site you visit.

## The resolution flow

When you hit a domain in your browser, here's the chain of events:

1. Your browser and OS check their local DNS cache first — if they already know the IP, no network call needed
2. If not cached, your machine asks the configured DNS server (usually your router or your ISP's server)
3. That server does a recursive lookup starting from the root: root nameservers tell it where `.com` lives, the `.com` TLD servers tell it where `example.com`'s authoritative nameservers live, those authoritative servers return the actual IP
4. The result gets cached at every hop along the way, respecting the record's TTL

## Record types you'll actually use

| Record | What it does |
|--------|-------------|
| **A** | Maps a domain to an IPv4 address — the most common record type |
| **AAAA** | Same thing but for IPv6 |
| **CNAME** | Creates an alias — `www.example.com` points to `example.com`, or to a CDN hostname |
| **MX** | Tells email servers where to deliver mail for this domain |
| **TXT** | Freeform text, used for SPF, DKIM, domain verification, and a hundred other things |
| **NS** | Which nameservers are authoritative for this domain |
| **SOA** | Zone metadata — serial number, refresh intervals, admin contact |

## TTL matters more than you think

TTL (in seconds) controls how long DNS caches hold onto a record before asking the authoritative server again. Short TTL (300s) means fast propagation when you change records but more query load on your nameservers. Long TTL (86400s = 1 day) means fewer queries but changes take forever to propagate.

The classic mistake: you change an A record with a 24-hour TTL, check immediately, see the old IP, and panic. Lower your TTL to 300 before making DNS changes, make the change, then bump it back up after you've confirmed everything works.

## DNS over HTTPS (DoH)

Traditional DNS queries go over UDP port 53 in plaintext. Your ISP, your coffee shop's WiFi, anyone on the network can see every domain you're looking up. DoH wraps DNS queries inside HTTPS — same encryption as your banking website.

This tool uses Cloudflare's DoH API:

```
GET https://cloudflare-dns.com/dns-query?name={domain}&type={type}
Headers: Accept: application/dns-json
```

The response is clean JSON. Key fields: `Status` (0 = success), `Answer` (the actual records), `AD` (whether DNSSEC validation passed).

## Common DNS headaches

**Propagation delay** — After changing records, some resolvers will see the new value immediately and others won't for hours. Plan around this, don't fight it.

**DNSSEC** — Signs DNS responses with digital signatures so resolvers can verify they haven't been tampered with. When it breaks, your domain disappears from the internet.

**DNS poisoning / hijacking** — Some networks intercept DNS queries and return fake results. DoH helps bypass this since the queries are encrypted and go to a trusted resolver directly.

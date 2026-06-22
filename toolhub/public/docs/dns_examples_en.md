# DNS Query Tool — Examples

## GitHub's A records

**Query:** `github.com` / Type: A

```
Name           Type  TTL   Value
github.com     A     60    140.82.113.3
github.com     A     60    140.82.114.3
```

GitHub uses a very short TTL (60 seconds) so they can quickly redirect traffic during incidents or maintenance.

## Google's MX records

**Query:** `google.com` / Type: MX

```
Name         Type  TTL    Priority  Server
google.com   MX    3600   10        aspmx.l.google.com
google.com   MX    3600   20        alt1.aspmx.l.google.com
google.com   MX    3600   30        alt2.aspmx.l.google.com
google.com   MX    3600   40        alt3.aspmx.l.google.com
google.com   MX    3600   50        alt4.aspmx.l.google.com
```

Five mail servers at staggered priorities — if the primary at priority 10 is down, senders automatically try 20, then 30, and so on.

## Cloudflare's NS records

**Query:** `cloudflare.com` / Type: NS

```
Name              Type  TTL    Value
cloudflare.com    NS    86400  ns1.cloudflare.com
cloudflare.com    NS    86400  ns2.cloudflare.com
cloudflare.com    NS    86400  ns3.cloudflare.com
cloudflare.com    NS    86400  ns4.cloudflare.com
```

86400 seconds = 24 hours. NS records typically have long TTLs because changing nameservers is rare and slow propagation is fine.

## Gmail's TXT (SPF) record

**Query:** `gmail.com` / Type: TXT

```
Name        Type  TTL    Value
gmail.com   TXT   3600   "v=spf1 redirect=_spf.google.com"
```

This delegates SPF policy to `_spf.google.com` — a common pattern. Google manages a list of authorized sending IPs under that record, and gmail.com just redirects to it.

## CNAME for GitHub Pages

**Query:** `docs.github.com` / Type: CNAME

```
Name              Type   TTL   Value
docs.github.com   CNAME  60    github.github.io
```

GitHub Pages sites sit behind `github.github.io`. Notice the 60-second TTL again — fast failover is part of GitHub's infrastructure philosophy.

## Real-world scenarios

**Verifying DNS changes took effect —**
1. Change your A record to point to a new IP
2. Query your domain with this tool every few minutes
3. When the new IP shows up, the change has propagated through Cloudflare's resolver
4. Check with your ISP's resolver too — they may have different caching behavior

**Debugging email delivery failures —**
1. Query TXT records of the sender's domain — is SPF configured?
2. Query MX records of the recipient's domain — do they exist and resolve?
3. Query the A record for each MX hostname — make sure the mail server itself has an IP

**SSL certificate domain validation —**
When provisioning an SSL cert, the CA often asks you to add a TXT record like `_acme-challenge.yourdomain.com` with a specific value. Query that exact name to confirm it's visible before telling the CA to proceed.

**Querying DNS from code —**

```javascript
async function queryDNS(domain, type = 'A') {
  const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`
  const res = await fetch(url, {
    headers: { 'Accept': 'application/dns-json' }
  })
  const data = await res.json()

  if (data.Status !== 0) {
    throw new Error(`DNS query failed with status: ${data.Status}`)
  }

  return data.Answer || []
}

const records = await queryDNS('example.com', 'A')
records.forEach(r => {
  console.log(`${r.name} -> ${r.data} (TTL: ${r.TTL}s)`)
})
```

## Quick reference

| Record | Example value |
|--------|--------------|
| A | `93.184.216.34` |
| AAAA | `2606:2800:220:1:248:1893:25c8:1946` |
| CNAME | `www.example.com.cdn.cloudflare.net` |
| MX | `10 mail.example.com` |
| TXT | `v=spf1 include:...` |
| NS | `ns1.cloudflare.com` |
| SOA | `ns1.example.com. admin.example.com. 2024010101 3600 900 604800 300` |

# DNS Query Tool - Examples

## Example 1: Query GitHub's A Records

**Query:** `github.com` / Type: A

**Expected result:**
```
Name           Type  TTL   Value
github.com     A     60    140.82.113.3
github.com     A     60    140.82.114.3
```

---

## Example 2: Query Google's MX Records (Mail Servers)

**Query:** `google.com` / Type: MX

**Expected result:**
```
Name         Type  TTL    Priority  Server
google.com   MX    3600   10        aspmx.l.google.com
google.com   MX    3600   20        alt1.aspmx.l.google.com
google.com   MX    3600   30        alt2.aspmx.l.google.com
google.com   MX    3600   40        alt3.aspmx.l.google.com
google.com   MX    3600   50        alt4.aspmx.l.google.com
```

---

## Example 3: Query NS Records (Authoritative DNS Servers)

**Query:** `cloudflare.com` / Type: NS

**Expected result:**
```
Name              Type  TTL    Value
cloudflare.com    NS    86400  ns1.cloudflare.com
cloudflare.com    NS    86400  ns2.cloudflare.com
cloudflare.com    NS    86400  ns3.cloudflare.com
cloudflare.com    NS    86400  ns4.cloudflare.com
```

---

## Example 4: Query TXT Records (SPF Email Verification)

**Query:** `gmail.com` / Type: TXT

**Expected result (includes SPF record):**
```
Name        Type  TTL    Value
gmail.com   TXT   3600   "v=spf1 redirect=_spf.google.com"
```

---

## Example 5: Query CNAME Records (CDN Configuration Verification)

**Query:** `docs.github.com` / Type: CNAME

**Expected result:**
```
Name              Type   TTL   Value
docs.github.com   CNAME  60    github.github.io
```

---

## Common Application Scenarios

### Scenario 1: Verify DNS Record Changes Have Propagated

```
Steps:
1. Modify your DNS A record to point the domain to a new IP (e.g., 192.168.1.100)
2. Use the DNS query tool to query your domain's A records
3. If the new IP appears, the change has propagated
4. If the old IP still appears, wait for the TTL duration and check again
```

### Scenario 2: Diagnose Email Delivery Failures

```
Possible cause: MX record misconfiguration
Troubleshooting steps:
1. Query TXT records of the sender's domain (check SPF)
2. Query MX records of the recipient's domain (confirm mail servers)
3. Check if the MX record's hostname has an A record

Example SPF record interpretation:
"v=spf1 include:_spf.google.com ~all"
└── Allows Google mail servers to send on behalf of this domain
    ~all = Soft fail (other IPs may pass but are marked as suspicious)
```

### Scenario 3: Confirm CDN Has Taken Over a Domain

```
Query the CNAME record for www.yourdomain.com:
- If CNAME points to CDN provider's domain (e.g., *.cloudflare.net) → CDN is active
- If no CNAME or points to original server → CDN not configured or not yet effective
```

### Scenario 4: SSL Certificate Domain Validation

```
When applying for an SSL certificate, the CA requires a verification record in DNS:

Query type: TXT
Record name: _acme-challenge.yourdomain.com

If the corresponding TXT value appears in the query, the validation record has been added.
```

### Scenario 5: DNS Query in Code

```javascript
// Query DNS using Cloudflare DoH (browser/Node.js)
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

// Query A records example
const records = await queryDNS('example.com', 'A')
records.forEach(r => {
  console.log(`${r.name} -> ${r.data} (TTL: ${r.TTL}s)`)
})
```

## DNS Record Type Quick Reference

| Record Type | Example Value | Purpose |
|------------|--------------|---------|
| A | `93.184.216.34` | IPv4 address |
| AAAA | `2606:2800:220:1:248:1893:25c8:1946` | IPv6 address |
| CNAME | `www.example.com.cdn.cloudflare.net` | Domain alias |
| MX | `10 mail.example.com` | Mail server |
| TXT | `v=spf1 include:...` | Text verification |
| NS | `ns1.cloudflare.com` | Authoritative DNS |
| SOA | `ns1.example.com. admin.example.com. 2024010101 3600 900 604800 300` | Zone info |


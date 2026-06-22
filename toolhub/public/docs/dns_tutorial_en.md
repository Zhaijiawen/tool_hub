# DNS Query Tool — How to Use

The tool calls Cloudflare's DoH API from your browser — no installs, no command line needed.

## The basics

**Enter the domain —** Type the domain and only the domain. No `https://`, no path, no port. `example.com` is correct, `https://example.com/page` will fail.

**Pick a record type —**

| Type | When you'd use it |
|------|-------------------|
| A | What's the IP of this site? (most common) |
| AAAA | Same thing, but IPv6 |
| MX | Where does email for this domain go? |
| TXT | Look up SPF, DKIM, verification tokens |
| CNAME | Is this domain an alias for something else? |
| NS | Who runs the DNS for this domain? |
| SOA | Zone metadata, serial numbers |

**Hit Query —** Results usually come back in 1-3 seconds. The table shows Name, Type, TTL, and Value.

## Common lookups

**Finding a website's IP —**

```
Domain: google.com
Type: A

Name          Type  TTL   Value
google.com    A     300   142.250.64.46
google.com    A     300   142.250.64.78
```

Big sites return multiple A records for load balancing. Your browser picks one.

**Checking mail servers —**

```
Domain: gmail.com
Type: MX

Name        Type  TTL    Priority  Mail Server
gmail.com   MX    3600   5         gmail-smtp-in.l.google.com
gmail.com   MX    3600   10        alt1.gmail-smtp-in.l.google.com
```

Lower priority number = tried first. If priority 5 is unreachable, the sender falls back to 10, then 20, etc.

**Checking SPF records —**

```
Domain: example.com
Type: TXT

Name           Type  TTL    Value
example.com    TXT   3600   "v=spf1 include:_spf.google.com ~all"
```

This TXT record says "Google's mail servers are allowed to send email as @example.com, and anything else should be treated as suspicious (~all = soft fail)."

**Verifying CDN setup —**

```
Domain: www.example.com
Type: CNAME

Name               Type   TTL   Value
www.example.com    CNAME  3600  example.com.cdn.cloudflare.net
```

If you see a CDN hostname in the CNAME, the CDN is active. If it points directly to your origin server, the CDN isn't configured yet.

## Understanding propagation

When you change DNS records, this tool might still show old values. That's not a bug — DNS is distributed by design. The old record's TTL determines how long caches hold onto it. Short TTL = fast propagation. Long TTL = up to 24 hours of waiting.

## Notes

Enter the bare domain — no protocol, no path, no trailing slash. IDN domains (with non-ASCII characters) are automatically converted to Punycode. Cloudflare DoH has rate limits but normal usage stays well under them. Results reflect what Cloudflare's resolver sees, which may differ slightly from what your ISP's resolver returns.

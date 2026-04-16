# DNS Query Tool - Technical Background

## What is DNS

DNS (Domain Name System) is the "phone book" of the internet, responsible for translating human-readable domain names (like `example.com`) into machine-readable IP addresses (like `93.184.216.34`).

## How DNS Works

When you type `www.example.com` into your browser, the DNS resolution process works as follows:

1. **Check local cache**: The browser and OS first check the local DNS cache
2. **Query local DNS server**: Send a query to the configured DNS server (usually the router or ISP-provided server)
3. **Recursive query**: If the server has no cache, it queries recursively starting from the root name servers
   - Root server → Tells the resolver the `.com` TLD server address
   - TLD server → Tells the resolver the authoritative server for `example.com`
   - Authoritative server → Returns the final IP address
4. **Cache the result**: The result is cached according to its TTL for future queries

## DNS Record Types

| Record Type | Full Name | Purpose |
|------------|-----------|---------|
| **A** | Address | Maps a domain name to an IPv4 address |
| **AAAA** | IPv6 Address | Maps a domain name to an IPv6 address |
| **CNAME** | Canonical Name | Domain alias pointing to another domain name |
| **MX** | Mail Exchange | Specifies mail servers for a domain |
| **TXT** | Text | Stores arbitrary text (SPF, DKIM, ownership verification, etc.) |
| **NS** | Name Server | Specifies the authoritative DNS servers for a domain |
| **SOA** | Start of Authority | Authoritative starting record for a DNS zone |
| **PTR** | Pointer | Reverse DNS lookup (IP address to domain name) |
| **SRV** | Service | Specifies the host and port for a specific service |

## TTL (Time To Live)

TTL is the caching duration for a DNS record (in seconds).

- **Short TTL (e.g., 300 seconds)**: Changes propagate quickly but increase DNS server load
- **Long TTL (e.g., 86400 seconds / 1 day)**: Fewer queries but changes take longer to propagate
- **DNS migration tip**: Lower TTL to 300 before migrating, then restore afterward

## DoH (DNS over HTTPS)

Traditional DNS queries use UDP port 53 in plaintext, creating privacy risks and vulnerability to man-in-the-middle attacks.

DoH wraps DNS queries inside HTTPS requests, with the following advantages:
- **Privacy protection**: DNS query content is encrypted; ISPs cannot monitor it
- **Tamper prevention**: HTTPS encryption prevents MITM modification of results
- **Firewall bypass**: Uses HTTPS port, bypassing firewalls that specifically block DNS

### Cloudflare DoH API

This tool uses Cloudflare's DoH API:

```
GET https://cloudflare-dns.com/dns-query?name={domain}&type={type}
Headers: Accept: application/dns-json
```

Returns DNS records in JSON format, including:
- `Status`: Response code (0 = no error)
- `TC`: Whether the response was truncated
- `RD`: Whether recursion was requested
- `RA`: Whether recursion is available
- `AD`: Whether DNSSEC validation succeeded
- `Question`: The query question
- `Answer`: List of query results

## Common DNS Issues

### DNS Propagation Delay
After modifying DNS records, the new values take time to propagate across global DNS servers — typically 24-48 hours (depending on TTL settings).

### DNSSEC
DNSSEC is a security extension to DNS that uses digital signatures to verify the authenticity of DNS responses, protecting against DNS spoofing attacks.

### DNS Poisoning
Some network environments return incorrect IPs for DNS queries (DNS poisoning), preventing access to correct websites. Using DoH can help mitigate this issue.


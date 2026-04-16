# DNS Query Tool - Tutorial

## Getting Started

The DNS query tool uses Cloudflare's DoH (DNS over HTTPS) API to look up DNS records for any domain — no software installation needed, works directly in your browser.

## Basic Usage

### Step 1: Enter the Domain

Type the domain name into the input box. **Do not include `http://` or `https://` prefixes.**

Correct examples:
- `example.com`
- `www.google.com`
- `mail.example.com`

Incorrect examples:
- ~~`https://example.com`~~
- ~~`example.com/path`~~

### Step 2: Select Record Type

Choose the DNS record type from the dropdown:

| Type | Purpose |
|------|---------|
| **A** | Query IPv4 address (most common) |
| **AAAA** | Query IPv6 address |
| **MX** | Query mail server records |
| **TXT** | Query text records (SPF/DKIM, etc.) |
| **CNAME** | Query domain aliases |
| **NS** | Query authoritative DNS servers |
| **SOA** | Query zone authority information |

### Step 3: Click Query

Click the **Query** button and wait for results (usually within 1-3 seconds).

### Step 4: View Results

Results are displayed in a table with the following columns:
- **Name**: The domain name for the record
- **Type**: Record type (A, MX, etc.)
- **TTL**: Cache duration in seconds
- **Value**: Record content (IP address, domain name, etc.)

## Common Query Scenarios

### Query Website IP Address

```
Domain: google.com
Type: A

Example result:
Name          Type  TTL   Value
google.com    A     300   142.250.64.46
google.com    A     300   142.250.64.78
```

> Large websites like Google typically have multiple A records for load balancing.

### Query Mail Servers

```
Domain: gmail.com
Type: MX

Example result:
Name        Type  TTL    Priority  Mail Server
gmail.com   MX    3600   5         gmail-smtp-in.l.google.com
gmail.com   MX    3600   10        alt1.gmail-smtp-in.l.google.com
```

> Lower priority numbers indicate higher priority.

### Query TXT Records (SPF/DKIM)

```
Domain: example.com
Type: TXT

Example result:
Name           Type  TTL    Value
example.com    TXT   3600   "v=spf1 include:_spf.google.com ~all"
example.com    TXT   3600   "google-site-verification=abc123..."
```

### Query CDN CNAME

```
Domain: www.example.com
Type: CNAME

Example result:
Name               Type   TTL   Value
www.example.com    CNAME  3600  example.com.cdn.cloudflare.net
```

## Understanding DNS Propagation Delay

After you modify DNS records, this tool may still return old records because:
1. DNS changes need to propagate from the authoritative server to global cache servers
2. Propagation time equals the original record's TTL value
3. Short TTL (e.g., 300 seconds) → effective in ~5 minutes; long TTL (e.g., 86400 seconds) → up to 24 hours

## Important Notes

1. **Enter bare domain**: Do not include protocol, path, or port
2. **Internationalized domains**: IDN (domains containing non-ASCII characters) are automatically converted to Punycode
3. **Rate limits**: Cloudflare DoH has rate limits, but normal usage is well within them
4. **Result accuracy**: Returns Cloudflare DoH query results, which may differ slightly from your local DNS results


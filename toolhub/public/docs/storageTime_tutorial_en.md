# Storage & Time Converter — How to Use

## Basic workflow

Choose Storage or Time conversion mode. Type a numeric value, select the unit it's in, and the tool shows the equivalent value in every other unit simultaneously. No clicking through individual conversions.

## Storage examples

| Input | What you'll see |
|-------|----------------|
| `1 GB` | `1,000 MB` / `1,024 MiB` / `8,000,000,000 bits` |
| `1 TiB` | `1.0995 TB` / `1,099,511,627,776 bytes` |
| `100 Mbps` | Actual speed `12.5 MB/s` |

The tool handles both decimal (SI) and binary (IEC) units, so you can see the drive manufacturer's number and the OS-reported number side by side.

## Time examples

| Input | What you'll see |
|-------|----------------|
| `1 hour` | `60 min` / `3,600 s` / `3,600,000 ms` |
| `86400 seconds` | `1 day` / `24 hours` |
| `1 year` | `365 days` / `8,760 hours` / `31,536,000 seconds` |

## Common conversion flows

- **Figuring out actual download speed:** Enter the Mbps your ISP advertises, look at the MB/s result, divide by 8 if the tool doesn't explicitly show that conversion
- **Setting JWT expiry:** "7 days" → `604,800 seconds` — that's the number you put in your auth config
- **Session timeout:** "30 minutes" → `1,800,000 ms` — that's what goes in your session middleware config
- **Cache TTL:** "1 hour" → `3,600 seconds` — standard for CDN cache headers
- **Database capacity check:** Enter the estimated row size, multiply by row count, see if you're in MB or GB territory

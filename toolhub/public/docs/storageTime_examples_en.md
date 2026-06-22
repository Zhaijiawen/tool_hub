# Storage & Time Converter — Practical Examples

## Storage

**What's 1.5 TB in MB?**
- SI (decimal): 1.5 TB = 1,500,000 MB
- IEC (binary): 1.5 TiB = 1,572,864 MiB

**Actual download speed —**
Internet plan says 100 Mbps.
100 / 8 = 12.5 MB/s actual throughput.
A 1 GB file at 12.5 MB/s: 1,000 / 12.5 = 80 seconds.

**File storage growth —**
Database backup currently 500 MB. Growing 10 MB/day.
After 30 days: 500 + (10 x 30) = 800 MB.

**How many photos fit on a drive? —**
Phone photo ~8 MB each. 256 GB phone = 256,000 MB / 8 = ~32,000 photos. Minus OS and apps, call it 25,000.

## Time

**Session timeout —**
Requirement: 30-minute idle timeout.
In milliseconds (what your session config expects): 30 x 60 x 1,000 = 1,800,000 ms.
In seconds: 1,800 s.

**JWT token expiry —**
Access token: 15 minutes = 900 seconds.
Refresh token: 7 days = 604,800 seconds.
These are the numbers you put in your auth library's config.

**Cache TTL values —**
Browser cache for static assets: 1 year = 31,536,000 seconds.
API response cache: 5 minutes = 300 seconds.
CDN edge cache: 1 hour = 3,600 seconds.

**Rate limiting window —**
"100 requests per 15 minutes" = 100 requests per 900 seconds. That's your sliding window size.

**Background job interval —**
"Run every 6 hours" = every 21,600 seconds. Most job schedulers accept seconds as the interval unit.

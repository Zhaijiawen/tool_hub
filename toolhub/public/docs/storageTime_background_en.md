# Storage & Time Converter — The Units Behind the Numbers

## Storage: two competing systems

Digital storage uses two different prefix systems. They sound similar but aren't the same, and confusing them leads to surprises like "why does my 1TB drive show as 931GB in Windows?"

**Decimal (SI)** — powers of 1000, used by drive manufacturers:
- 1 KB = 1,000 bytes
- 1 MB = 1,000,000 bytes
- 1 GB = 1,000,000,000 bytes
- 1 TB = 1,000,000,000,000 bytes

**Binary (IEC)** — powers of 1024, used by operating systems:
- 1 KiB = 1,024 bytes
- 1 MiB = 1,048,576 bytes
- 1 GiB = 1,073,741,824 bytes
- 1 TiB = 1,099,511,627,776 bytes

That 1TB drive you bought is 1,000,000,000,000 bytes. Windows displays capacity in binary, so it divides by 1,073,741,824 and comes up with ~931 GiB. The drive is the right size — the unit is different.

## Time units

| Unit | In seconds |
|------|-----------|
| Nanosecond (ns) | 0.000000001 |
| Microsecond (µs) | 0.000001 |
| Millisecond (ms) | 0.001 |
| Second (s) | 1 |
| Minute (min) | 60 |
| Hour (h) | 3,600 |
| Day (d) | 86,400 |
| Week (w) | 604,800 |
| Month (avg) | ~2,629,800 |
| Year (Julian) | 31,557,600 |

## Why these conversions matter in practice

**Network speed —** ISPs quote speeds in bits per second (Mbps), but file sizes are in bytes. 100 Mbps / 8 = 12.5 MB/s actual throughput. A 1 GB file at that speed takes about 80 seconds.

**Timeout configuration —** Session timeouts in milliseconds, cache TTLs in seconds, token expiry in minutes or days. Getting the conversion wrong by a factor of 1000 means a 30-minute session timeout becomes 30 seconds.

**Database storage planning —** Index sizes, row sizes, column types — they're all in bytes until they hit MB, then suddenly you're negotiating with your cloud provider about storage tiers.

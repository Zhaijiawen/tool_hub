# Storage & Time Converter — Technical Background

## Storage Units

Digital storage is measured in multiples of bits and bytes. Two systems of prefixes exist:

### SI (Decimal) Prefixes — powers of 1000
| Unit | Symbol | Value |
|---|---|---|
| Kilobyte | KB | 1,000 bytes |
| Megabyte | MB | 1,000,000 bytes |
| Gigabyte | GB | 1,000,000,000 bytes |
| Terabyte | TB | 1,000,000,000,000 bytes |

These are used by storage manufacturers (hard drive/SSD capacity labeling).

### IEC (Binary) Prefixes — powers of 1024
| Unit | Symbol | Value |
|---|---|---|
| Kibibyte | KiB | 1,024 bytes |
| Mebibyte | MiB | 1,048,576 bytes |
| Gibibyte | GiB | 1,073,741,824 bytes |
| Tebibyte | TiB | 1,099,511,627,776 bytes |

Operating systems traditionally use binary units, which is why a "1 TB" drive shows as ~931 GB in Windows.

## Time Units

| Unit | Seconds |
|---|---|
| Nanosecond (ns) | 0.000000001 |
| Microsecond (µs) | 0.000001 |
| Millisecond (ms) | 0.001 |
| Second (s) | 1 |
| Minute (min) | 60 |
| Hour (h) | 3,600 |
| Day (d) | 86,400 |
| Week (w) | 604,800 |
| Month (mo) | ~2,629,800 (average) |
| Year (y) | 31,557,600 (Julian) |

## Why Conversions Matter

- **Network throughput**: often measured in bits per second (bps), not bytes
  - 100 Mbps ÷ 8 = 12.5 MB/s actual download speed
- **Database indexes**: storage costs depend on data type sizes
- **Timeout configuration**: mixing ms and s is a common source of bugs


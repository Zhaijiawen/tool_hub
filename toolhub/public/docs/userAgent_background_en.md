# User Agent Parser — Technical Background

## What Is a User Agent?

A **User Agent (UA)** is a string sent by a browser or HTTP client in the `User-Agent` HTTP request header. It identifies the client software, including the browser name, version, operating system, and rendering engine.

## Why User Agents Matter

Servers and analytics tools use the UA string to:
- Serve device-appropriate content (desktop vs. mobile)
- Track browser usage statistics
- Debug compatibility issues
- Implement browser-specific workarounds

## Anatomy of a User Agent String

A typical browser UA string follows this general pattern:

```
Mozilla/5.0 (OS info) AppleWebKit/version (KHTML, like Gecko) Browser/version
```

### Example
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

| Part | Meaning |
|---|---|
| `Mozilla/5.0` | Legacy compatibility token (all browsers include this) |
| `Windows NT 10.0; Win64; x64` | OS: Windows 10, 64-bit |
| `AppleWebKit/537.36` | Rendering engine version |
| `Chrome/120.0.0.0` | Browser name and version |
| `Safari/537.36` | Compatibility token |

## Common Components

### Operating Systems
- `Windows NT 10.0` → Windows 10
- `Macintosh; Intel Mac OS X 13_0` → macOS Ventura
- `Linux x86_64` → Linux 64-bit
- `iPhone; CPU iPhone OS 17_0` → iOS 17
- `Android 14` → Android 14

### Browser Engines
- **Blink** (Chrome, Edge, Opera): `AppleWebKit/537.36 (KHTML, like Gecko)`
- **WebKit** (Safari): `AppleWebKit/605.1.15`
- **Gecko** (Firefox): `Gecko/20100101 Firefox/120.0`

## UA Spoofing

User agents can be easily spoofed — they are self-reported by the client and not verified by the server. Use them only as hints, not reliable identifiers.


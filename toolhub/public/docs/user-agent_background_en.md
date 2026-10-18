# User Agent Parser — Technical Background

Every time your browser makes an HTTP request, it sends a `User-Agent` header — a string that tells the server what browser, version, and operating system you're running. It's the browser's way of introducing itself. Servers use this to serve mobile-optimized pages, track browser market share, and sometimes to block or restrict certain clients.

The UA string has a long and weird history, and understanding its quirks explains why the parser is useful.

## Why every UA starts with "Mozilla/5.0"

Back in the 1990s, Netscape Navigator identified itself as `Mozilla/1.0`. When Internet Explorer came along, it wanted sites that checked for "Mozilla" to serve it content too, so it started its UA with `Mozilla/4.0 (compatible; MSIE ...)`. When Chrome launched, it wanted to be treated like Safari for WebKit-compatible sites, so it included both `AppleWebKit` and `Safari` in its string — even though it's not Safari. And Firefox includes `Gecko/20100101` with a frozen date that hasn't changed since 2010, because changing it broke sites that hardcoded date checks.

All of this means the modern UA string is a layered mess of historical baggage. A Chrome 120 UA still says `Mozilla/5.0`, still mentions `Safari`, and still mentions `like Gecko` — none of which accurately describes what Chrome actually is. The parser cuts through this by extracting structured information from the noise.

## Anatomy of a typical UA

Here's a Chrome on Windows string broken down:

```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```

| Part | What it actually means |
|---|---|
| `Mozilla/5.0` | Historical compatibility token — every browser says this |
| `Windows NT 10.0; Win64; x64` | Windows 10, 64-bit on x86_64 hardware |
| `AppleWebKit/537.36` | Blink engine version identifier (forked from WebKit) |
| `(KHTML, like Gecko)` | "We're sort of like KHTML and Gecko" — compatibility note |
| `Chrome/120.0.0.0` | The actual browser and version you care about |
| `Safari/537.36` | "Also claim to be Safari" — another compatibility token |

The version number `537.36` appears in both `AppleWebKit` and `Safari` — it's not a coincidence. It's the WebKit version from which Blink was forked, and it's been frozen at that number for years across Chromium-based browsers.

## Operating system signals

The OS portion lives in the parentheses and uses specific tokens:

- `Windows NT 10.0` — Windows 10 or 11 (yes, Windows 11 still reports `Windows NT 10.0` because changing it broke UA detection in many places)
- `Macintosh; Intel Mac OS X 14_0` — macOS Sonoma (underscores separate version parts)
- `Linux x86_64` — Linux on 64-bit x86
- `iPhone; CPU iPhone OS 17_0 like Mac OS X` — iOS 17 on iPhone. The `like Mac OS X` part is Apple's way of saying "the web platform works like desktop Safari"
- `Android 14; SM-S908B` — Android 14 with a device model hint

## Browser engines

The rendering engine is usually identifiable by the tokens around it:

- **Blink** (Chrome, Edge, Opera, Brave, Vivaldi): Uses `AppleWebKit/537.36` and mentions `Chrome/` — but the `Chrome/` version is what distinguishes it from Safari
- **WebKit** (Safari, all iOS browsers): `AppleWebKit/605.1.15` without a `Chrome/` token (Apple mandates that all iOS browsers use WebKit)
- **Gecko** (Firefox): `Gecko/20100101 Firefox/120.0` — Firefox is the only major browser that puts its engine name prominently

## UA spoofing

The UA string is self-reported by the client. There's no verification. Anyone can send `Googlebot/2.1` in their User-Agent header even if they're not Google. Bots, scrapers, and automated tools routinely fake their UA to avoid blocking.

This means UA-based logic should be treated as a convenience, not a security measure. Don't use UA strings for authentication, rate limiting, or access control. Use them for analytics, debugging, and content adaptation.

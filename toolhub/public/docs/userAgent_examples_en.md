# User Agent Parser — Examples

## Chrome on Windows

**UA String:**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```
**Parsed:**
- Browser: Chrome 120
- OS: Windows 10 (64-bit)
- Engine: Blink (WebKit 537.36)
- Device: Desktop

This is what roughly 65% of your website visitors are sending. Notice `Win64; x64` — the architecture is in the OS field, not a separate property. Also, this could be Windows 11 — Microsoft froze the NT version at 10.0 to avoid breaking UA detection, so Windows 10 and 11 look identical in the UA string. The only way to tell them apart client-side is `navigator.userAgentData` (the User-Agent Client Hints API), which not all browsers support yet.

## Safari on iPhone

**UA String:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```
**Parsed:**
- Browser: Safari 17
- OS: iOS 17
- Engine: WebKit 605.1.15
- Device: Mobile

All browsers on iOS — Chrome, Firefox, Edge, Brave — use WebKit. Apple requires it. So when you see `iPhone` in the UA, the rendering engine is always WebKit, regardless of what the browser name says. The `Version/17.0` token is Safari's real version, while `Safari/604.1` is a build number that Apple bumps with each WebKit update. The `Mobile` token confirms it's an iPhone, not an iPad (iPads used to send a different UA — now they send a desktop-like UA by default).

## Firefox on macOS

**UA String:**
```
Mozilla/5.0 (Macintosh; Intel Mac OS X 14.0; rv:120.0) Gecko/20100101 Firefox/120.0
```
**Parsed:**
- Browser: Firefox 120
- OS: macOS Sonoma (14.0)
- Engine: Gecko
- Device: Desktop

Firefox's UA is refreshingly straightforward compared to Chromium browsers. No `AppleWebKit`, no `Safari`, no `KHTML, like Gecko` — just `Gecko` and `Firefox`. The `rv:120.0` is the Gecko revision number, which usually matches the Firefox version. The `20100101` after `Gecko/` is frozen — it's been that date since 2010 because Firefox 4 changed the Gecko versioning scheme and the date was kept to avoid breaking sites that naively parsed it.

## Googlebot crawler

**UA String:**
```
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```
**Parsed:**
- Browser: Googlebot 2.1
- Type: Web crawler / Bot

The `compatible` token and the URL pointing to Google's bot documentation page are hallmarks of a legitimate crawler UA. But remember — anyone can forge this. If you're checking whether a request is actually from Google, don't rely on the UA string alone; verify the IP address against Google's published ranges or use their reverse DNS verification method.

## Edge on Windows (Chromium-based)

**UA String:**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0
```
**Parsed:**
- Browser: Edge 120
- OS: Windows 10 (64-bit)
- Engine: Blink
- Device: Desktop

Edge identifies itself with the `Edg/` token at the very end. Everything before that looks identical to Chrome because they share the Blink engine. If you're doing string matching to detect browsers, check for `Edg/` before `Chrome/` — otherwise you'll misidentify Edge as Chrome. Same approach applies to other Chromium browsers: Opera has `OPR/`, Brave has `Brave/`, Vivaldi has `Vivaldi/`.

## Old Internet Explorer (for legacy debugging)

**UA String:**
```
Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko
```
**Parsed:**
- Browser: Internet Explorer 11
- OS: Windows 10
- Engine: Trident 7.0
- Device: Desktop

IE11 uses the `Trident/` engine token instead of `AppleWebKit`. The `WOW64` means 32-bit IE running on 64-bit Windows. The `rv:11.0` is the IE version number. This UA might still show up in enterprise environments or government systems that haven't migrated off IE. If your analytics show IE traffic in 2024, it's probably either a corporate intranet or a bot pretending.

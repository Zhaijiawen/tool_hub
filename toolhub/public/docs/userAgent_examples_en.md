# User Agent Parser — Examples

## Example 1: Chrome on Windows

**UA String:**
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
```
**Parsed:**
- Browser: Chrome 120
- OS: Windows 10 (64-bit)
- Engine: Blink (WebKit 537.36)
- Device: Desktop

## Example 2: Safari on iPhone

**UA String:**
```
Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1
```
**Parsed:**
- Browser: Safari 17
- OS: iOS 17
- Engine: WebKit 605.1.15
- Device: Mobile

## Example 3: Firefox on macOS

**UA String:**
```
Mozilla/5.0 (Macintosh; Intel Mac OS X 14.0; rv:120.0) Gecko/20100101 Firefox/120.0
```
**Parsed:**
- Browser: Firefox 120
- OS: macOS Sonoma (14.0)
- Engine: Gecko
- Device: Desktop

## Example 4: Googlebot

**UA String:**
```
Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)
```
**Parsed:**
- Browser: Googlebot 2.1
- Type: Web crawler / Bot


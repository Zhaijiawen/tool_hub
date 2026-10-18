# User Agent Parser — Usage Tutorial

The UA parser does two things: it shows your own browser's User Agent string automatically, and it lets you paste in any other UA string for analysis.

## Reading your own UA

When the page loads, the tool grabs `navigator.userAgent` from your browser and displays it. You'll see the raw string at the top, and below it the parsed breakdown: browser name and version, operating system, device type (desktop, mobile, or tablet), and rendering engine.

This is the quickest way to check what your browser is actually sending to every website you visit. If you've ever wondered whether your "Chrome" is really Chrome or a Chromium fork, look at the browser field in the parsed output.

## Parsing any UA string

If you're debugging an issue reported by a user or analyzing server logs, paste their UA string into the input field. The parser breaks it down the same way as your own. This is useful when:
- A user reports a bug and you want to know their exact browser and OS version
- Your server logs show a strange UA and you need to figure out what client it is
- You're investigating bot traffic and want to see what a crawler claims to be

## Where to find UA strings

If you're collecting UAs to parse, here's where to get them:
- **Browser DevTools**: Open the Console and type `navigator.userAgent` — the output is exactly what the parser works with
- **Network tab**: Any HTTP request shows the `User-Agent` header in the request headers section
- **Server logs**: Most web servers (nginx, Apache) log the UA string by default
- **Analytics tools**: Google Analytics, Matomo, and similar services capture UA strings for every visitor

## Understanding the parsed fields

The parser distills the messy UA string into concrete fields:

- **Browser** and version are extracted by looking for tokens like `Chrome/120`, `Firefox/120`, `Safari/17`. When multiple browsers claim to be each other (Chrome also claiming to be Safari), the parser identifies the real one based on token priority.
- **OS** comes from the parentheses section: `Windows NT`, `Mac OS X`, `iPhone OS`, `Android`, `Linux`. The version number format varies by OS — Windows uses build numbers, macOS uses underscore-separated version components, iOS and Android use simpler dot-separated versions.
- **Device type** is inferred from the OS: `iPhone` or `Android` with `Mobile` token means mobile, `iPad` or `Android` without `Mobile` typically means tablet, and `Windows NT` or `Macintosh` means desktop.
- **Engine** is the rendering engine: Blink, WebKit, or Gecko. It's identified by the presence of `AppleWebKit` (with or without `Chrome/`) or `Gecko`.

## Real-world workflow

A common debugging flow: you get a bug report saying "the page looks broken on my phone." Ask the user to visit the tool, copy their UA, and send it to you. Paste it into the parser and you instantly know: iPhone 15 running iOS 17.2 with Safari 17.2. Now you can reproduce the issue on the exact platform instead of guessing.

For server-side work: if you're writing code that checks UA strings, paste a few sample UAs into the parser first to verify your detection logic. The parser shows you what a proper parsing library would extract, so you can compare your regex or string-matching approach against it.

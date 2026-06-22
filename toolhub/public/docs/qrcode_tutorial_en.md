# QR Code — How to Use the Generator

## Quick generation

1. Type or paste your content (URL, text, whatever) into the input area
2. Pick an error correction level — M is fine for most things
3. Hit Generate
4. Click the result image to download as PNG

That's it. The tool picks the optimal version and encoding mode automatically.

## Parameter guide

**Error correction —** Four levels, higher = more durable = less data capacity. Use M as the default. Use H if you're overlaying a logo or the code will be printed in harsh conditions. Use L if you need to pack as much data as possible into a small code.

**Module size —** Controls the pixel size of each square. Larger = easier to scan from a distance, but bigger file. 10px is a good default for digital display; 5-8px for embedding in documents.

**Quiet zone —** The white border around the code. The spec says minimum 4 modules. Most QR libraries default to 4. You can go larger for aesthetic reasons, but don't go smaller.

**Foreground/background colors —** The default is black on white, which provides maximum contrast for scanners. You can customize colors, but stick to dark-on-light. Low contrast or reverse contrast makes scanning unreliable.

## Common use cases

**URLs —** The most common use. Just paste the full URL. Avoid URL shorteners — encode the final destination URL directly so the QR code works forever.

**WiFi credentials —** Use the format: `WIFI:S:NetworkName;T:WPA;P:Password;;` Replace `NetworkName` with your SSID, `WPA` with your security type (WPA, WEP, or leave empty for open), and `Password` with your WiFi password. Most phones recognize this format and offer to connect automatically.

**Contact info (vCard) —**

```
BEGIN:VCARD
VERSION:3.0
FN:John Doe
TEL:+1-555-123-4567
EMAIL:john@example.com
END:VCARD
```

**Plain text —** Any text works. Phones will display it or offer to copy it. Keep it short — long texts produce dense QR codes that are harder to scan.

## Size and data capacity

More data = bigger QR code = harder to scan from a distance. A URL under 100 characters produces a clean, scannable code at most sizes. If you're encoding paragraphs of text, test the result on a few different phones to make sure it scans reliably.

## Download and use

The output is a standard PNG file. For print: export at a large module size (10-15px) and don't scale it down. For digital: 256-512px total size works well. The PNG has a transparent white background that renders cleanly on any surface.

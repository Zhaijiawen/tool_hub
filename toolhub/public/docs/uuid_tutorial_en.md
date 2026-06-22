# UUID & NanoID — How to Use

## Picking the right type

- **UUID v4** — the safe default. Fully random, no identifying info embedded. Works for user IDs, session IDs, transaction IDs, pretty much anything
- **UUID v1** — time-based, contains your MAC address. Sortable but potentially identifies your hardware. Skip this unless you have a specific reason
- **UUID v7** — the new standard. Millisecond timestamp prefix makes it sortable, random suffix keeps it secure. Use this for database primary keys where insertion order matters
- **NanoID** — shorter alternative. Great for URL slugs, file names, short codes. Customize the length and alphabet to fit your use case

## UUID format options

- **With hyphens:** `550e8400-e29b-41d4-a716-446655440000` — standard, most readable
- **Without hyphens:** `550e8400e29b41d4a716446655440000` — compact, saves 4 characters
- **Uppercase:** `550E8400-E29B-41D4-A716-446655440000` — some systems prefer uppercase hex

## NanoID configuration

**Length —** Default 21. Shorter = more collision risk, longer = more space. For most applications, 21 is fine. For short codes that users might type (like invite codes), 8-10 is common.

**Alphabet —** Default is 64 URL-safe characters. For numeric-only codes, use `0123456789`. For case-insensitive codes, use `0123456789abcdef`. Leave empty to use the default.

## Batch generation

Set the count (1-100) and hit Generate. Click any row to copy that single ID. "Copy All" copies every ID, one per line.

## What's actually happening

All generation runs in your browser using `crypto.getRandomValues()`. UUID v7 requires the `uuid` library, loaded on first use (about 8KB). Everything is client-side — no IDs are sent anywhere.

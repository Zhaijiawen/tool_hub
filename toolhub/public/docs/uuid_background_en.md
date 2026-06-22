# UUID & NanoID — Unique Identifiers Explained

A UUID is a 128-bit number designed to be globally unique without any central coordination. You can generate one on your laptop and be confident nobody else in the world will generate the same one — even if they're also generating millions of them.

## UUID versions that matter

| Version | How it works | When to use |
|---------|-------------|------------|
| v1 | Timestamp + MAC address | Sortable, but exposes your MAC. Don't use in public-facing systems |
| v4 | Fully random (122 random bits) | General purpose — the most widely used version |
| v7 | Unix timestamp prefix + random suffix (RFC 9562) | Sortable and secure. Ideal for database primary keys |

Standard format: `xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx` — 32 hex characters plus 4 hyphens, 36 characters total.

## The v7 advantage

UUID v7 is the newer standard (RFC 9562). The first 48 bits are a millisecond-precision Unix timestamp, making v7 UUIDs naturally sortable by creation time. This is a big deal for databases — random v4 UUIDs cause index fragmentation because they insert all over the place. v7 UUIDs insert at the end of the index, like auto-increment integers.

## NanoID: a shorter alternative

NanoID is a modern UUID alternative with some nice properties:

- Default 21 characters vs UUID's 36 — saves space in URLs and logs
- Uses URL-safe characters (`A-Za-z0-9_-`) — no encoding needed in query strings
- Backed by `crypto.getRandomValues()` — same cryptographic security as UUID v4
- Customizable length (4-128) and alphabet — generate digits-only IDs, or just lowercase letters

## Collision probability

UUID v4 has 122 random bits. That's 2^122 possible values. After generating 1 billion UUID v4 values, the collision probability is roughly 1 in 100 trillion. For every practical purpose, that's zero.

NanoID at the default 21 characters with a 64-character alphabet has 64^21 = 2^126 possible values — slightly more than UUID v4. At length 10 with the same alphabet, it drops to 64^10 = 2^60, which is still huge but worth being aware of if you're generating billions of IDs.

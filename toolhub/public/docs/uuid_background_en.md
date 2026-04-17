# UUID / NanoID Background

## What is UUID?

UUID (Universally Unique Identifier) is a 128-bit identifier designed to be globally unique without a central registry.

### Main Versions

| Version | Characteristics | Use Cases |
|---------|----------------|-----------|
| v1 | Time-based + MAC address | Sortable, traceable, but may expose MAC address |
| v4 | Fully random | Most common, general-purpose unique ID |
| v7 | Unix timestamp (millisecond precision), RFC 9562 | Sortable and random, ideal for DB primary keys |

### Format

Standard format: `xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx` — 32 hex characters + 4 hyphens.

## What is NanoID?

NanoID is a modern alternative to UUID:

- ~30% shorter than UUID (21 chars by default vs 36 for UUID)
- Uses URL-safe characters (`A-Za-z0-9_-`)
- Uses `crypto.getRandomValues()` for cryptographically secure randomness
- Supports custom alphabet and length

## Collision Probability

After generating 1 billion UUID v4 values, the probability of a collision is approximately 1 in 100 trillion — effectively zero in practice. NanoID (default 21 chars) has comparable security to UUID v4.


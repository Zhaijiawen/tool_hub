# UUID / NanoID Tutorial

## Quick Start

### Step 1: Choose a Type

- **UUID v4**: Most common, fully random, works for most use cases
- **UUID v1**: Time-based, partially sortable, but may expose MAC address (not recommended for public-facing systems)
- **UUID v7**: New standard, millisecond-precision timestamp prefix + random suffix — both sortable and secure, recommended for DB primary keys
- **NanoID**: Shorter unique IDs, great for URL slugs and filenames

### Step 2: Configure Format (UUID only)

- **With hyphens**: `550e8400-e29b-41d4-a716-446655440000` (standard)
- **Without hyphens**: `550e8400e29b41d4a716446655440000` (compact)
- **Uppercase**: `550E8400-E29B-41D4-A716-446655440000`

### Step 3: NanoID Options (NanoID only)

- **Length**: Default 21, adjustable from 4 to 128
- **Alphabet**: Leave empty for default URL-safe characters; customize as needed (e.g., digits only: `0123456789`)

### Step 4: Set Count and Generate

Enter the desired count (1–100), then click "Generate".

### Step 5: Copy Results

- **Click any row**: Copies that single ID
- **"Copy All"**: Copies all results to clipboard, newline-separated

## Notes

- All generation happens locally in your browser — no data is uploaded
- UUID v7 requires the `uuid` library, which is loaded on first use (~8KB)


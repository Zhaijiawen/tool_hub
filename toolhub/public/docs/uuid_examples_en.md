# UUID & NanoID — Example Output

## UUID v4 (standard)

```
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8
```

Notice the third character group always starts with `4` — that's the version nibble for v4. The first character of the fourth group is `8`, `9`, `a`, or `b` — the variant bits.

## UUID v4 (uppercase, no hyphens)

```
550E8400E29B41D4A716446655440000
F47AC10B58CC4372A5670E02B2C3D479
```

Compact format strips 4 hyphens, saving 4 characters. Same entropy, less readable.

## UUID v7 (sortable by creation time)

```
018e5a2f-1234-7abc-8def-0123456789ab
018e5a2f-1235-7def-9012-abcdef012345
018e5a2f-1236-7000-b123-000000000001
```

The first three groups are the timestamp. If you generate a batch of v7 UUIDs, they'll naturally sort in creation order. This is the killer feature for database primary keys.

## NanoID (default 21 characters)

```
V1StGXR8_Z5jdHi6B-myT
4Xnm6DK8VB_v3FP2W0mJi
7TsRq1DcH_5mY3gNKpBwX
```

21 URL-safe characters. No hyphens, no encoding needed — paste directly into URLs.

## NanoID (digits only, length 10)

```
3847291056
9012847365
1029384756
```

Useful for verification codes or short numeric IDs where readability matters.

## Using in code

```javascript
// UUID v4
import { v4 as uuidv4 } from 'uuid'
const id = uuidv4()
// => '110ec58a-a0f4-4ac4-8ec2-c5b67f3a1590'

// UUID v7
import { v7 as uuidv7 } from 'uuid'
const id = uuidv7()
// => '018e5a2f-1234-7abc-8def-0123456789ab'

// NanoID
import { nanoid } from 'nanoid'
const id = nanoid()
// => 'V1StGXR8_Z5jdHi6B-myT'

// NanoID with custom length and alphabet
import { customAlphabet } from 'nanoid'
const numericId = customAlphabet('0123456789', 10)
numericId()  // => '3847291056'
```

The `customAlphabet` function is useful when you need IDs in a specific format — numeric-only, lowercase-only, or restricted to characters your system supports.

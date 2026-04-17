# UUID / NanoID Examples

## UUID v4 Examples

```
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
6ba7b810-9dad-11d1-80b4-00c04fd430c8
```

## UUID v4 (Uppercase, No Hyphens)

```
550E8400E29B41D4A716446655440000
F47AC10B58CC4372A5670E02B2C3D479
```

## UUID v7 Examples (Sortable, Time-prefixed)

```
018e5a2f-1234-7abc-8def-0123456789ab
018e5a2f-1235-7def-9012-abcdef012345
018e5a2f-1236-7000-b123-000000000001
```

> The first 48 bits of UUID v7 are a Unix timestamp (milliseconds), so batch-generated v7 IDs are naturally ordered

## NanoID Examples (Default Length 21)

```
V1StGXR8_Z5jdHi6B-myT
4Xnm6DK8VB_v3FP2W0mJi
7TsRq1DcH_5mY3gNKpBwX
```

## NanoID Custom (Digits Only, Length 10)

Alphabet: `0123456789`, Length: `10`

```
3847291056
9012847365
1029384756
```

## Usage in Code

```javascript
// Node.js / Browser
import { v4 as uuidv4 } from 'uuid'
const id = uuidv4()
// => '110ec58a-a0f4-4ac4-8ec2-c5b67f3a1590'

// NanoID
import { nanoid } from 'nanoid'
const id = nanoid()
// => 'V1StGXR8_Z5jdHi6B-myT'


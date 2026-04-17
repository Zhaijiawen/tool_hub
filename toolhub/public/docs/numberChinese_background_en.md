# Number to Chinese — Background

## Why Chinese Uppercase Numbers?

In Chinese financial, legal, and banking contexts, monetary amounts must be written in Chinese uppercase (大写) to prevent fraud and tampering. The national standard GB/T 15834 defines the writing rules.

## Three Conversion Modes

### 1. Uppercase Mode
Uses formal Chinese characters: 壹贰叁肆伍陆柒捌玖拾佰仟万亿

Example: `1234` → `壹仟贰佰叁拾肆`

### 2. Lowercase Mode
Uses everyday Chinese numerals: 一二三四五六七八九十百千万亿

Example: `1234` → `一千二百三十四`

### 3. Financial Mode
Follows banking/financial convention with currency units:

Example: `1234.56` → `壹仟贰佰叁拾肆元伍角陆分`

Rules:
- Append 整 when there are no decimal digits
- Add 零 between yuan and fen when jiao is 0
- Write 零元整 when the amount is 0

## Character Reference Table

| Arabic | Uppercase | Lowercase |
|--------|-----------|-----------|
| 0 | 零 | 零 |
| 1 | 壹 | 一 |
| 2 | 贰 | 二 |
| 3 | 叁 | 三 |
| 4 | 肆 | 四 |
| 5 | 伍 | 五 |
| 6 | 陆 | 六 |
| 7 | 柒 | 七 |
| 8 | 捌 | 八 |
| 9 | 玖 | 九 |


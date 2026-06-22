# Number to Chinese - Background

In Chinese business, legal, and banking contexts, numbers aren't just written in Arabic digits -- they're written out in formal Chinese characters (大写, "uppercase numbers"). The reason is simple: it's very hard to tamper with 壹 (1) by adding a stroke to make it 贰 (2), whereas adding a stroke to "1" to make "7" is trivially easy. Financial fraud prevention through typography.

The national standard GB/T 15834 defines the rules. This tool implements the three standard modes.

## Three modes of conversion

### Uppercase (大写)
The formal, tamper-resistant characters used on checks, contracts, and official receipts: 壹贰叁肆伍陆柒捌玖拾佰仟万亿. These are the characters you'll see on a Chinese bank check or a formal invoice.

`1234` becomes `壹仟贰佰叁拾肆`

### Lowercase (小写)
Everyday Chinese numerals, equivalent to writing out "one thousand two hundred thirty-four" in English: 一二三四五六七八九十百千万亿. Used in casual writing and non-legal contexts.

`1234` becomes `一千二百三十四`

### Financial (财务金额)
The full banking format with currency units (元/角/分). This follows strict rules:
- If there are no decimal digits (no jiao, no fen), append 整 (exact)
- If jiao is 0 but fen is not, insert 零 between yuan and fen
- A zero amount is written as 零元整
- Only two decimal places are meaningful (jiao and fen)

`1234.56` becomes `壹仟贰佰叁拾肆元伍角陆分`
`100.00` becomes `壹佰元整`
`100.05` becomes `壹佰元零伍分`

## The character set

| Digit | Uppercase | Lowercase | Why uppercase is tamper-proof |
|---|---|---|---|
| 0 | 零 | 零 | Can't be altered to another number |
| 1 | 壹 | 一 | 一 can become 二/三; 壹 cannot |
| 2 | 贰 | 二 | 二 can become 三/五; 贰 cannot |
| 3 | 叁 | 三 | 三 can become 五; 叁 cannot |
| 4 | 肆 | 四 | Complex strokes prevent alteration |
| 5 | 伍 | 五 | 五 can become any number; 伍 cannot |
| 6 | 陆 | 六 | 六 becomes 大 easily; 陆 is safe |
| 7 | 柒 | 七 | 七 becomes 九 easily; 柒 is safe |
| 8 | 捌 | 八 | 八 becomes 大 easily; 捌 is safe |
| 9 | 玖 | 九 | 九 can become 五; 玖 is safe |

The uppercase characters are deliberately complex -- more strokes, harder to modify. This is the exact same principle behind writing checks in English as "one hundred twenty-three and 00/100 dollars" instead of just "123.00."

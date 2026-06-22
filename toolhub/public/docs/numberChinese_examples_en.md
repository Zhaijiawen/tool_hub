# Number to Chinese - Examples

## Integer conversions

| Number | Uppercase | Lowercase |
|---|---|---|
| 0 | 零 | 零 |
| 1 | 壹 | 一 |
| 10 | 壹拾 | 一十 |
| 100 | 壹佰 | 一百 |
| 1000 | 壹仟 | 一千 |
| 10000 | 壹万 | 一万 |
| 100000 | 壹拾万 | 一十万 |
| 1000000 | 壹佰万 | 一百万 |
| 100000000 | 壹亿 | 一亿 |

Notice how 10 in lowercase is `一十` -- this is the natural way to say it. But in uppercase it's `壹拾` -- the formal version. Chinese number grouping is in units of 10^4 (万) and 10^8 (亿), not the Western 10^3 (thousand) and 10^6 (million). This is why `100000` becomes `壹拾万` (10 x 10,000) and not something based on "hundred thousand."

## Financial mode

| Number | Financial Chinese | Note |
|---|---|---|
| 0 | 零元整 | Zero amount |
| 1 | 壹元整 | Integer, appends 整 |
| 10 | 壹拾元整 | Ten yuan exactly |
| 100.50 | 壹佰元伍角 | Rounded to jiao |
| 100.05 | 壹佰元零伍分 | Zero jiao, has fen -- note the 零 |
| 100.55 | 壹佰元伍角伍分 | Both jiao and fen |
| 1234.56 | 壹仟贰佰叁拾肆元伍角陆分 | Full amount |
| 10000.01 | 壹万元零壹分 | Large number with fen |
| 100000000 | 壹亿元整 | 100 million yuan |
| 123456789.99 | 壹亿贰仟叁佰肆拾伍万陆仟柒佰捌拾玖元玖角玖分 | Max realistic check amount |

The large number example at the bottom -- 123,456,789.99 -- decomposes as:
- 1 亿 (100,000,000)
- 2345 万 (23,450,000)
- 6789 (6,789)
- .99 = 9 角 9 分

The Chinese grouping at 万 and 亿 boundaries is why it reads `壹亿贰仟叁佰肆拾伍万...` rather than the Western grouping. If you're not familiar with this system, the tool handles it correctly so you don't have to think about it.

## Negative numbers

| Number | Uppercase |
|---|---|
| -100 | 负壹佰 |
| -1234.56 | 负壹仟贰佰叁拾肆元伍角陆分 (financial) |

The negative prefix 负 is added before the amount. For financial mode, you'd rarely use negative amounts on actual checks, but it's supported for completeness.

## Practical comparison: why uppercase matters

Imagine a handwritten IOU: `欠款 1000 元` (owes 1,000 yuan). With lowercase 一 (one), someone could add a stroke and make it 二千 (2,000) or 三千 (3,000). That's why legal documents use 壹仟 -- the strokes can't be altered into a different number without being obvious.

Same document with uppercase: `欠款壹仟元整` -- try tampering with 壹 to make it 贰, 叁, or anything else. You can't without leaving clear evidence of alteration. That's the entire point of this system, and it's been working for centuries.

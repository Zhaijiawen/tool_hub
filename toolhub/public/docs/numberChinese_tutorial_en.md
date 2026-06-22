# Number to Chinese - Tutorial

Converts Arabic numbers to Chinese character representations in three modes: uppercase (formal), lowercase (casual), and financial (banking format with currency).

## How to use

1. Type (or paste) a number into the input field
2. Pick a mode: Uppercase, Lowercase, or Financial
3. Copy the result

You can also click the quick example buttons to see all three modes at once for demo numbers.

## Which mode to use

| Mode | When | Characters |
|---|---|---|
| Uppercase | Contracts, legal documents, formal receipts | 壹贰叁肆伍陆柒捌玖 |
| Lowercase | Casual writing, notes, non-legal contexts | 一二三四五六七八九 |
| Financial | Checks, bank transfers, invoices, tax documents | 壹贰叁...元角分整 |

## What input is accepted

Integers, decimals, and negatives all work:

- `100` -- plain integer
- `12345` -- larger integer (auto-handles 万 and 亿 groupings)
- `100000000` -- 100 million, becomes 壹亿
- `100.50` -- decimal, financial mode gets 伍角
- `1234.99` -- financial mode only uses 2 decimal places (角 and 分)
- `-100` -- negative, prepends 负
- `-1234.56` -- negative financial amount

## Financial mode rules explained

These are the standard Chinese banking conventions:

| Input | Output | Rule |
|---|---|---|
| `100` | 壹佰元整 | No decimal = append 整 (exact amount) |
| `100.50` | 壹佰元伍角 | Has jiao, no fen -- just the jiao |
| `100.05` | 壹佰元零伍分 | Zero jiao, has fen -- insert 零 before fen |
| `100.55` | 壹佰元伍角伍分 | Has both jiao and fen |
| `0` | 零元整 | Zero amount |

The 零 placement rule is the trickiest part: when jiao (tenths) is zero but fen (hundredths) is nonzero, you need 零 between the yuan amount and the fen to indicate the gap. This matches how amounts are read aloud in Chinese.

## Practical tips

- If you're filling out a Chinese bank transfer form, use Financial mode and copy the result directly into the amount field.
- For large numbers (亿 range), verify the grouping is correct -- the tool handles the 万 (10^4) and 亿 (10^8) groupings that differ from Western thousands/millions.
- The tool doesn't support numbers beyond 10^12 (万亿 range) perfectly due to JavaScript precision limits.

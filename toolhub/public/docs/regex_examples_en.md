# Regular Expression Tester — Examples

## Validating emails

**Pattern:** `^[\w.-]+@[\w.-]+\.[a-z]{2,}$`
**Flags:** `i`

This is the "works for 99% of signup forms" pattern. It checks that there's something before the `@`, something after, and that the TLD is at least two letters.

| Input | Match? | Why |
|---|---|---|
| `user@example.com` | Yes | Standard email, no surprises |
| `user.name+tag@domain.co` | Yes | Dots and plus signs in the local part are fine |
| `user@domain` | No | Missing the TLD — `domain` isn't a valid domain by itself |
| `@domain.com` | No | Nothing before the `@` — the local part is required |

If you're validating against a form and want to also catch typos like `user@gmial.com`, you'd need a separate spell-check layer — regex alone won't save you from that.

## Extracting all numbers from text

**Pattern:** `\d+`
**Flags:** `g`

This is one of those patterns you'll reach for constantly. It pulls every run of digits out of a string, which comes up when scraping prices, parsing logs, or extracting IDs from mixed text.

**Input:** `Order 42 contains 3 items worth $150.00`
**Matches:** `42`, `3`, `150`, `00`

Notice how `150.00` gives you two matches — `150` and `00` — because `.` isn't a digit. If you want to capture the full decimal number, you'd use `\d+\.?\d*` instead. Small tweak, very different result.

## Matching ISO dates

**Pattern:** `\b\d{4}-\d{2}-\d{2}\b`
**Flags:** `g`

The `\b` word boundaries are doing important work here — they prevent the pattern from matching inside longer strings like `2024-03-15T14:30:00Z`. Without them, you'd get a partial match on the date portion of an ISO datetime.

**Input:**
```
Meeting on 2024-03-15 and deadline is 2024-04-01.
```
**Matches:** `2024-03-15`, `2024-04-01`

This pattern is deliberately lenient — it'll match `2024-99-99` even though that's not a real date. For strict date validation you'd need range checks, and that's honestly better done in code than in regex. Use regex to extract candidate date strings, then validate them programmatically.

## Capturing first and last names

**Pattern:** `(\w+)\s(\w+)`
**Flags:** (none needed)

Groups let you pull structured data out of a match instead of just knowing something matched.

**Input:** `John Doe`
**Group 1:** `John`
**Group 2:** `Doe`

This is the foundation of every name-reversal pattern. To swap last and first name with a comma, use the same pattern with a replacement string of `$2, $1` — boom, `Doe, John`. Same idea works for reformatting phone numbers, address lines, or any data where the order of components needs to change.

## Finding hex colors in CSS

**Pattern:** `#[0-9a-fA-F]{3,6}\b`
**Flags:** `gi`

**Input:** `body { color: #333; background: #f0f0f0; border: 1px solid #ff6600; }`
**Matches:** `#333`, `#f0f0f0`, `#ff6600`

The `{3,6}` quantifier handles both shorthand (`#333`) and full (`#ff6600`) hex colors. The `\b` at the end keeps it from matching partial colors that happen to be part of longer identifiers.

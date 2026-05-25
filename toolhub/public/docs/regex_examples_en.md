# Regular Expression Tester — Examples

## Example 1: Validate an Email Address

**Pattern:** `^[\w.-]+@[\w.-]+\.[a-z]{2,}$`
**Flags:** `i`

| Input | Match? |
|---|---|
| `user@example.com` | ✅ |
| `user.name+tag@domain.co` | ✅ |
| `user@domain` | ❌ |
| `@domain.com` | ❌ |

## Example 2: Extract All Numbers

**Pattern:** `\d+`
**Flags:** `g`
**Input:** `Order 42 contains 3 items worth $150.00`
**Matches:** `42`, `3`, `150`, `00`

## Example 3: Match ISO Dates

**Pattern:** `\b\d{4}-\d{2}-\d{2}\b`
**Flags:** `g`
**Input:**
```
Meeting on 2024-03-15 and deadline is 2024-04-01.
```
**Matches:** `2024-03-15`, `2024-04-01`

## Example 4: Capture Groups

**Pattern:** `(\w+)\s(\w+)`
**Input:** `John Doe`
**Group 1:** `John`
**Group 2:** `Doe`


# Regular Expression Tester — Usage Tutorial

## How to Use

### Step 1: Enter Your Pattern
Type or paste your regular expression into the **Pattern** field. Do not include surrounding slashes (`/pattern/`).

### Step 2: Set Flags
Select the flags you need:
- **g** — Global: find all matches
- **i** — Case-insensitive
- **m** — Multiline

### Step 3: Enter Test String
Paste the text you want to test against your pattern in the **Test String** area.

### Step 4: View Results
- All matches are highlighted in the test string
- Match details (index, value, groups) are shown below the test area

## Common Patterns

| Purpose | Pattern |
|---|---|
| Email validation | `^[\w.-]+@[\w.-]+\.[a-z]{2,}$` |
| URL detection | `https?://[\w./?=%&-]+` |
| IP address | `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b` |
| Phone number (US) | `\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}` |
| Date (YYYY-MM-DD) | `\d{4}-\d{2}-\d{2}` |
| HTML tag | `<([a-z]+)[^>]*>.*?</\1>` |
| Hex color | `#[0-9a-fA-F]{3,6}` |

## Tips
- Use the `g` flag to see all matches at once
- Test edge cases — what about empty strings, special characters, and long inputs?
- Use `()` to capture specific parts of a match


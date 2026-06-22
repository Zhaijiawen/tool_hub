# Random Password Generator — How to Use

## Quick generation

Default settings (16 characters, all character sets, count 1) produce a strong password immediately. Click Generate, click the result to copy, done.

## Configuration options

**Length —** Drag the slider or type a number (4 to 128). Rough guidelines:
- Regular accounts: 12-16 characters
- Email, banking, anything critical: 20+ characters
- API keys and secrets: 32+ characters

**Character sets —**

| Option | Characters |
|--------|-----------|
| Uppercase | A-Z (26) |
| Lowercase | a-z (26) |
| Digits | 0-9 (10) |
| Symbols | `!@#$%^&*()_+-=[]{}|;:,.<>?` (28 by default) |

**Custom symbols —** After enabling symbols, you can edit the symbol set. Some sites only accept a subset of special characters (looking at you, bank websites with "only !@#$ are allowed"). Trim the set to match what the target system accepts.

**Exclude ambiguous characters —** Removes `0`, `O`, `l`, `1`, `I` — the characters that look identical in many fonts. Use this when the password needs to be typed manually or written down.

**Batch generation —** Set count up to 20. Each click of a row copies that single password. "Copy All" copies everything, one per line — paste into a password manager or text file.

## Copy options

- Click any row to copy just that password
- "Copy All" copies all passwords, newline-separated, in one operation

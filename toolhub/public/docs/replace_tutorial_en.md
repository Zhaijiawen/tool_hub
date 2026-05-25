# Find & Replace — Usage Tutorial

## How to Use

### Step 1: Paste Your Text
Enter or paste the text you want to process into the input area.

### Step 2: Enter the Search Term
Type the text or pattern you want to find in the **Find** field.

### Step 3: Enter the Replacement
Type the replacement text in the **Replace** field. Leave it empty to effectively delete all matches.

### Step 4: Configure Options
- **Regex Mode**: Toggle to enable regular expression matching
- **Case Sensitive**: Toggle to control case sensitivity (default: case-insensitive)

### Step 5: Replace
- Click **Replace All** to replace every occurrence
- The result appears in the output area automatically

## Working with Regular Expressions

When Regex Mode is enabled, the search field accepts regex patterns. The replacement field supports backreferences:
- `$1` — first captured group
- `$2` — second captured group
- `$&` — the entire match

### Example: Swap first and last name
- **Find**: `(\w+)\s+(\w+)`
- **Replace**: `$2 $1`
- **Input**: `John Doe`
- **Output**: `Doe John`

## Tips
- Use `.*` in regex to match any sequence of characters
- Escape special characters with `\` (e.g., `\.` to match a literal dot)
- Preview results before copying to ensure correctness


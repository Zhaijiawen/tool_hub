# Find & Replace — Examples

## Simple word swap

**Find:** `color`
**Replace:** `colour`
**Input:**
```
The color of the sky is blue. I love this color.
```
**Output:**
```
The colour of the sky is blue. I love this colour.
```

This is the most basic use case — find a literal string, replace with another literal string. No regex, no backreferences, just straightforward substitution. If you're localizing content from US to UK English, this plus a few more passes handles it.

## Stripping HTML tags

**Find:** `<[^>]+>`
**Replace:** *(empty)*
**Input:**
```html
<p>Hello <strong>world</strong>, this is a <em>test</em>.</p>
```
**Output:**
```
Hello world, this is a test.
```

The pattern `<[^>]+>` matches an opening angle bracket, then one or more characters that aren't a closing bracket, then the closing bracket — which catches any HTML tag in one shot. Leaving the replacement empty deletes them all. This won't handle self-closing tags with attributes spanning multiple lines but for single-line markup it works perfectly.

## Reformatting dates

**Find:** `(\d{4})-(\d{2})-(\d{2})`
**Replace:** `$3/$2/$1`
**Input:**
```
Event date: 2024-03-15
```
**Output:**
```
Event date: 15/03/2024
```

Three capturing groups grab year, month, and day separately, then the replacement string rearranges them. You could swap the separators too — change the replacement to `$2-$3-$1` for MM-DD-YYYY if that's what your system expects. The point is the data stays intact; only the presentation changes.

## Deleting blank lines

**Find:** `^\n`
**Replace:** *(empty)*
**Input:**
```
Line 1

Line 2


Line 3
```
**Output:**
```
Line 1
Line 2
Line 3
```

`^` anchors to the start of a line (needs multiline mode, which the tool enables when appropriate). `\n` matches the newline character. Together they match lines that are completely empty. Run it once and consecutive blank lines collapse. Note that `^\n` matches an empty line followed by a newline — it won't catch a trailing blank line at the very end of a file with no newline after it, which is actually what you usually want.

## Removing trailing whitespace from lines

**Find:** `[ \t]+$`
**Replace:** *(empty)*
**Input:**
```
function foo() {   
  return 42;      
}                
```
**Output:**
```
function foo() {
  return 42;
}
```

`[ \t]+` matches one or more spaces or tabs, and `$` anchors to the end of each line. This cleans up the invisible junk that linters complain about without affecting intentional indentation. Add `\r` to the character class if you're dealing with Windows-style line endings.

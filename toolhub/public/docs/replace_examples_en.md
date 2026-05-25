# Find & Replace — Examples

## Example 1: Simple Word Replacement

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

## Example 2: Remove HTML Tags (Regex Mode)

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

## Example 3: Reformat Date (Regex Mode)

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

## Example 4: Delete Blank Lines (Regex Mode)

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


# Whitespace Handling — Examples

## Example 1: Clean User Input

**Input:**
```
   John Doe
```
**Trim Output:**
```
John Doe
```

## Example 2: Normalize a CSV Row

**Input:**
```
name,   age,   city
John,   25,    New York
```
**Compress Output:**
```
name, age, city
John, 25, New York
```

## Example 3: Fix Copy-Pasted Text

**Input:**
```
The   quick  brown    fox   jumps
over   the   lazy   dog
```
**Compress Output:**
```
The quick brown fox jumps
over the lazy dog


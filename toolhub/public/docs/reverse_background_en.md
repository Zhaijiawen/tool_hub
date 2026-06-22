# Text Reversal — Technical Background

Text reversal sounds like one of those toy problems you get in a coding interview, but it actually shows up in practical contexts more often than you'd think. The basic idea is simple — flip the order of things — but what "things" means depends on the mode you pick.

The tool handles three flavors of reversal, and they serve very different purposes.

## Character reversal

This flips every single character in the string, including spaces, punctuation, and newlines. The string `Hello World` becomes `dlroW olleH` — the whole thing, not word by word. It's the most literal form of reversal.

Character reversal is what you reach for when checking palindromes (`racecar` reversed is still `racecar`), doing simple obfuscation for demo purposes, or solving algorithm challenges. It's also the basis for manually reversing encoded data when you're debugging binary protocols or character-level transformations.

One subtlety: Unicode. Reversing a string with multi-byte characters, combining marks, or emoji (which are often surrogate pairs) requires handling grapheme clusters, not just code units. The string `café` (cafe + combining acute accent) should reverse to `éfac`, not `́efac`. The tool handles this correctly by operating on full characters rather than raw bytes.

## Word order reversal

This keeps each word intact but flips the order they appear in. `The quick brown fox` becomes `fox brown quick The`. Each line is processed independently, so multi-line input keeps its line structure — only the words within each line get reordered.

This is surprisingly useful for last-name-first conversions. A line like `John Smith` reversed by word becomes `Smith John` — that's the bulk of name reformatting done in one click. It's also handy when you need to read a sentence in right-to-left word order without actually changing your text direction settings.

## Line reversal

This flips the order of entire lines while keeping each line's content untouched. Line 1, Line 2, Line 3 becomes Line 3, Line 2, Line 1.

The most common use case is log files. Logs are almost always written with the newest entry at the bottom — which means the information you actually care about requires scrolling to the end. Line reversal puts the most recent entries at the top where you can see them immediately. It's a one-click alternative to `tail -r` or piping through `tac`.

## Practical contexts

Beyond the obvious examples, reversal operations come up in:

- **DNA/RNA sequence analysis**: Reverse complements are a standard operation in bioinformatics, and while this tool doesn't compute complements, the reverse operation is the first step in that pipeline.
- **Stack simulation**: Reversing a string mimics what happens when you push characters onto a stack and pop them off — a classic data structure visualization.
- **Encoding experiments**: When you're reverse-engineering a simple encoding scheme, character reversal is often one of the first transformations to try.
- **UI testing**: Reversing text is a quick way to generate visually distinct test data — it's immediately obvious whether the right string made it into the right field.

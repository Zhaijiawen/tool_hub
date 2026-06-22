# Text Reversal — Usage Tutorial

The reversal tool is one of those things that takes longer to describe than to use. Three modes, each with a clear output.

Drop your text into the input area — whatever you need flipped around.

Pick your mode:

- **Reverse Text** flips every character in the entire input. Spaces, punctuation, newlines — everything gets reversed. If you paste `Hello World`, you get `dlroW olleH`. It's character-level, no exceptions. This is the mode you want for palindrome checks, simple scrambling, or when you genuinely need the string read backward.

- **Reverse Words** keeps each word as-is but reverses their order within each line. Multi-line input is handled line by line — the line breaks stay where they are, only the words on each line get reordered. `one two three` becomes `three two one`. Super handy for flipping "FirstName LastName" into "LastName FirstName" in a batch.

- **Reverse Lines** reverses the entire line order of the input. A log file with the newest entry at the bottom becomes newest-at-top. Three lines of text become a mirror image vertically. Each line's content is untouched — only the sequence changes.

The output updates as soon as you pick a mode. Hit **Copy** to grab it, or **Clear** to reset everything and start over.

## When to use which mode

Character reversal is the most aggressive — use it when the transformation needs to go all the way down to individual characters. Word reversal is the sweet spot for text that has meaningful word boundaries you want to preserve. Line reversal is for structural reorganization of block text.

A common mistake: picking character reversal when you meant word reversal and wondering why your name turned into "eniL hcoL". If the output looks scrambled at the character level, you probably want word mode instead.

## Pro tips

- Word reversal processes each line independently, so line breaks in your input are preserved. If you want to reverse words across the entire text as a single stream, join all lines first (paste into a text editor, replace newlines with spaces), then reverse.
- Character reversal handles Unicode correctly, so emoji, accented characters, and CJK text all reverse as you'd expect — no broken glyphs.
- If you're using this to check palindromes, remember to strip spaces and punctuation first if they shouldn't count. `A man, a plan, a canal: Panama` isn't a palindrome until you normalize it.

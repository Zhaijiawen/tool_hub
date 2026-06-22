# Regular Expression Tester — Usage Tutorial

The regex tester gives you instant visual feedback as you build and refine patterns. No more running a script, waiting for output, tweaking, running again — just type and see what lights up.

Drop your regex into the **Pattern** field. Don't wrap it in slashes like `/pattern/` — the tool handles the delimiters for you. If you've copied a pattern from JavaScript code that uses the literal syntax, strip the `/` and any flags off the end first.

Next pick your flags. The three you'll use 90% of the time:
- **g** (global) — Without this you only get the first match, which is fine for validation but useless when you're trying to see every hit in a log file.
- **i** (case-insensitive) — Turn this on unless casing actually matters for your use case. Email addresses, HTML tags, and most search patterns don't care about case.
- **m** (multiline) — Changes how `^` and `$` behave. With it on, they anchor to individual lines; off, the whole string is one unit. Crucial for multi-line logs or code blocks.

Paste your test string in the main area and you'll see matches highlighted immediately. Each match shows its index, the matched text, and any captured groups — super useful when you're debugging a pattern that should be pulling out specific substrings.

## Patterns you'll actually use

Some patterns keep coming up no matter what you're building:

| What you're after | Pattern |
|---|---|
| Email validation | `^[\w.-]+@[\w.-]+\.[a-z]{2,}$` |
| URL detection | `https?://[\w./?=%&-]+` |
| IP address (basic) | `\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b` |
| Phone number | `\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}` |
| ISO date | `\d{4}-\d{2}-\d{2}` |
| HTML tag (basic) | `<([a-z]+)[^>]*>.*?</\1>` |
| Hex color | `#[0-9a-fA-F]{3,6}` |

The email pattern above is the "good enough for most forms" version. It catches `user@example.com` and `user.name+tag@domain.co` while rejecting `user@domain` and `@domain.com`. For production you'd want something more rigorous but for client-side validation this hits the sweet spot of readability and accuracy.

The IP address pattern is deliberately simple — it'll match `999.999.999.999` which isn't a valid IP. If you need proper validation, break it down with a more constrained pattern or just pass the matched string through `parseInt` and check the range.

## Debugging tips

When a pattern isn't matching the way you expect, the tester's real-time highlighting makes debugging way faster than console.log loops:
- Start simple. Build the pattern piece by piece, checking what matches after each addition.
- If `.*` is eating too much, try `.*?` instead — lazy matching often fixes over-greedy patterns.
- Test edge cases deliberately. Throw in empty strings, unicode characters, emojis, and strings that are way longer than you expect.
- Use `()` to capture the parts you care about, then verify the captured groups show what you intended.
- The `g` flag changes the behavior of `exec()` in JavaScript — if your code uses `/pattern/g` in a loop, make sure to test with `g` on in the tester too.

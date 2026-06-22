# Find & Replace — Usage Tutorial

The replace tool is dead simple in concept — type what to find, type what to replace it with, hit the button — but the regex mode opens up a lot of ground that isn't obvious at first glance.

Start by dropping your text into the input area. It can be anything: a config file, a chunk of HTML, a log dump, whatever you need to clean up.

In the **Find** field, enter what you're searching for. If regex mode is off, it's a literal string search — `color` finds exactly `color` and nothing else. If regex mode is on, the field becomes a pattern input where you can use the full regex syntax.

In the **Replace** field, type what you want each match to become. Leave it empty and you're effectively deleting matches — the fastest way to strip HTML tags, remove comments, or clean up noise from data.

Two toggles control the behavior:
- **Regex Mode**: Off by default. Turn it on when you need pattern matching rather than literal search. The find field immediately starts interpreting metacharacters, so remember to escape literal dots and parentheses with `\`.
- **Case Sensitive**: Off by default — `hello` matches `Hello` and `HELLO`. Flip it on when casing matters, like when you're renaming a specific identifier in code.

Hit **Replace All** and the output updates in place. Every occurrence of the find pattern gets swapped, and you can copy the result immediately.

## Using backreferences

When regex mode is on and your pattern has capturing groups `()`, the replacement string can reference them:
- `$1` — first captured group
- `$2` — second captured group
- `$&` — the entire match

This is how you restructure data without losing content. Say you have a list of names in "FirstName LastName" format and need "LastName, FirstName" — the pattern `(\w+)\s+(\w+)` with replacement `$2, $1` does it in one pass.

For dates, `(\d{4})-(\d{2})-(\d{2})` captures year, month, and day separately. Replacement `$3/$2/$1` flips the order to day/month/year. No scripting needed.

## Common workflow gotchas

- If you toggle regex mode on after typing a find pattern, double-check it. Characters like `.` and `()` that were literal moments ago are now metacharacters.
- Regex mode with an empty find field won't match anything — `.*` is what you want if you're trying to wrap or transform entire lines.
- `\n` matches newlines in regex mode but only if the engine allows it (JavaScript's `.` doesn't match `\n` without the `s` flag, but `\n` itself as a character always works in character classes and alternations).
- When replacing with backreferences, make sure the groups in your pattern actually capture — a `(?:...)` non-capturing group won't create a `$1`.

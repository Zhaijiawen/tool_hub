# Find & Replace — Technical Background

Find and replace is the kind of thing you don't think about until you need it, and then you really need it. Whether you're cleaning up a CSV dump, refactoring variable names across a config file, or stripping markup from scraped content, this operation is fundamental to any text workflow.

At its core, the tool takes a search term, scans through your text, and swaps every match with a replacement string. What makes it interesting is what you can use as the search term: plain literal text, or a regex pattern that describes a whole class of strings.

## Plain text vs. regex

Plain text search does exactly what it says — your search string has to appear verbatim in the source. It's fast, predictable, and the right call for straightforward substitutions like fixing a typo or renaming a single constant.

Regex mode turns the search field into a pattern-matching engine. Instead of looking for one specific string, you describe the shape of what you're after:

```
\d+        → one or more digits (any number)
[a-z]+     → one or more lowercase letters
\bword\b   → the exact word "word" with boundaries — won't match "password"
(foo|bar)  → either "foo" or "bar"
```

The trade-off is straightforward: plain text is simpler and harder to get wrong, regex covers way more ground in a single expression but demands that you know its syntax. Most people start with plain text and reach for regex when their find terms get complicated.

## How replacement works

When the engine finds a match, it replaces the matched text with your replacement string. Simple enough. But with regex, the replacement string can reference captured groups from the pattern using `$1`, `$2`, and so on. That's where things get powerful.

```
Pattern:      (\w+)\s(\w+)
Input:        John Doe
Replacement:  $2, $1
Result:       Doe, John
```

The parentheses in the pattern captured "John" as `$1` and "Doe" as `$2`, then the replacement string rearranged them. Same trick works for reformatting dates, restructuring address lines, or any data where the order of components needs to change without losing information.

In JavaScript-land, you also have `$&` for the full match and `` $` `` / `$'` for text before/after the match, though those see less use in practice.

## Case sensitivity and scope

Two settings change how the search behaves:

- **Case sensitivity**: In case-sensitive mode, `hello` misses `Hello` and `HELLO`. In case-insensitive mode, they all match. For most text cleanup tasks you'll want case-insensitive — but when refactoring code (where `userName` and `UserName` are different identifiers), case sensitivity matters.
- **Replace all vs. replace first**: "Replace all" hits every occurrence — what you want for global refactors. "Replace first" stops after one match, which is useful when you know there's only one instance or you want to step through manually.

## Where you'll use this

| Use Case | Find | Replace |
|---|---|---|
| Rename a variable | `oldVar` | `newVar` |
| Fix a typo | `teh` | `the` |
| Date reformat | `(\d{4})-(\d{2})-(\d{2})` | `$3/$2/$1` |
| Strip HTML tags | `<[^>]+>` | *(empty)* |
| Remove trailing whitespace | `\s+$` | *(empty)* |
| Normalize line endings | `\r\n` | `\n` |

The trailing whitespace one is quietly one of the most useful patterns — linters complain about it constantly, and a single pass with this regex cleans up an entire file.

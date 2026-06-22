# How Diff Actually Works

If you use Git, you use diff every day. `git diff` tells you what changed, pull requests show diffs, merge conflicts happen when diffs overlap. Understanding what's happening under the hood makes you better at reading and resolving them.

## The Core Algorithm: Longest Common Subsequence

Most diff tools work by finding the Longest Common Subsequence (LCS) between the old and new text. Once you know what stayed the same, everything else must be an addition or a deletion. It's conceptually simple but computationally interesting -- a naive implementation on two 1000-line files would take forever.

The algorithm actually used in Git and most modern diff tools is the **Myers diff algorithm** (1986), which runs in O(ND) time where N is the total number of lines and D is the number of differences. When files are similar (which they usually are -- you're comparing versions of the same thing), D is small and the algorithm is fast.

## Three Levels of Granularity

### Line-level Diff
Text is split by newlines and compared line by line. This is what `git diff` shows you. Best for code, config files, and structured text where each line is a meaningful unit.

### Character-level Diff
Tracks changes down to individual characters. Useful for short strings or when you need to see exactly which characters changed within a single word. "color" vs "colour" -- line-level just says "line changed," character-level shows exactly the added `u`.

### Word-level Diff
Compares word by word, using whitespace as boundaries. Great for prose -- articles, documentation, legal text. Shows "changed this word to that word" instead of "this whole line is different."

## Display Formats

### Unified Diff
The classic `+` and `-` format. Lines starting with `-` were removed, `+` were added, and lines with neither are context. The `@@` markers show which line ranges are being compared.

### Side-by-side
Two panes, old on the left, new on the right. Differences are highlighted in both panes. This is what most code review tools use because it's the most intuitive for reading changes.

### Inline
A single view where additions are shown in green and deletions in red. More compact than side-by-side but can be harder to read for complex changes.

## Where Diff Matters

- **Code review**: Every PR review is fundamentally a diff review. Knowing how to read diffs quickly is a core skill.
- **Configuration management**: Comparing prod vs staging configs to catch drift before it causes outages.
- **Document versioning**: Tracking changes in specs, contracts, and policies.
- **Debugging**: "What changed between the working version and the broken one?" Diff the two states.

## Performance Notes

For very large files (tens of thousands of lines), diff computation gets expensive. This tool uses a JavaScript implementation that's fast enough for typical use cases (a few thousand lines). For enormous comparisons, strategies like pre-filtering identical prefixes/suffixes or using Web Workers for background computation help, but for most practical purposes the performance is fine.

# Diff Text Comparison -- How to Use

Put old text on the left, new text on the right. The tool highlights exactly what changed.

## Basic Workflow

The interface has two text panes:

- **Left pane**: Original text (the old version)
- **Right pane**: Modified text (the new version)

Paste or type in both sides. Both support multi-line text. Click **Compare** (or enable auto-compare to trigger on every keystroke) and the differences light up.

## Reading the Results

- **Green background**: Added content -- appears in the right pane but not the left
- **Red background**: Deleted content -- appears in the left pane but not the right
- **No background**: Unchanged content

A stats bar at the top summarizes the changes: `+N lines added / -N lines deleted`. Good for a quick gut check on the scale of changes.

## Comparison Modes

- **Line-level**: Compares line by line. Use this for code, config files, logs -- anything structured.
- **Character-level**: Precise per-character diff. Use this for short texts, single sentences, or when you need to see exact letter-level changes.

Switch modes with the toggle at the top. If line-level shows "entire line changed" but you want to see if it was just a typo fix, switch to character-level.

## Handy Features

- **Swap**: Flips left and right content. Useful when you want to reverse the perspective -- "what did they add?" vs "what did they remove?"
- **Copy left / Copy right**: Grab either pane's content to clipboard.
- **Clear**: Wipe everything for a fresh comparison.

## Practical Tips

### Normalize Formatting First

If the two texts have different indentation, line endings, or trailing whitespace, the diff will be noisy with formatting-only changes. Run the text through a formatter first, or use the tool's character-level mode which can spot that the actual content is identical despite whitespace differences.

### Choosing the Right Mode

| Scenario | Use |
|---|---|
| Code files | Line-level |
| Long documents | Line-level |
| Short text / word tweaks | Character-level |
| JSON/YAML configs | Line-level |
| Debugging a specific string change | Character-level |

### Reading the Stats

The `+N / -N` numbers give you a quick sense of the change:
- Lots of `-`, few `+`: Looks like code deletion or simplification
- Lots of `+`, few `-`: Probably new features or content
- Similar numbers: Likely a rewrite or refactoring -- same amount of content, different structure

## Common Issues

**Identical text showing as changed**: Usually caused by invisible characters -- Windows `\r\n` vs Unix `\n` line endings, or Unicode zero-width spaces. Clean the text or re-paste from a known-good source.

**Slow with very large texts**: Above 10K lines, diff computation takes noticeable time. For extremely long comparisons, extract only the sections you expect to differ.

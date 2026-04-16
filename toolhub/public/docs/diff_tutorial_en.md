# Diff Text Comparison - Tutorial

## Getting Started

The Diff text comparison tool helps you quickly find differences between two texts, whether for code comparison, document revision tracking, or configuration comparison.

## Basic Usage

### Step 1: Enter Your Text

The tool interface has two panes:
- **Left pane**: Enter the original text (old version)
- **Right pane**: Enter the modified text (new version)

You can paste text directly or type manually. Both panes support multi-line text.

### Step 2: Select Comparison Mode

Click the mode toggle at the top:
- **Line-level diff**: Compares line by line — ideal for code and config files
- **Character-level diff**: Precise character-by-character comparison — ideal for short texts

### Step 3: Run the Comparison

Click the **Compare** button, or enable real-time comparison to trigger automatically as you type.

### Step 4: View the Results

Results are displayed with color highlighting:
- 🟢 **Green background**: Added content (present on right, absent on left)
- 🔴 **Red background**: Deleted content (present on left, absent on right)
- ⬜ **No background**: Unchanged content

The stats bar at the top shows: `+N lines added / -N lines removed`

## Feature Details

### Swap Left and Right

Click the **Swap** button to exchange left and right content for a quick reverse comparison. This is useful when reviewing someone else's submission.

### Copy Functions

- **Copy left**: Copy left pane content to clipboard
- **Copy right**: Copy right pane content to clipboard

### Clear Function

Click the **Clear** button to reset all inputs and results for a fresh comparison.

## Example Scenarios

### Scenario 1: Comparing Code Changes

**Original code (left):**
```javascript
function greet(name) {
  console.log('Hello ' + name);
}
```

**Modified code (right):**
```javascript
function greet(name, title = '') {
  const greeting = title ? `Hello ${title} ${name}` : `Hello ${name}`;
  console.log(greeting);
}
```

The result will highlight the new parameter, added lines, and deleted old lines.

### Scenario 2: Document Revision Comparison

**Original text (left):**
```
This product is for enterprise users, offering a basic feature set.
Price: $99/month.
```

**Revised text (right):**
```
This product is for enterprise and individual users, offering a complete feature set.
Starting at $79/month.
```

Character-level diff will precisely mark every changed word.

### Scenario 3: Config File Differences

Compare configuration files between two environments (dev/prod) to quickly identify differing settings.

## Practical Tips

### Tip 1: Normalize Format Before Comparing

If the two texts have inconsistent formatting (different indentation, line endings), normalize them first with a formatting tool to avoid noise from formatting-only differences.

### Tip 2: Use the Swap Feature

When you receive someone's modified version and want to know what they changed:
1. Put your original in the left pane
2. Put their modified version in the right pane
3. The result shows all their changes

### Tip 3: Choosing Line-level vs Character-level

| Scenario | Recommended Mode |
|----------|-----------------|
| Code files | Line-level |
| Long documents | Line-level |
| Short text / word changes | Character-level |
| JSON/YAML config | Line-level |

### Tip 4: Understanding the Stats

The `+N / -N` stats at the top give quick insight into the scale of changes:
- Many deletions, few additions → likely code simplification
- Many additions, few deletions → likely new feature additions
- Similar additions and deletions → likely content replacement or refactoring

## FAQ

**Q: Why is identical content marked as changed?**

A: This is often caused by invisible characters (e.g., Windows `\r\n` vs Unix `\n` line endings, or Unicode invisible spaces). Try cleaning the text with a text processing tool first.

**Q: Comparison is slow for very long texts?**

A: Diff computation for very large texts takes time. Consider extracting only the portions you expect to differ for comparison.

**Q: Can I export the comparison results?**

A: You can copy the results to use in other tools.


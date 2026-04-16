# Diff Text Comparison - Technical Background

## What is Diff

Diff (Difference) algorithms are used to compare two text sequences and identify their differences. They are widely used in version control systems (like Git), code review tools, and document management systems.

## Historical Background

The diff algorithm was first proposed by Hunt and McIlroy in 1975 and was later integrated into the Unix `diff` command-line tool. Today, diff is an indispensable foundational tool in software development.

## Core Algorithms

### LCS (Longest Common Subsequence)

Most diff algorithms are based on LCS. LCS finds the longest common part between two sequences, inferring what was "added" and what was "removed."

### Myers Diff Algorithm

Eugene Myers proposed a more efficient diff algorithm in 1986 with time complexity O(ND), where N is the sequence length and D is the number of differences. This algorithm is widely adopted by modern tools like Git.

## Comparison Granularity

### Line-level Diff
- Splits text by newline characters
- Best suited for code files and config files
- Clearly shows which lines were modified, added, or deleted

### Character-level Diff
- Tracks changes down to each individual character
- Ideal for precise comparison of short texts
- Reveals word- or letter-level modifications

### Word-level Diff
- Compares word by word using whitespace as delimiters
- Suited for natural language (articles, documents)
- Clearly shows changes in wording

## Diff Display Formats

### Unified Diff Format
The standard format used by Git, where `+` denotes added lines, `-` denotes removed lines, and `@@` marks change positions.

### Side-by-side
Two panes show the original and modified content side by side, with differences highlighted for easy reading.

### Inline Diff
Additions and deletions are shown in the same view using color coding — green background for added content, red for removed.

## Use Cases

### Code Review
The diff view in Pull Requests is central to code review, helping developers quickly understand what changed.

### Document Version Tracking
Managing revision history for papers, contracts, and technical documents ensures every change is traceable.

### Configuration File Comparison
In operations, comparing configuration differences between production and test environments prevents issues from configuration mismatches.

### Data Validation
Comparing API responses against expected values for assertions in automated testing.

## Popular Libraries and Tools

| Tool/Library | Language | Notes |
|-------------|----------|-------|
| `diff` (npm) | JavaScript | Lightweight, multiple granularity modes |
| `diff-match-patch` | Multi-language | Google product, feature-rich |
| `jsdiff` | JavaScript | Browser-friendly |
| GNU diff | C | Unix standard tool |
| vimdiff | Vim | Terminal-based comparison tool |

## Performance Considerations

For very large texts (tens of thousands of lines), diff calculation can be time-consuming. Optimization strategies include:
- First filter out identical prefixes and suffixes
- Use Web Workers for background thread computation
- Process very long texts in chunks


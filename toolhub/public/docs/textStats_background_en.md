# Text Statistics - Technical Background

## Why Text Statistics Matter

Text statistics are widely used in writing, content operations, NLP preprocessing, and document review:

- **Platform limits**: Weibo caps at 140 chars, Twitter at 280, job descriptions have length guidelines
- **SEO**: Word count and paragraph structure influence search rankings
- **Translation billing**: Translation agencies charge by word or character count
- **Code review**: Evaluating the verbosity of function docs and READMEs

## Different Ways to Count Characters

### Total Characters vs. Non-Space Characters

- **Total characters**: includes spaces, newlines, tabs, and all whitespace
- **Non-space characters**: excludes all whitespace, reflecting the volume of actual content

### The Difference Between CJK and Latin Text

Chinese (and Japanese, Korean — CJK) characters are **each inherently a word**, so counting differs from Western languages:

| Language | Word delimiter | Example |
|----------|---------------|---------|
| English | Whitespace | "Hello World" = 2 words |
| Chinese | Each character is a word | "你好世界" = 4 characters (words) |

Word counting strategy used by this tool:
- English: split by whitespace — each continuous non-whitespace run is one word
- Chinese: each Han/Kana/Hangul character counts as one word

## How Reading Time Is Estimated

Reading speed varies by language and content type:

| Context | Typical speed |
|---------|--------------|
| English casual reading | ~200–250 words/min |
| Chinese casual reading | ~300–400 chars/min |
| Technical documentation | ~150–200 words/min |

This tool uses:
- English: **200 words/minute**
- Chinese (by character count): **350 chars/minute**
- Mixed text: weighted average based on proportion

Results under 1 minute display as "< 1 min"; results over 60 minutes are converted to hours.

## Word Frequency Analysis

Term Frequency (TF) counts how often each word appears — the most fundamental NLP text analysis technique, useful for:

- Extracting key terms (high-frequency words often reflect the topic)
- Spotting repetitive or redundant phrasing
- Quick content theme preview

This tool automatically filters out:
- Single letters / single characters (stop words like "the", "a", "的")
- Pure numbers
- Punctuation

## Paragraph and Sentence Counting Rules

- **Paragraphs**: separated by one or more blank lines
- **Sentences**: segments ending with `.`, `!`, `?`, `。`, `！`, or `？`


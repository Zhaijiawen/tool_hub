# Text Statistics — Why Counting Matters

Character and word counts show up in more places than you'd think. Platform limits (Twitter 280, Weibo 140), translation billing (per word or per character), SEO guidelines (minimum word counts for ranking), writing constraints (abstracts, executive summaries) — they all need accurate counts.

## Character counting: it's not just `str.length`

**Total vs. non-space —** Total characters include every space, newline, and tab. Non-space characters exclude all whitespace. For content like WeChat articles where the goal is "800-2,000 characters of meaningful content," non-space is the number you want.

**CJK vs. Latin —** Chinese, Japanese, and Korean characters are fundamentally different from Latin script. Each CJK character is a meaningful unit on its own, where English words are groups of characters delimited by spaces:

| Language | How words work | Example |
|----------|---------------|---------|
| English | Split by whitespace | "Hello World" = 2 words |
| Chinese | Each character is a unit | "你好世界" = 4 characters/words |

Our counting strategy: English words are split by whitespace. CJK characters are counted individually.

## Reading time estimation

Reading speed varies by language and content density. Our estimates:

- English: **200 words/minute** (casual reading speed)
- Chinese: **350 characters/minute**
- Mixed text: weighted average based on proportion

These are approximations. Technical documentation reads slower; social media posts read faster. Results under 1 minute show as "< 1 min"; over 60 minutes convert to hours.

## Word frequency analysis

Term frequency is the simplest NLP technique — count how often each word appears. It's useful for identifying key themes, spotting overused words, and getting a quick sense of what a text is about.

The tool filters out single letters/characters, numbers, and punctuation automatically. The top 20 words are displayed, ranked by frequency.

## Paragraphs and sentences

- **Paragraphs:** separated by one or more blank lines
- **Sentences:** segments ending with `.` `!` `?` or their CJK equivalents `。` `！` `？`

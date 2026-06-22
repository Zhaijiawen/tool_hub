# Text Statistics — Examples

## English article

**Input:**
```
The quick brown fox jumps over the lazy dog.
This is a sample sentence to demonstrate word counting.

Paragraph two starts here. It contains multiple sentences.
Each sentence ends with appropriate punctuation.
```

**Expected results:**

| Metric | Value |
|--------|-------|
| Total characters | ~175 |
| Word count | ~33 |
| Lines | 5 |
| Paragraphs | 2 |
| Sentences | 4 |
| Reading time | < 1 min |

## Chinese article

**Input:**
```
人工智能正在深刻改变我们的生活方式。从智能手机的语音助手，到医疗影像的辅助诊断，AI技术已经渗透到各个领域。

然而，技术的快速发展也带来了新的挑战。数据隐私、算法偏见、就业替代等问题值得我们深思。
```

**Expected results:**

| Metric | Value |
|--------|-------|
| Total characters | ~115 |
| CJK character count | ~100 |
| Paragraphs | 2 |
| Sentences | 4 |
| Reading time | < 1 min |

## Mixed Chinese-English

**Input:**
```
React 18 introduced concurrent features，Vue 3 的 Composition API 也越来越流行。
选择框架时，需要考虑团队技术栈和学习曲线。
The ultimate goal is delivering a great User Experience.
```

The tool counts Chinese characters and English words separately, then computes a weighted reading time.

## Word frequency example

Running a technical blog post about React through the analyzer might show:

| Rank | Word | Count |
|------|------|-------|
| 1 | component | 12 |
| 2 | React | 9 |
| 3 | state | 8 |
| 4 | render | 7 |
| 5 | hook | 6 |

If "component" appears 12 times and the next word is at 9, consider varying your terminology — "element," "widget," "view" depending on context.

## Quick metric reference

| What you're doing | Check this metric |
|-------------------|-------------------|
| Social media post | Total characters (Twitter <= 280) |
| WeChat article | Non-space characters (800-2,000) |
| Academic abstract | Word count (usually <= 250) |
| Resume intro | Character count + word frequency |
| Translation quote | Word count or character count |
| SEO content | Word count (aim for >= 1,000) |

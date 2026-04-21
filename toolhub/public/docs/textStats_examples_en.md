# Text Statistics - Examples

## Example 1: English Article

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

---

## Example 2: Chinese Article

**Input:**

```
人工智能正在深刻改变我们的生活方式。从智能手机的语音助手，到医疗影像的辅助诊断，AI技术已经渗透到各个领域。

然而，技术的快速发展也带来了新的挑战。数据隐私、算法偏见、就业替代等问题值得我们深思。
```

**Expected results:**

| Metric | Value |
|--------|-------|
| Total characters | ~115 |
| Word count (CJK chars) | ~100 |
| Paragraphs | 2 |
| Sentences | 4 |
| Reading time | < 1 min |

---

## Example 3: Mixed Chinese-English

**Input:**

```
Today's JavaScript ecosystem is evolving fast.
React 18 introduced concurrent features，Vue 3 的 Composition API 也越来越流行。

选择框架时，需要考虑团队技术栈和学习曲线。
The ultimate goal is delivering a great User Experience.
```

**Note:**

The tool counts Chinese characters and English words separately, then calculates a weighted reading time.

---

## Example 4: Word Frequency Analysis

**Scenario:** Check if a technical blog overuses certain words

**Top frequency results might show:**

| Rank | Word | Count |
|------|------|-------|
| 1 | feature | 12 |
| 2 | user | 9 |
| 3 | system | 8 |
| 4 | data | 7 |
| 5 | optimize | 6 |

If a word appears far more than others, consider using synonyms to improve variety.

---

## Quick Reference

| Use case | Metric to check |
|----------|----------------|
| Social media post | Total characters (Twitter ≤ 280) |
| WeChat article body | Non-space characters (800–2,000) |
| Paper abstract | Word count (usually ≤ 250 words) |
| Resume intro | Character count + word freq (avoid repetition) |
| Translation quote | Word count / character count |
| SEO article check | Word count (aim for ≥ 1,000 words) |


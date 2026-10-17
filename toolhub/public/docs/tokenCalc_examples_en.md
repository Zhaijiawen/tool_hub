# AI Token Calculator — Examples

## Estimate the cost of one API call

You're about to send a 2,000-character product spec to GPT-4o and want to know if it blows the budget.

**Input:** a ~2,000 Chinese-character spec
**Action:** select GPT-4o (o200k_base)
**Output:** ~2,600 tokens; at $2.5 / 1M input, about $0.0065 (under a cent)

With the same 2,000 characters but GPT-4 Turbo (cl100k_base), the token count differs slightly — a direct demonstration that "same text, different token counts per model." Just switch the dropdown to compare.

## Keep the prompt within the context window

GPT-4o's context window is 128K tokens. You have a long technical doc to fit into a prompt.

**Action:** paste the whole doc and watch the token count. If it exceeds ~100K, summarize or split first to avoid truncation. Character / word counts are shown alongside to help you decide what to cut.

## Compare cost across models

Take the same support script and view the cost under GPT-4o-mini vs o1.

**Result:** GPT-4o-mini input is $0.15 / 1M, o1 input is $15 / 1M — a 100x gap. For high-volume, simple tasks, a mini model saves enormous cost. The tool makes that gap visible before you write any code.

## Estimate Claude usage (approximate)

**Action:** select Claude 3.5 Sonnet; an "approximate" badge appears.
**Note:** the token count is an approximation via cl100k_base — reliable in magnitude for rough budgeting, but not an exact bill.

## Budget a batch job

You need to process 10,000 user reviews, ~300 characters each, all sent to GPT-4o-mini for classification.

**Estimate:** ~400 tokens each × 10,000 = 4M tokens → about $0.6 (input). Knowing the total upfront lets you decide on rate limits or a cheaper model.

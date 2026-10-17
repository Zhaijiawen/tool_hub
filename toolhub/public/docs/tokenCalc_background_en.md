# AI Token Calculator — Technical Background

Large language models (LLMs) are not billed by characters — they are billed by **tokens**. A token is the smallest unit produced by the model's tokenizer: an English word is often split into 1-2 tokens, and Chinese is usually cut per character or per word, roughly one token per Han character. Different models use different tokenizers, so the same text yields different token counts across models.

The goal of this tool is simple: **before you write a prompt, know how many tokens it will consume and what it will cost** — and do it entirely in your browser, with no upload to any server.

## How tokenizers work

The dominant open-source algorithm is **BPE (Byte Pair Encoding)**. Starting from characters, it repeatedly merges the most frequently adjacent byte pair into a new token, up to the vocabulary limit. The mapping is fixed at training time, so tokenization of a given text is deterministic.

- **OpenAI**: GPT-3.5 / GPT-4 / 4-Turbo use `cl100k_base`; GPT-4o and newer models (including the o1 / o3 families) switch to `o200k_base` with a larger vocabulary.
- **Anthropic (Claude)** uses its own proprietary tokenizer that is not public. This tool produces an **approximation** using `cl100k_base` — correct in magnitude but not exact. The UI clearly flags this as approximate.

## Why compute locally

The BPE rank data from `tiktoken` is bundled into the page (cl100k_base ~1 MB, o200k_base ~2.2 MB) and lazy-loaded with the route. Tokenization is pure CPU work and finishes in milliseconds even for tens of thousands of characters.

- **Privacy**: your prompt never leaves the browser — ideal for sensitive text.
- **Zero latency**: no network round-trip; results appear as you type.
- **Works offline**: rank files are self-hosted with the site, no CDN dependency.

The only trade-off: opening the tool for the first time downloads ~1-3 MB of tokenizer data (cached by the browser afterward, so subsequent opens are instant).

## Cost is indicative

The prices built into the tool are **reference values** (USD per 1M tokens) from each vendor's public pricing. Prices change over time — always refer to your actual bill. The cost panel shows the estimate for treating the current text as input (prompt); to estimate completion cost, multiply by the "out" unit price shown.

## Why traditional tool sites lack this

Token billing only became mainstream in the AI era, while most "online tools" sites still focus on old needs like format conversion and crypto. AI users need to estimate prompt cost every day — a classic "mass need, traditional sites don't have it" gap.

# AI Token Calculator — Tutorial

This tool counts tokens for your text in an LLM and estimates the API cost. All computation runs locally in your browser — nothing is uploaded.

## Basic usage

1. Pick a target model from the **Model** dropdown (e.g. GPT-4o, Claude 3.5 Sonnet). Different models use different tokenizers, so the token count changes with your selection.
2. Paste or type your text / JSON / code into the input box.
3. The stats area updates **live**:
   - **Token count**: tokens the model would actually consume.
   - **Characters**: total Unicode character count.
   - **Words**: a combined count (English words, Chinese characters).
   - **Estimated cost**: based on the selected model's unit price (in = input price, out = output price reference).

## Choosing a model

- OpenAI options count exactly with the real tokenizer (cl100k_base or o200k_base).
- Anthropic (Claude) options are labeled "approximate" — Claude's tokenizer is not public, so this uses cl100k_base as an approximation: correct in magnitude but not exact.

## Copy and clear

- Click **Copy** to copy the token / character / word results to the clipboard.
- Click **Sample** to fill in a sample text and try it instantly.
- Click **Clear** to reset the input.

## Reading the cost

The `in` figure is the estimate for treating the current text as a prompt (input); `out` is the model's output unit price for reference. To estimate a full conversation, multiply the token count by the relevant unit price. Prices change — refer to your actual bill.

## Privacy

A note at the bottom always states: computation is fully local, no upload to any server. That is the core advantage over cloud-based tokenizers.

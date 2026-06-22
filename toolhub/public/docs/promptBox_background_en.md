# AI Prompt Box — What Makes a Good Prompt

A prompt is the text you feed to a large language model. It can be a one-line question or a page of detailed instructions with examples. The difference between a good prompt and a bad one is often the difference between getting exactly what you need and getting vaguely plausible nonsense.

## Why prompt quality matters

LLMs like GPT-4, Claude, and Gemini are sensitive to phrasing in ways that human readers aren't. Small changes in wording can push the output in completely different directions. A well-crafted prompt does several things at once: it constrains the topic, establishes the tone, specifies the format, and gives the model enough context to fill in the right details.

## Prompting techniques that work

**Role assignment —** Tell the model who it's supposed to be. "You are an experienced database administrator..." sets expectations about terminology, depth, and what kinds of answers are appropriate. Without a role, the model defaults to a generic helpful assistant.

**Few-shot prompting —** Show examples of what you want. If you need translations in a specific style, show two or three before asking for the next one. The model picks up the pattern.

**Chain-of-thought —** For reasoning tasks, ask the model to work step by step. "Solve this math problem by showing each step of your calculation" produces more reliable results than "What's the answer?"

**Output formatting —** Be explicit about the format you want. "Return a JSON array with 'name' and 'description' fields" or "Write in bullet points, max 3 sentences per bullet." If you don't specify, you get whatever the model defaults to.

**Context injection —** Paste relevant background information before the question. Instead of "review this pull request," paste the PR description, the relevant code, and say "here's the context, now review it."

## Prompt templates

Templates give you a reusable structure for tasks you do repeatedly. A code review template, a blog outline template, a data extraction template — fill in the variables and go. They save time and keep output quality consistent across sessions.

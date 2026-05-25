# AI Prompt Box — Technical Background

## What Is a Prompt?

In the context of generative AI and Large Language Models (LLMs), a **prompt** is the input text provided to the model that guides its response. The quality, structure, and clarity of a prompt directly determine the usefulness of the output.

## Why Prompt Engineering Matters

LLMs like GPT-4, Claude, and Gemini are highly sensitive to how instructions are phrased. A well-crafted prompt can:
- Significantly improve response accuracy
- Control the format and style of output
- Reduce hallucinations
- Tailor responses to specific audiences or contexts

## Core Prompting Techniques

### 1. Role Assignment
Tell the model to adopt a specific role or persona:
```
You are an experienced software architect. Review the following code and suggest improvements.
```

### 2. Few-Shot Prompting
Provide examples to demonstrate the desired output pattern:
```
Translate English to French:
English: Hello → French: Bonjour
English: Thank you → French: Merci
English: Good morning → French: ?
```

### 3. Chain-of-Thought (CoT)
Ask the model to reason step-by-step before answering:
```
Solve this step by step: If a train travels 60 mph for 2.5 hours, how far does it travel?
```

### 4. Output Formatting
Specify the exact output format expected:
```
List the top 5 programming languages in 2024 as a JSON array with "name" and "ranking" fields.
```

### 5. Context Injection
Provide relevant background information before the instruction:
```
Context: [paste relevant document or data here]

Based on the above context, answer the following question: ...
```

## Prompt Templates

Reusable prompt structures (templates) help maintain consistency across similar tasks:
- Code review template
- Blog post writing template
- Data extraction template
- Customer support response template


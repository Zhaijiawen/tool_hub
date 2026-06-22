# AI Prompt Box — Template Examples

## Code review

```
You are a senior software engineer with expertise in {{language}}.

Please review the following code for:
1. Bugs and potential errors
2. Performance issues
3. Security vulnerabilities
4. Code style and readability

Code:
```{{language}}
{{code}}
```

Provide specific, actionable feedback for each issue found.
```

This template works because it specifies the role, lists exactly what to look for, and asks for actionable feedback — not just "this is bad" but "here's how to fix it."

## Blog post outline

```
You are a professional technical writer. Create a detailed outline for a blog post about "{{topic}}".

Requirements:
- Target audience: {{audience}}
- Tone: {{tone}} (e.g., informative, casual, authoritative)
- Length: approximately {{word_count}} words
- Include: introduction, 3-5 main sections with subheadings, conclusion, and a call to action

Return the outline in Markdown format.
```

Good for getting structure down before you start writing. The tone parameter is particularly useful — "casual" and "authoritative" produce very different outlines from the same topic.

## SQL query generator

```
You are a database expert. Generate an optimized SQL query based on the following requirements:

Database: {{database_type}}
Table schema: {{schema}}
Requirement: {{requirement}}

Include:
- The complete SQL query
- A brief explanation of what the query does
- Any indexes that would improve performance
```

The index suggestion part is what makes this template genuinely useful — it turns a query generator into a mini query optimizer.

## Grammar and clarity improver

```
Please correct the grammar and improve the clarity of the following text. Keep the original meaning intact. Only make necessary changes.

Text: {{text}}

Output format:
- Corrected text
- List of changes made
```

Having the model list the changes it made is important — you learn what you got wrong, and you can verify the model didn't change your meaning.

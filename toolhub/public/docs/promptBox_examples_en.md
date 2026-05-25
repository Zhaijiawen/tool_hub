# AI Prompt Box — Examples

## Example 1: Code Review Prompt

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

## Example 2: Blog Post Outline Generator

```
You are a professional technical writer. Create a detailed outline for a blog post about "{{topic}}".

Requirements:
- Target audience: {{audience}}
- Tone: {{tone}} (e.g., informative, casual, authoritative)
- Length: approximately {{word_count}} words
- Include: introduction, 3-5 main sections with subheadings, conclusion, and a call-to-action

Return the outline in Markdown format.
```

## Example 3: SQL Query Generator

```
You are a database expert. Generate an optimized SQL query based on the following requirements:

Database: {{database_type}}
Table schema: {{schema}}
Requirement: {{requirement}}

Include:
- The complete SQL query
- Brief explanation of what the query does
- Any indexes that would improve performance
```

## Example 4: English Grammar Corrector

```
Please correct the grammar and improve the clarity of the following text. Keep the original meaning intact. Only make necessary changes.

Text: {{text}}

Output format:
- Corrected text
- List of changes made


# Markdown Formatter — Examples

## Example 1: Table Alignment

Hand-written table separators are often uneven — reading the source takes squinting:

```markdown
|Name|Age|City|
|-|-|-|
|Alice|25|Beijing|
|Bob|30|Shanghai|
```

After formatting, separators are padded and columns are spaced:

```markdown
| Name  | Age | City     |
| ----- | --- | -------- |
| Alice | 25  | Beijing  |
| Bob   | 30  | Shanghai |
```

Works with any number of columns — Prettier aligns them all.

## Example 2: Excess Blank Lines

Multi-author docs often accumulate erratic blank line gaps:

```markdown
# Project



## Install

Clone the repo and run:



npm install



## Configuration
```

After formatting, extra blank lines are collapsed and headings keep exactly one leading blank line:

```markdown
# Project

## Install

Clone the repo and run:

npm install

## Configuration
```

## Example 3: Code Block Breathing Room

When fenced code blocks sit flush against surrounding text, the source is hard to scan even though it renders fine. Here's a typical "cramped" Markdown snippet:

````markdown
## API Reference

Fetch the user list:
```bash
curl https://api.example.com/users
```
Response is a JSON array.
````

After formatting, blank lines are added around the code block — the source breathes:

````markdown
## API Reference

Fetch the user list:

```bash
curl https://api.example.com/users
```

Response is a JSON array.
````

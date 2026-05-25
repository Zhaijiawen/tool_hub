# Markdown Converter — Examples

## Example 1: Full Document Structure

**Markdown Input:**
```markdown
# Project Title

A short description of the project.

## Features

- Feature A
- Feature B
- Feature C

## Installation

```bash
npm install my-package
```

## Usage

See the [documentation](https://docs.example.com) for details.

> **Note**: Make sure to configure your environment first.
```

**Rendered Output:**

A structured HTML document with heading hierarchy, unordered list, code block, link, and blockquote.

---

## Example 2: Table

**Input:**
```markdown
| Name  | Role       | Department |
|-------|------------|------------|
| Alice | Engineer   | Backend    |
| Bob   | Designer   | Frontend   |
| Carol | PM         | Product    |
```

**Output:**
A styled HTML table with header row and data rows.

---

## Example 3: Task List (GFM)

**Input:**
```markdown
- [x] Design database schema
- [x] Set up CI/CD pipeline
- [ ] Write unit tests
- [ ] Deploy to production
```

**Output:**
A list with checkboxes — completed items are checked.

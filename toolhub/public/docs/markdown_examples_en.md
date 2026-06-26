# Markdown Converter — Examples

## A Real README

Drop this into the left panel to see how a typical project README renders:

````markdown
# weather-cli

> A tiny weather tool for your terminal — no API key needed for basic forecasts.

## Install

```bash
npm install -g weather-cli
```

## Usage

```bash
# Get today's forecast
weather tokyo

# 5-day forecast
weather london --days 5

# Celsius or Fahrenheit
weather berlin --units metric
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `--days` | Number of forecast days | `1` |
| `--units` | `metric` or `imperial` | `metric` |
| `--json` | Output as JSON | `false` |

## Roadmap

- [x] Current conditions
- [x] Multi-day forecast
- [ ] Hourly breakdown
- [ ] Severe weather alerts

## License

MIT — do whatever you want with it.
````

Every README element in one shot: heading hierarchy, blockquote, fenced code blocks with language tags, a GFM table, a task list, and a horizontal rule if you add one.

## Table with Alignment

```markdown
| Method | Endpoint         | Auth  | Rate Limit |
|:-------|:-----------------|:-----:|-----------:|
| GET    | /api/users       | No    | 100/min    |
| POST   | /api/users       | Yes   | 50/min     |
| DELETE | /api/users/:id   | Admin | 10/min     |
```

Notice the colons in the separator row: left of the dash for left-align, both sides for center, right of the dash for right-align. Makes API docs way more readable.

## Task List in an Issue Template

```markdown
## PR Checklist

- [ ] Tests pass locally (`npm test`)
- [ ] New tests added for changed behavior
- [ ] Docs updated (README, inline comments)
- [ ] No console.log left behind
- [ ] Reviewed by at least one teammate
```

GitHub renders these as actual checkboxes. They're clickable in the issue/PR UI too — checked items stay checked when you refresh.

## Nested Content

````markdown
## Deployment Guide

1. Build the image
   ```bash
   docker build -t myapp:latest .
   ```
2. Push to registry
   ```bash
   docker push myapp:latest
   ```
3. Verify the deployment
   - Check pod status: `kubectl get pods`
   - Tail logs: `kubectl logs -f deployment/myapp`
   - Run smoke test: `curl https://myapp.example.com/health`

> **Heads up**: Step 3 needs `kubectl` configured with the right context. Double-check with `kubectl config current-context`.
````

Fenced code blocks inside ordered lists need that extra indentation to render correctly. The blockquote at the end sits outside the list — just add a blank line first.

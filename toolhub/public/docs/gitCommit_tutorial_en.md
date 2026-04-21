# Git Commit Generator - Usage Tutorial

## Quick Start

The Git Commit Generator helps you produce Conventional Commits-compliant commit messages without memorizing the format.

## Filling in the Form

### Step 1: Select a Commit Type

Choose the type that best describes your change:

- **feat** ✨ — A new feature, API, or page
- **fix** 🐛 — A bug fix
- **docs** 📝 — Documentation or comment changes only
- **style** 💄 — Code formatting changes (spaces, indentation) with no logic change
- **refactor** ♻️ — Code refactoring that is neither a bug fix nor a feature
- **perf** ⚡️ — A performance improvement
- **test** ✅ — Adding or updating tests
- **chore** 🔧 — Build scripts, dependencies, or CI configuration changes

### Step 2: Enter Scope (optional)

The `Scope` is the module name in parentheses, indicating which part of the codebase was changed:

- `feat(auth): add SMS verification login`
- `fix(payment): correct floating-point precision`
- `refactor(user): extract user state management`

Leave it empty if the change is global or doesn't fit a specific module.

### Step 3: Write a Short Description

The `Subject` is the core of your commit message. Follow these guidelines:

- **Use imperative mood**: "add login feature" not "added login feature"
- **Keep it under 72 characters**: the tool highlights when you exceed this
- **Be specific**: describe *what* changed, not *how*

### Step 4: Add a Detailed Body (optional)

The `Body` provides context for the change — useful for complex commits:

```
Extracted user state management from individual components
into a unified Pinia store, reducing code duplication
and improving maintainability.
```

### Step 5: Flag Breaking Changes (optional)

If your change requires callers to update their code (e.g. removed endpoint, changed parameter), toggle the "Breaking Change" switch and describe:

- What changed
- How to migrate

### Step 6: Link Issues (optional)

Enter related issue numbers in the `Issues` field, e.g. `#123, #456`. The generated message will automatically append `Closes: #123, #456`.

## Copying the Commit Message

The preview updates in real time. Click:

- **Copy Full Commit**: copies the complete message including title, body, and footer
- **Copy Title Only**: copies just the first line `type(scope): subject`

## History

Every time you click "Copy Full Commit", the message is saved to the history list (up to 5 entries). Click any history item to reload it into the form.

## Best Practices

1. **One commit, one thing**: don't mix a bug fix and a new feature in the same commit
2. **Review the preview**: make sure the type and description accurately convey the intent
3. **Always document breaking changes**: helps code reviewers and release automation
4. **Keep scopes consistent**: agree on scope naming conventions with your team


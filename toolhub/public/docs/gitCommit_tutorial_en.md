# Git Commit Generator — How to Use

This tool builds valid Conventional Commits messages without you having to memorize the format. Fill in the form, copy the output, paste into `git commit -m`.

## Step by step

**Commit type —** Start by choosing what kind of change this is. The dropdown has the major types:

- **feat** — something new exists that didn't before
- **fix** — something broken now works
- **docs** — you touched README or comments, that's it
- **style** — formatting only, zero logic changed
- **refactor** — restructured code, behavior unchanged
- **perf** — made something faster
- **test** — added or updated tests
- **chore** — dependencies, build scripts, config files

**Scope (optional) —** A short label in parentheses that says which part of the codebase changed. Common patterns: `feat(auth)`, `fix(payment)`, `refactor(user)`. Agree on scope names with your team for consistency. Leave it empty for global changes.

**Subject —** The one-line summary. Use present tense, imperative mood ("add" not "added"). Keep it under 72 characters — the tool highlights when you go over. Be specific about what changed, not how you did it.

**Body (optional) —** Add context for complex changes. Why did you make this change? What alternatives did you consider? This helps reviewers and your future self.

**Breaking change toggle —** Flip this on if your change breaks existing functionality. Add a description of what broke and how to migrate.

**Issues —** Link related issues like `#123, #456`. The output automatically appends `Closes: #123, #456`.

## Copy and history

The preview panel updates as you type. "Copy Full Commit" grabs the complete message; "Copy Title Only" grabs just the first line. Each time you copy, the message gets saved to history (last 5 entries). Click a history item to reload it into the form.

## A few habits worth adopting

One commit per logical change — don't bundle a bug fix and a new feature into the same commit. Always flag breaking changes, even if you think nobody's using that endpoint. Keep scope names consistent across the team. Review the preview before committing to make sure the message says what you meant.

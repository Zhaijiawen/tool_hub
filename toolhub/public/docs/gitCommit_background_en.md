# Git Commit Generator - Technical Background

## What is Conventional Commits

Conventional Commits is a specification for adding human and machine readable meaning to commit messages. It builds on top of SemVer, describing features, fixes, and breaking changes in commit messages.

Official spec: [conventionalcommits.org](https://www.conventionalcommits.org)

## Commit Message Format

```
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### Full Example

```
feat(auth)!: add OAuth2 third-party login

Added GitHub, Google, and WeChat social login support.
Removed the SMS verification login flow.

BREAKING CHANGE: /api/sms-login endpoint is deprecated
Closes: #312
```

## Commit Types

| Type | Meaning | Version bump |
|------|---------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only | None |
| `style` | Code style (no logic change) | None |
| `refactor` | Code refactor (not a fix/feature) | None |
| `perf` | Performance improvement | Patch |
| `test` | Adding or updating tests | None |
| `chore` | Build process or tooling | None |
| `revert` | Revert a previous commit | None |
| `build` | Build system / external deps | None |
| `ci` | CI configuration changes | None |

## Breaking Changes

Two ways to mark a breaking change:

1. **Append `!` after the type**: `feat!: remove v1 API`
2. **Add `BREAKING CHANGE:` footer**: describe the change and migration path

Breaking changes trigger a **Major version** bump (e.g. 1.x.x → 2.0.0).

## Relationship with SemVer

| Commit type | Version change |
|-------------|---------------|
| `fix` | 1.0.0 → 1.0.**1** |
| `feat` | 1.0.0 → 1.**1**.0 |
| `BREAKING CHANGE` | 1.0.0 → **2**.0.0 |

## Ecosystem Tools

- **commitlint**: Validate commit messages against the spec
- **commitizen**: Interactive CLI for composing commit messages
- **standard-version / release-please**: Auto-generate CHANGELOG and version from commit history
- **semantic-release**: Fully automated version release pipeline


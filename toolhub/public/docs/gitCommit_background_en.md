# Git Commit Generator — The Convention Behind It

Conventional Commits is a spec for writing commit messages that both humans and tools can parse. The idea is simple: prefix every commit with a standardized type tag, and tools can automatically derive version bumps, generate changelogs, and enforce commit hygiene.

The official spec lives at [conventionalcommits.org](https://www.conventionalcommits.org).

## The anatomy of a commit message

```
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

A real example:

```
feat(auth)!: add OAuth2 third-party login

Added GitHub, Google, and WeChat social login support.
Removed the SMS verification login flow.

BREAKING CHANGE: /api/sms-login endpoint is deprecated
Closes: #312
```

## The type system

| Type | Meaning | Triggers version bump? |
|------|---------|----------------------|
| `feat` | New feature | Yes — minor |
| `fix` | Bug fix | Yes — patch |
| `docs` | Documentation only | No |
| `style` | Formatting, whitespace, no logic change | No |
| `refactor` | Code restructuring, not a fix or feature | No |
| `perf` | Performance improvement | Yes — patch |
| `test` | Adding or updating tests | No |
| `chore` | Build scripts, dependency updates | No |
| `revert` | Rolling back a previous commit | No |
| `build` | Build system or external dependencies | No |
| `ci` | CI configuration changes | No |

## Breaking changes

Two ways to signal them:

1. Append `!` after the type: `feat!: remove v1 API`
2. Add `BREAKING CHANGE:` in the footer with migration instructions

Either way, it triggers a major version bump (1.x.x to 2.0.0).

## How this connects to SemVer

| Commit type | Version impact |
|-------------|---------------|
| `fix` | 1.0.0 → 1.0.**1** (patch) |
| `feat` | 1.0.0 → 1.**1**.0 (minor) |
| `BREAKING CHANGE` | 1.0.0 → **2**.0.0 (major) |

## Tools in the ecosystem

- **commitlint** — validates commit messages against the spec before they land
- **commitizen** — interactive CLI that walks you through composing a compliant message
- **standard-version / release-please** — reads your commit history and auto-generates CHANGELOG.md plus bumps the version
- **semantic-release** — fully automated: on every push to main, it reads commits, determines the next version, publishes to npm, and posts a GitHub release

# Git Commit Generator - Examples

## Common Scenarios

### New Features

```
feat(user): add avatar upload

Supports JPG/PNG up to 2MB. Auto-cropped to 200×200 circle on upload.
Closes: #88
```

```
feat(api): add product search endpoint

Supports keyword, price range, and category filters with paginated results.
```

```
feat: add dark mode support
```

---

### Bug Fixes

```
fix(auth): redirect to login page when token refresh fails

The 401 interceptor was missing the case where refreshing the token
also returns a 401, leaving the user stuck on the current page.
Closes: #201
```

```
fix(order): correct discount calculation when coupon and promo are combined
```

```
fix: prevent mobile nav bar from overlapping page content
```

---

### Breaking Changes

```
feat(auth)!: remove username/password login in favour of SSO

BREAKING CHANGE: /api/login is removed. Migrate to /api/sso/callback.
Migration guide: https://wiki.example.com/sso-migration
Closes: #315
```

```
refactor(config)!: switch config format from JSON to YAML

BREAKING CHANGE: config.json is no longer supported.
Please migrate your settings to config.yaml. See MIGRATION.md.
```

---

### Refactoring

```
refactor(payment): extract payment module into standalone microservice

Decoupled payment logic from the order service into payment-service,
communicating via MQ for better service isolation.
```

```
refactor: extract shared request interceptor for unified error handling
```

---

### Docs & Tooling

```
docs(api): update product endpoint docs with missing filters description
```

```
chore(deps): upgrade axios to 1.7.2 to patch known security issue
```

```
ci: add GitHub Actions automated test workflow
```

```
test(user): add unit tests for user registration flow
```

---

## Team Convention Examples

### Frontend

```
feat(pages/home): add flash-sale banner on home page
fix(components/modal): fix modal rendering issue on iOS 16
style(components): normalize button spacing to 8px
```

### Backend

```
feat(service/order): add bulk order export
fix(dao/user): fix OOM on large-batch queries
perf(service/search): replace full-table-scan with Elasticsearch
```

### Mobile

```
feat(android/push): integrate Jiguang push SDK
fix(ios/crash): fix crash on iOS 17 cold start
chore(android): bump targetSdkVersion to 34


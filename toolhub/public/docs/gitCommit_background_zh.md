# Git Commit 生成器 — 规范背后的事

Conventional Commits 是一套提交信息规范，让提交记录既能给人看懂，也能让工具自动解析。核心思路很简单：每条提交前面加个标准化的类型标签，工具就能自动判断版本号怎么变、生成 changelog、检查提交规范。

官方规范：[conventionalcommits.org](https://www.conventionalcommits.org)

## 提交信息的结构

```
<type>[可选 scope][可选 !]: <描述>

[可选正文]

[可选脚注]
```

实际例子：

```
feat(auth)!: 支持 OAuth2 第三方登录

新增 GitHub、Google、微信三种第三方登录方式，
移除原有的短信验证码登录入口。

BREAKING CHANGE: 短信登录接口 /api/sms-login 已废弃
Closes: #312
```

## 类型说明

| 类型 | 含义 | 触发版本更新？ |
|------|------|--------------|
| `feat` | 新功能 | 是 — minor |
| `fix` | Bug 修复 | 是 — patch |
| `docs` | 只改了文档 | 否 |
| `style` | 代码格式（空格、缩进），没动逻辑 | 否 |
| `refactor` | 重构，不是修 bug 也不是新功能 | 否 |
| `perf` | 性能优化 | 是 — patch |
| `test` | 加测试或改测试 | 否 |
| `chore` | 构建脚本、依赖升级 | 否 |
| `revert` | 回退某次提交 | 否 |
| `build` | 构建系统或外部依赖 | 否 |
| `ci` | CI 配置改动 | 否 |

## 破坏性变更怎么标记

两种方式：

1. 在类型后面加 `!`：`feat!: 移除 v1 API`
2. 在脚注里写 `BREAKING CHANGE:` 并说明迁移方案

不管哪种，都会触发主版本号升级（1.x.x 到 2.0.0）。

## 和语义化版本的关系

| 提交类型 | 版本变化 |
|---------|---------|
| `fix` | 1.0.0 → 1.0.**1**（patch）|
| `feat` | 1.0.0 → 1.**1**.0（minor）|
| `BREAKING CHANGE` | 1.0.0 → **2**.0.0（major）|

## 配套工具链

- **commitlint** — 提交前检查格式是否合规
- **commitizen** — 交互式命令行工具，一步步引导你写规范提交
- **standard-version / release-please** — 读提交历史自动生成 CHANGELOG.md 并更新版本号
- **semantic-release** — 全自动：每次合到 main 分支，读提交记录、定版本号、发布到 npm、贴 GitHub release

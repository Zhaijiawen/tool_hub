# Git Commit 生成器 - 技术背景

## 什么是 Conventional Commits

Conventional Commits 是一种为提交信息添加人机可读含义的规范。它建立在 SemVer 语义化版本之上，通过提交信息描述特性、修复和破坏性变更。

官方规范：[conventionalcommits.org](https://www.conventionalcommits.org)

## 提交信息格式

```
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

### 完整示例

```
feat(auth)!: 支持 OAuth2 第三方登录

新增 GitHub、Google、微信三种第三方登录方式，
移除原有的短信验证码登录入口。

BREAKING CHANGE: 短信登录接口 /api/sms-login 已废弃
Closes: #312
```

## 提交类型（type）说明

| Type | 含义 | 是否触发版本更新 |
|------|------|----------------|
| `feat` | 新功能 | Minor 版本 |
| `fix` | Bug 修复 | Patch 版本 |
| `docs` | 文档变更 | 不触发 |
| `style` | 代码格式（不影响逻辑） | 不触发 |
| `refactor` | 重构（非 Bug 修复/新功能） | 不触发 |
| `perf` | 性能优化 | Patch 版本 |
| `test` | 添加或修改测试 | 不触发 |
| `chore` | 构建/辅助工具变更 | 不触发 |
| `revert` | 回退某次提交 | 不触发 |
| `build` | 构建系统或外部依赖 | 不触发 |
| `ci` | CI 配置文件变更 | 不触发 |

## 破坏性变更（BREAKING CHANGE）

有两种方式标记破坏性变更：

1. **在 type 后加 `!`**：`feat!: 移除 v1 API`
2. **在 footer 中写 `BREAKING CHANGE:`**：描述具体的变更内容和迁移方案

破坏性变更会触发 **Major 版本**号更新（如 1.x.x → 2.0.0）。

## 与 SemVer 的关系

| 提交类型 | 版本变化 |
|---------|---------|
| `fix` | 1.0.0 → 1.0.**1** |
| `feat` | 1.0.0 → 1.**1**.0 |
| `BREAKING CHANGE` | 1.0.0 → **2**.0.0 |

## 配合工具链

- **commitlint**：提交前校验格式是否符合规范
- **commitizen**：交互式命令行生成提交信息
- **standard-version / release-please**：根据提交历史自动生成 CHANGELOG 和版本号
- **semantic-release**：全自动化版本发布流水线


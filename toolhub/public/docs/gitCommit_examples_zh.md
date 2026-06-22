# Git Commit 生成器 — 提交示例

## 新功能

```
feat(user): 新增头像上传功能

支持 JPG/PNG 格式，最大 2MB，上传后自动裁剪为 200x200 圆形。
Closes: #88
```

```
feat(api): 新增商品搜索接口

支持关键词、价格区间、分类等多维度过滤，返回分页结果。
```

```
feat: 新增暗色模式支持
```

最后这条没加 scope——改动涉及全局，限定到某个模块反而误导。

## Bug 修复

```
fix(auth): 修复 token 过期后未跳转登录页的问题

401 响应拦截器中漏判了刷新 token 失败的场景，
导致用户停留在当前页面无法操作。
Closes: #201
```

```
fix(order): 修复优惠券与满减不能同时使用的计算错误
```

```
fix: 修复移动端导航栏遮挡内容的问题
```

注意第一条的 body——bug 需要解释的时候就写清楚原因，几个月后你自己（或者值班的人）会感谢现在的你。

## 破坏性变更

```
feat(auth)!: 移除用户名密码登录，改为统一 SSO

BREAKING CHANGE: /api/login 接口已下线，请迁移至 /api/sso/callback
迁移指南：https://wiki.example.com/sso-migration
Closes: #315
```

```
refactor(config)!: 配置文件格式从 JSON 改为 YAML

BREAKING CHANGE: 原 config.json 不再支持，请将配置迁移到 config.yaml
详见 MIGRATION.md
```

footer 里的迁移指南链接很重要——光说坏了不行，还得说明怎么修。

## 重构

```
refactor(payment): 将支付模块拆分为独立微服务

将原来耦合在订单服务中的支付逻辑独立为 payment-service，
通过 MQ 进行异步通信，降低了服务间耦合度。
```

```
refactor: 提取公共请求拦截器，统一处理错误码
```

## 文档与工具

```
docs(api): 更新商品接口文档，补充 filters 参数说明
```

```
chore(deps): 升级 axios 至 1.7.2，修复已知安全漏洞
```

```
ci: 新增 GitHub Actions 自动化测试工作流
```

```
test(user): 补充用户注册流程的单元测试
```

## 团队提交规范示例

### 前端

```
feat(pages/home): 首页新增限时活动 Banner
fix(components/modal): 修复弹窗在 iOS 16 下显示异常
style(components): 统一按钮组件间距为 8px
```

### 后端

```
feat(service/order): 新增订单批量导出功能
fix(dao/user): 修复大批量查询时内存溢出问题
perf(service/search): 引入 Elasticsearch 替换全表扫描
```

### 移动端

```
feat(android/push): 接入极光推送 SDK
fix(ios/crash): 修复 iOS 17 启动崩溃
chore(android): 升级 targetSdkVersion 至 34
```

这里的 scope 命名统一用了 `平台/功能` 或 `层级/模块` 的格式——选一套匹配你仓库结构的方案然后全团队用下去。

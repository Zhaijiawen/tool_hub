# Markdown 转换器 — 使用示例

## 一份真实 README

把下面的内容粘贴到左边面板，看看典型的项目 README 渲染出来什么样：

```markdown
# weather-cli

> 终端里的天气预报小工具——基础预报无需 API Key。

## 安装

```bash
npm install -g weather-cli
```

## 用法

```bash
# 查询今日天气
weather tokyo

# 未来五天预报
weather london --days 5

# 摄氏度或华氏度
weather berlin --units metric
```

## 参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `--days` | 预报天数 | `1` |
| `--units` | `metric` 或 `imperial` | `metric` |
| `--json` | 输出 JSON 格式 | `false` |

## 路线图

- [x] 当前天气
- [x] 多日预报
- [ ] 逐小时预报
- [ ] 恶劣天气预警

## 许可证

MIT — 随意使用。
```

一个示例覆盖了 README 的常见元素：标题层级、引用块、带语言标签的围栏代码块、GFM 表格、任务列表。

## 表格对齐

```markdown
| 方法   | 接口             | 鉴权  | 频率限制 |
|:-------|:-----------------|:-----:|---------:|
| GET    | /api/users       | 否    | 100/分钟 |
| POST   | /api/users       | 需要  | 50/分钟  |
| DELETE | /api/users/:id   | 管理员 | 10/分钟  |
```

注意分隔行里的冒号：冒号在破折号左边是左对齐，两边都有是居中，只在右边是右对齐。写 API 文档的时候特别实用。

## 任务列表 — Issue 模板

```markdown
## PR 检查清单

- [ ] 本地测试通过（`npm test`）
- [ ] 新增行为有对应测试
- [ ] 文档已更新（README、行内注释）
- [ ] 没留 console.log
- [ ] 至少一位同事 Review 过
```

GitHub 会把这些渲染成实实在在的复选框。在 Issue/PR 页面上直接点击就能切换状态，刷新也不会丢。

## 嵌套内容

```markdown
## 部署指南

1. 构建镜像
   ```bash
   docker build -t myapp:latest .
   ```
2. 推送到仓库
   ```bash
   docker push myapp:latest
   ```
3. 验证部署
   - 检查 Pod 状态：`kubectl get pods`
   - 查看日志：`kubectl logs -f deployment/myapp`
   - 冒烟测试：`curl https://myapp.example.com/health`

> **注意**：第三步需要 `kubectl` 配置正确的 context。先跑 `kubectl config current-context` 确认一下。
```

有序列表里嵌套围栏代码块需要额外缩进——少了渲染会乱。最后的引用块在列表外面，前面加个空行就行。

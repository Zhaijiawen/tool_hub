# 脚本工具箱 — 使用教程

## 第一步：新建脚本

点击左侧「**+ 新建脚本**」按钮，填写名称和分类（如 JSON、文本、加密等），点击保存后系统会自动创建一个带有默认模板的脚本。

> ⚠️ 脚本保存在浏览器本地存储中，建议使用「导出脚本集」定期备份。

## 第二步：编写 transform 函数

脚本代码**必须包含一个名为 `transform` 的函数**，接收两个参数：

- `input` — 右侧输入框中的内容（字符串）
- `helpers` — 内置工具库对象（见「可用 helpers」列表）

函数的返回值会自动显示在输出区：

```javascript
async function transform(input, helpers) {
  // input 是左侧输入框的内容
  // helpers 是内置工具库
  return input.trim().toUpperCase()
}
```

支持 `async/await`，可以使用 `fetch` 发起网络请求。

## 第三步：输入数据并运行

在右侧**输入数据**框中粘贴你要处理的内容（JSON、文本、时间戳等皆可），然后点击「**▶ 运行**」按钮。

- 执行成功：输出区显示结果，顶部显示耗时（毫秒）
- 执行失败：输出区以红色显示完整错误信息和 stack trace

## 第四步：复制输出

运行成功后，点击「**复制**」按钮即可将输出内容写入剪贴板。

## 脚本管理

| 操作 | 说明 |
|---|---|
| 左侧列表点击 | 切换当前脚本 |
| 工具栏「编辑」| 修改脚本名称、分类、简介 |
| 工具栏「删除」| 删除当前脚本（不可恢复） |
| 导出脚本集 | 将所有脚本导出为 `.toolhub.json` 文件 |
| 导入脚本集 | 从 `.toolhub.json` 导入脚本（不覆盖已有） |

## 常用技巧

**调试技巧：** 在 `transform` 函数里可以使用 `console.log`（打开浏览器开发者工具查看），或者把中间结果作为返回值来检查。

**多输出：** 返回一个对象，工具会自动格式化为 JSON 展示：

```javascript
async function transform(input, helpers) {
  return {
    original: input,
    upper: input.toUpperCase(),
    length: input.length,
    words: input.split(/\s+/).length
  }
}
```

**链式使用：** 可以在一个脚本里用多个 helpers 进行流水线处理：

```javascript
async function transform(input, helpers) {
  // 1. 解析 YAML
  const obj = helpers.yaml.load(input)
  // 2. 用 lodash 做字段提取
  const names = helpers._.map(obj.users, 'name')
  // 3. 用 dayjs 格式化日期
  return names.map(n => `${n} — ${helpers.dayjs().format('YYYY-MM-DD')}`)
}


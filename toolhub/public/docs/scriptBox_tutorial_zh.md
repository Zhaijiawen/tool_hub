# 脚本工具箱 — 怎么用

## 新建脚本

点左侧「+ 新建脚本」，填名称和分类，保存。工具会创建一个带默认模板的新脚本。脚本存浏览器 localStorage 里，定期导出备份。

## 写 transform 函数

代码里必须有一个叫 `transform` 的函数，接收两个参数：

- `input` — 输入框里的内容（总是字符串）
- `helpers` — helper 库对象（工具里的「可用 helpers」面板列了所有库）

返回什么就在输出区显示什么：

```javascript
async function transform(input, helpers) {
  // input 是输入框的内容
  // helpers 是所有内置库
  return input.trim().toUpperCase()
}
```

`async/await` 完全支持，可以做网络请求和加密操作。

## 运行脚本

把数据贴到右侧**输入数据**框（JSON、纯文本、时间戳都行），点**运行**。成功的话输出区显示结果，顶部工具栏显示耗时（毫秒）。失败的话输出区变红，显示完整错误信息和 stack trace。

点**复制**把输出写入剪贴板。

## 脚本管理

| 操作 | 说明 |
|------|------|
| 左侧列表点击 | 切换当前脚本 |
| 工具栏「编辑」| 改名称、分类、简介 |
| 工具栏「删除」| 删除脚本（不可恢复）|
| 导出脚本集 | 存为 `.toolhub.json` 文件 |
| 导入脚本集 | 从 `.toolhub.json` 导入（追加，不覆盖）|

## 技巧

**调试：** 在函数里用 `console.log`，输出在浏览器 DevTools 里看。或者直接把中间结果当返回值来检查。

**返回对象来展示多个输出：**

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

**链式用多个 helpers 做流水线处理：**

```javascript
async function transform(input, helpers) {
  const obj = helpers.yaml.load(input)       // 1. 解析 YAML
  const names = helpers._.map(obj.users, 'name')  // 2. lodash 提取
  return names.map(n => `${n} — ${helpers.dayjs().format('YYYY-MM-DD')}`)  // 3. 格式化日期
}
```

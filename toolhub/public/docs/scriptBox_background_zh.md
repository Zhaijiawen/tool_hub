# 脚本工具箱 — 技术背景

## 什么是脚本工具箱？

脚本工具箱允许你用 JavaScript 编写任意数据转换逻辑，在浏览器中即时运行并查看结果。你只需要定义一个名为 `transform` 的函数，工具会自动把左侧输入框中的内容作为 `input` 参数传入，然后将返回值展示在输出区。

整个执行过程**完全在本地浏览器中完成**，无需服务器，你的数据不会离开设备。

## 执行机制

工具使用浏览器原生的 `new Function()` API 动态执行你写的代码，并自动 `await` 你的函数，因此支持同步和 `async/await` 两种写法。

```javascript
// 同步
function transform(input, helpers) {
  return input.trim().toUpperCase()
}

// 异步（支持 fetch、Web Crypto 等）
async function transform(input, helpers) {
  const res = await fetch('https://api.example.com?q=' + input)
  return await res.json()
}
```

## 内置 helpers 原理

为了让你能直接使用常用的第三方库而无需手动 `import`，工具在首次运行时会懒加载一批预定义的库，并通过 `helpers` 参数注入到你的函数中。

| 库 | 注入名称 | 用途 |
|---|---|---|
| dayjs | `helpers.dayjs` | 时间格式化、计算 |
| lodash-es | `helpers._` | 数组/对象操作 |
| CryptoJS | `helpers.CryptoJS` | MD5、AES、SHA、HMAC |
| js-yaml | `helpers.yaml` | YAML 解析与序列化 |
| mathjs | `helpers.math` | 精确数学计算 |
| diff | `helpers.diff` | 文本 diff 对比 |
| marked | `helpers.marked` | Markdown 转 HTML |
| DOMPurify | `helpers.DOMPurify` | XSS 过滤 |
| fast-xml-parser | `helpers.xmlParser / xmlBuilder` | XML 解析与构建 |
| spark-md5 | `helpers.sparkMD5` | 大文件 MD5 |

此外，以下内容无需任何导入即可直接使用：

- **`fetch`** — 发起 HTTP 请求
- **`crypto.subtle`** — Web Crypto API（SHA/AES 原生加密）
- **`JSON`、`btoa`、`atob`** — 浏览器内建
- **`helpers.TextEncoder / TextDecoder`** — 二进制与字符串转换

## 数据持久化

所有脚本以 JSON 格式保存在浏览器的 `localStorage` 中。清除浏览器数据可能导致脚本丢失，建议定期使用「导出脚本集」功能备份。


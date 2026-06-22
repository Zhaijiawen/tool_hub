# 脚本工具箱 — 幕后是怎么跑的

脚本工具箱让你用 JavaScript 写任意数据转换逻辑，在浏览器里即时运行。你定义一个叫 `transform` 的函数，工具把输入数据和一组建好的 helper 库传进去，返回值直接显示在输出面板。全程在本地浏览器跑——不走服务器，不上传任何数据。

## 执行机制

工具用浏览器原生的 `new Function()` API 动态执行你的代码，自动 `await` 你的函数，同步和异步写法都支持：

```javascript
// 同步 —— 直接
function transform(input, helpers) {
  return input.trim().toUpperCase()
}

// 异步 —— fetch、Web Crypto 随便用
async function transform(input, helpers) {
  const res = await fetch('https://api.example.com?q=' + input)
  return await res.json()
}
```

## helpers 系统

为了让你不用手动 `import` 就能用常用库，工具在首次运行时懒加载一批预定义的包，通过 `helpers` 参数注入：

| 库 | 注入名 | 干什么的 |
|---|--------|---------|
| dayjs | `helpers.dayjs` | 日期格式化、计算 |
| lodash-es | `helpers._` | 数组/对象操作 |
| CryptoJS | `helpers.CryptoJS` | MD5、AES、SHA、HMAC |
| js-yaml | `helpers.yaml` | YAML 解析与序列化 |
| mathjs | `helpers.math` | 精确数学计算 |
| diff | `helpers.diff` | 文本 diff 对比 |
| marked | `helpers.marked` | Markdown 转 HTML |
| DOMPurify | `helpers.DOMPurify` | XSS 过滤 |
| fast-xml-parser | `helpers.xmlParser / xmlBuilder` | XML 解析与构建 |
| spark-md5 | `helpers.sparkMD5` | 大文件 MD5 哈希 |

以下全局可用，无需任何导入：

- `fetch` — HTTP 请求
- `crypto.subtle` — Web Crypto API（原生 SHA、AES）
- `JSON`、`btoa`、`atob` — 浏览器内置
- `helpers.TextEncoder / TextDecoder` — 二进制与字符串互转

## 数据持久化

脚本以 JSON 格式存在 `localStorage` 里。清浏览器数据脚本就没了——用「导出脚本集」按钮定期备份为 `.toolhub.json` 文件。

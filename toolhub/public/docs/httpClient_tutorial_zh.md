# HTTP 请求测试 — 使用教程

## 发送第一个请求

### 第一步：填写请求地址

在 URL 输入框中填入完整地址，例如：
```
https://httpbin.org/get
```
如果未填写协议，工具会自动补充 `https://`。

### 第二步：选择请求方法

默认为 `GET`，可按需选择 `POST`、`PUT`、`PATCH`、`DELETE`、`HEAD`、`OPTIONS`。

### 第三步：按需配置请求参数

**Params 标签页（Query 参数）**
- 点击「+ 添加参数」新增键值对
- 勾选框控制是否启用该参数
- 参数会自动拼接到 URL 末尾

**Headers 标签页**
- 默认预填 `Accept: application/json`
- 可添加自定义请求头，如 `Authorization: Bearer xxx`

**Body 标签页**（GET/HEAD 方法禁用）
- `None`：无请求体
- `JSON`：自动添加 `Content-Type: application/json`
- `Form`：自动添加 `Content-Type: application/x-www-form-urlencoded`
- `Text`：纯文本

### 第四步：发送请求

点击「发送」按钮，等待响应返回。

## 查看响应结果

- **状态栏**：状态码（绿色=成功，橙色=4xx，红色=5xx）、耗时、响应体大小
- **Body 标签页**：响应内容，JSON 自动格式化
- **响应头标签页**：服务端返回的所有响应头

## CORS 问题处理

若出现 CORS 错误提示，可以：
1. 使用支持 CORS 的开放 API（如 `https://httpbin.org`）进行测试
2. 在接口服务端配置 `Access-Control-Allow-Origin: *`
3. 使用 Postman、curl 等工具（不受 CORS 限制）

## 注意事项

- 最后一次请求配置会自动保存，下次打开时自动恢复
- 请求在浏览器中直接发出，不经过服务器中转，保护隐私


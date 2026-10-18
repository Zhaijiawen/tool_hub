# JWT 编解码 — 使用指南

本地解析和构造 JWT 令牌。粘贴一个令牌看内容，或填入数据与密钥生成新令牌。

## 解码：看令牌里有什么

1. 把 JWT 粘贴进输入框（形如 `xxxxx.yyyyy.zzzzz` 的三段文本）
2. 点「解码」
3. header 和 payload 的 JSON 内容显示在输出区

解码不验证签名——它只是把 Base64URL 还原成 JSON。想看签名对不对，继续填 secret。

## 编码：生成令牌

1. 输入 payload 的 JSON（比如 `{"sub":"1234","exp":1719000000}`）
2. 填入 secret
3. 点「编码」，得到签名后的完整令牌

header 由工具自动生成（默认 HS256）。secret 用于 HMAC-SHA256 签名。

## 验签

拿一个已有令牌 + 对应 secret 重新编码，比对签名段是否一致——一致说明令牌未被改动且 secret 正确。这是调试「为什么服务端说 token 无效」最快的路径：先解出来的 payload 对不对，再验证签名。

## 常见错误

**「无效的 JWT 格式」**：输入不是三段点分结构。检查有没有漏贴、有没有把Bearer 前缀带进来（去掉 `Bearer ` 再贴）。

**「JSON 解析错误」**：payload 不是合法 JSON。逗号、引号、括号查一遍。

**「请输入密钥」**：编码必须填 secret，解码不填也能看内容。

## 调试 checklist

- 服务端拒收 → 先在本工具解码，确认 payload 的 claims 是想要的
- `exp` 是 Unix 时间戳（秒），不是日期字符串
- 不同服务的 secret 不同，串用会导致验签失败
- payload 改任何一个字节，签名都会变——包括 Base64 的 padding

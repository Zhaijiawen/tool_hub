# JWT 编解码 — 技术原理

JWT（JSON Web Token，RFC 7519）是一串三段式 Base64URL 文本，用点号连接：

```
header.payload.signature
```

**header** — 声明令牌类型和签名算法，典型如 `{"alg":"HS256","typ":"JWT"}`。
**payload** — 实际数据（claims）：`sub`（主体）、`exp`（过期时间）、`iat`（签发时间）以及自定义字段。
**signature** — 对前两段的签名，防止篡改。

## 签名怎么算

以最常见的 HS256（HMAC-SHA256）为例：

```
signature = HMAC-SHA256(
  base64url(header) + "." + base64url(payload),
  secret
)
```

服务端用同一个 secret 重算签名并比对。对 payload 的任何改动（比如把 `exp` 往后改）都会让签名对不上——**前提是 secret 没泄露**。

## 常见误区

**「JWT 是加密的，别人看不到内容」**——错。Base64URL 是编码不是加密，任何人都能解出 payload。JWT 里永远不要放密码、密钥这类敏感数据。需要保密载荷用 JWE。

**「带上签名就是安全的」**——签名只防篡改，不防伪造。拿到 secret 的人可以签任意令牌；用弱 secret 也一样（暴力可破）。生产上用足够长的随机 secret，或者换非对称算法（RS256/ES256：私钥签、公钥验）。

**「alg: none 也能用」**——某些老库接受 `alg` 为 `none` 的无签名令牌，这是著名漏洞源。服务端必须校验 alg 并拒绝 none。

**「exp 到了 token 就废了」**——exp 是 payload 里的一个声明，验不验证全看服务端自觉。客户端「解码」看到 exp 过期不代表服务端会拒。

## 本工具做什么

本地完成 Base64URL 的编解码与 HMAC-SHA256 签名/验签：粘贴令牌可解出 header 和 payload 的 JSON；填入 secret 可重新计算签名并比对。所有计算在浏览器内完成，secret 不会离开你的设备——但也要意识到，把生产 secret 贴进任何第三方工具都有风险，测试令牌请用专用 secret。

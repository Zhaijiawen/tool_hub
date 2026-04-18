# SSL 证书解析 — 技术背景

## 什么是 SSL/TLS 证书？

SSL/TLS 证书是一种数字证书，用于在网络通信中证明服务器（或客户端）的身份，并建立加密连接。它是 HTTPS 的基础。

现代证书遵循 **X.509** 标准，由受信任的 **证书颁发机构（CA，Certificate Authority）** 签发。

## 证书的核心字段

| 字段 | 说明 |
|------|------|
| Subject | 证书所有者，如 `CN=example.com` |
| Issuer | 颁发机构，如 `Let's Encrypt` |
| Serial Number | 证书唯一序列号，由 CA 分配 |
| Valid From / To | 证书有效期 |
| SAN | 主体替代名称，列出证书覆盖的所有域名/IP |
| Key Usage | 证书的允许用途（如数字签名、密钥加密） |
| Extended Key Usage | 扩展用途（如 TLS Web Server Auth） |

## 什么是 SAN？

SAN（Subject Alternative Names）是现代证书的核心扩展，用来替代早期的 `CN` 字段。一张证书可以在 SAN 中包含多个域名，例如：

```
DNS: example.com
DNS: www.example.com
DNS: api.example.com
```

通配符证书使用 `*.example.com` 覆盖所有子域名（仅一级）。

## 证书指纹

指纹（Fingerprint/Thumbprint）是对证书完整 DER 编码进行哈希计算的结果：

- **SHA-1**：40 位十六进制，已逐渐被弃用，但仍广泛用于识别证书
- **SHA-256**：64 位十六进制，现代标准，用于证书锁定（Certificate Pinning）

## PEM 格式

PEM（Privacy Enhanced Mail）是最常见的证书文本格式：

```
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
...（Base64 编码的 DER 数据）...
-----END CERTIFICATE-----
```

## 证书透明度（CT）日志

所有公开信任的证书都必须提交到 **证书透明度（Certificate Transparency）** 日志，可通过 [crt.sh](https://crt.sh) 查询任意域名的证书记录。


# SSL 证书解析 — 聊聊背后的技术

你在浏览器地址栏看到的小锁图标，背后就是 SSL/TLS 证书在起作用。它干两件事：证明「这个服务器确实是它声称的那个」，然后建立加密通道防窃听。现在所有证书都走 X.509 标准，由 CA（证书颁发机构，比如 Let's Encrypt、DigiCert）签发。

## 证书里有哪些关键字段

把 PEM 格式的证书贴进工具后，主要看这些：

- **Subject（主题）** — 证书属于谁，通常写成 `CN=example.com`
- **Issuer（颁发者）** — 哪个 CA 签发的，比如 "Let's Encrypt Authority X3"
- **Serial Number（序列号）** — CA 分配的唯一编号，查吊销时有用
- **Valid From / To（有效期）** — 浏览器信任这个证书的时间窗口，过了就红锁
- **SAN（Subject Alternative Names，主体备选名称）** — 证书覆盖的域名和 IP 列表，这才是真正起作用的字段。老的 `CN` 基本被淘汰了，现代浏览器只看 SAN
- **Key Usage / Extended Key Usage** — 限制证书用途（签名、加密、TLS 服务器认证等）

## 聊聊 SAN

一张证书可以通过 SAN 覆盖多个域名，大概是这样的：

```
DNS: example.com
DNS: www.example.com
DNS: api.example.com
```

泛域名证书用 `*.example.com` 覆盖所有一级子域名。注意只覆盖一级，`*.example.com` 能匹配 `api.example.com`，但 `v2.api.example.com` 不行。

## 证书指纹

指纹就是对完整 DER 编码的证书做个哈希：

- **SHA-1**：40 位十六进制。已经在淘汰中，但证书管理界面还在用它当标识符，安全验证没人用它了
- **SHA-256**：64 位十六进制。做证书锁定（Certificate Pinning）时对的就是这个指纹

## PEM 格式

PEM 是最常见的证书文本格式，在 base64 编码的 DER 数据外面包了头尾标记：

```
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIR...（base64 编码的 DER 数据）...
-----END CERTIFICATE-----
```

一个文件里可以串多个块，比如服务器可以先发自己的证书，再接中间 CA 证书，全放一个文件。

## 证书透明度（CT）

大概从 2018 年开始，所有公开信任的证书都必须提交到 CT 日志。这意味着你可以通过 [crt.sh](https://crt.sh) 查任意域名的证书记录——包括已经过期和吊销的。我们工具的域名查询模式就是利用这些日志来拉取域名最新的证书。

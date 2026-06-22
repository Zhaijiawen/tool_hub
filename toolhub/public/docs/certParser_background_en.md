# SSL Certificate Parser — What's Under the Hood

SSL/TLS certificates are the reason you see that little padlock in your browser's address bar. They do two things: prove a server is who it says it is, and kick off an encrypted session so nobody can snoop on what you're doing. Every certificate follows the X.509 standard and is issued by a Certificate Authority (CA) — think Let's Encrypt, DigiCert, or Sectigo.

## The fields that actually matter

When you paste a PEM certificate into this tool, here's what you're looking at:

- **Subject** — who owns the cert, typically a `CN=example.com` style name
- **Issuer** — which CA signed it, e.g. "Let's Encrypt Authority X3"
- **Serial Number** — a unique ID the CA assigns, useful for revocation checks
- **Valid From / To** — the date window during which browsers will trust it
- **SAN (Subject Alternative Names)** — the list of domains and IPs this cert covers. This is what you really care about. The old `CN` field is basically deprecated; modern browsers only look at SAN
- **Key Usage / Extended Key Usage** — constraints on what the cert can be used for (signing, encryption, TLS server auth, etc.)

## SAN: the field that replaced CN

A single cert can cover multiple domains through SAN entries. You'll see stuff like:

```
DNS: example.com
DNS: www.example.com
DNS: api.example.com
```

Wildcard certs use `*.example.com` to match any direct subdomain — but only one level deep. `*.example.com` covers `api.example.com` but not `v2.api.example.com`.

## Certificate fingerprints

A fingerprint is just a hash of the full DER-encoded certificate. There are two variants you'll encounter:

- **SHA-1**: 40 hex chars. Being phased out everywhere, but still shows up in certificate management UIs as an identifier — not for actual security validation
- **SHA-256**: 64 hex chars. This is what certificate pinning uses. If you're building a mobile app that pins certs, you're comparing SHA-256 fingerprints

## PEM format — what you actually paste

PEM is the text-encoded format you'll see everywhere. It wraps base64-encoded DER data between header and footer lines:

```
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIR...（base64 DER data）...
-----END CERTIFICATE-----
```

You can chain multiple blocks — a server might send its own cert followed by intermediate CA certs, all in one PEM file.

## Certificate Transparency

Since 2018 or so, every publicly trusted certificate has to be logged to Certificate Transparency (CT) logs. This means you can look up any domain's certificate history — including expired and revoked certs — at [crt.sh](https://crt.sh). Our domain lookup mode uses these logs to pull the latest cert for any domain.

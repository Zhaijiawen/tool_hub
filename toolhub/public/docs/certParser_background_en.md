# SSL Certificate Parser — Technical Background

## What Is an SSL/TLS Certificate?

An SSL/TLS certificate is a digital certificate that proves the identity of a server (or client) and establishes an encrypted connection. It is the foundation of HTTPS.

Modern certificates follow the **X.509** standard and are issued by trusted **Certificate Authorities (CAs)**.

## Key Certificate Fields

| Field | Description |
|-------|-------------|
| Subject | Certificate owner, e.g. `CN=example.com` |
| Issuer | Issuing authority, e.g. Let's Encrypt |
| Serial Number | Unique certificate ID assigned by the CA |
| Valid From / To | Certificate validity period |
| SAN | Subject Alternative Names — lists all covered domains/IPs |
| Key Usage | Permitted uses (e.g. Digital Signature, Key Encipherment) |
| Extended Key Usage | Extended uses (e.g. TLS Web Server Authentication) |

## What Is SAN?

SAN (Subject Alternative Names) is the modern X.509 extension that replaces the legacy `CN` field. A single certificate can cover multiple domains, for example:

```
DNS: example.com
DNS: www.example.com
DNS: api.example.com
```

Wildcard certificates use `*.example.com` to cover all direct subdomains (one level only).

## Certificate Fingerprints

A fingerprint (thumbprint) is a hash of the full DER-encoded certificate:

- **SHA-1**: 40-character hex digest; being phased out but still widely used for identification
- **SHA-256**: 64-character hex digest; the modern standard, used for certificate pinning

## PEM Format

PEM (Privacy Enhanced Mail) is the most common text-encoded certificate format:

```
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIR...（Base64-encoded DER data）...
-----END CERTIFICATE-----
```

## Certificate Transparency (CT) Logs

All publicly trusted certificates must be submitted to **Certificate Transparency** logs. You can search any domain's certificate history at [crt.sh](https://crt.sh).


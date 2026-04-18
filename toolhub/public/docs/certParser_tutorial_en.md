# SSL Certificate Parser — Tutorial

## Mode 1: Paste a PEM Certificate

### Getting the Certificate

**Method 1: Browser**
1. Click the lock icon in the address bar → "Connection is secure" → "Certificate details"
2. Find the "Export" or "Copy PEM" option in the certificate dialog

**Method 2: Command line (openssl)**
```bash
openssl s_client -connect example.com:443 -showcerts 2>/dev/null \
  | openssl x509 -outform PEM
```

**Method 3: Download a .pem / .crt file**
Open the file in a text editor — it starts with `-----BEGIN CERTIFICATE-----`.

### Paste and Parse

1. Paste the PEM content into the text area
2. The tool auto-detects the certificate and starts parsing (or click "Parse Certificate" manually)
3. Review the structured results

---

## Mode 2: Domain Lookup

1. Switch to the "Domain Lookup" tab
2. Enter a domain name (e.g. `github.com` — no need for `https://`)
3. Click "Fetch"
4. The tool fetches the latest certificate via crt.sh CT logs and parses it automatically

> **Note**: This mode requires network access and retrieves publicly-logged certificate records via crt.sh.

---

## Reading the Results

| Field | What to Check |
|-------|--------------|
| Subject | Main identity, especially the `CN` value |
| Issuer | CA name, e.g. Let's Encrypt, DigiCert |
| Serial Number | Unique ID, useful for revocation checks |
| Validity | Red = expired, Orange = expiring ≤ 30 days, Green = valid |
| SAN | Confirm that your target domain is listed |
| SHA-256 Fingerprint | Compare with the browser's displayed fingerprint for pinning |

---

## Expiry Status Banner

The banner at the top shows:
- 🔴 **Certificate has expired**
- 🟡 **Certificate expires soon (N days remaining)** — shown when ≤ 30 days
- 🟢 **Certificate is valid (N days remaining)**


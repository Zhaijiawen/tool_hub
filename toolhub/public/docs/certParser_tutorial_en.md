# SSL Certificate Parser — How to Use It

The tool has two modes: paste a PEM certificate directly, or punch in a domain name and let it fetch the cert for you.

## Mode 1: Paste a PEM certificate

First you need the cert itself. Here are three ways to grab one:

**From your browser —** Click the lock icon in the address bar, go to "Connection is secure" or "Certificate details," and look for an Export or "Copy PEM" option. Every browser puts this in a slightly different place, but it's always under the lock icon.

**Using openssl on the command line —**

```bash
openssl s_client -connect example.com:443 -showcerts 2>/dev/null \
  | openssl x509 -outform PEM
```

This connects to the server and spits out the PEM. Pipe it to a file if you want to keep it.

**From a .pem or .crt file —** Open it in any text editor. If it starts with `-----BEGIN CERTIFICATE-----`, you've got a PEM.

Once you have the text, paste it into the input area. The tool auto-detects the certificate and parses it immediately — or click "Parse Certificate" if it doesn't trigger automatically.

## Mode 2: Domain lookup

Switch to the "Domain Lookup" tab, type a domain like `github.com` (don't add `https://`), and hit "Fetch." The tool queries crt.sh's Certificate Transparency logs for the most recently issued certificate for that domain.

This needs network access since it's calling crt.sh's API. It only retrieves publicly logged certificate records — nothing private.

## Reading the output

| Field | What to look for |
|-------|-----------------|
| Subject | The CN value tells you the primary identity |
| Issuer | Who signed it — Let's Encrypt, DigiCert, Google Trust Services, etc. |
| Serial Number | Match this against a CRL or OCSP response to check revocation |
| Validity | Green = good, orange = expiring within 30 days, red = expired |
| SAN | Make sure your target domain is in this list |
| SHA-256 Fingerprint | Compare against what the browser shows if you're doing cert pinning |

The top of the page shows a colored banner based on expiry: red for expired, orange for "expires in N days" (when 30 or fewer days remain), green when everything's fine.

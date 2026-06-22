# Random Password Generator — Example Output

## Strong (16 chars, all charsets)

```
Kx9#mP2@wL5$vN8!
Rq7&jT4*nB6^cY1%
Hs3@fW8!uE2#pM9$
```

This is what you want for most accounts. Mix of upper, lower, digits, and symbols at a reasonable length.

## Alphanumeric only (no symbols)

```
Kx9mP2wL5vN8cY1R
Rq7jT4nB6cY1pM9f
Hs3fW8uE2pM9nB6c
```

Some legacy systems don't support symbols, or have such a narrow allowed set that it's simpler to skip them entirely and bump up the length. A 20-character alphanumeric password is stronger than a 12-character one with symbols.

## Extra-long for API keys (32 chars)

```
Kx9#mP2@wL5$vN8!Rq7&jT4*nB6^cY1%
```

For API keys, secrets, and encryption keys, go long. 32+ characters with all character sets is standard.

## PIN code (digits only, length 6)

```
847291
039145
562078
```

Useful when you need a numeric-only PIN and don't want to use birthdays or patterns. 6 digits gives you a million combinations — fine for a PIN protected by rate limiting, terrible for an online account password.

## Batch (5 passwords, 16 chars)

```
Kx9#mP2@wL5$vN8!
Rq7&jT4*nB6^cY1%
Hs3@fW8!uE2#pM9$
Zt5*kD1@xG4&bJ7^
Mn2$hA6#yC3!wP8@
```

Use batch mode when setting up multiple accounts at once or generating initial passwords for new team members. Give each person one password, force a change on first login.

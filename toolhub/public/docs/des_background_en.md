# DES Technical Background

DES -- the Data Encryption Standard -- is the grandparent of modern encryption. Standardized in 1977, it was the first cipher to be publicly specified and widely deployed. If you're learning cryptography today, DES isn't something you should use (56-bit keys can be brute-forced in hours), but it's worth understanding because it established the design patterns that AES and its successors built on.

## How DES came to be

The story has some genuinely interesting twists. In 1972, the US National Bureau of Standards (now NIST) put out a call for a national encryption standard. IBM submitted a cipher called Lucifer, which had been developed by a team led by Horst Feistel. The NSA then reviewed and modified the design -- notably, they shortened the key from Lucifer's 128 bits to 56 bits, and they changed the S-box constants.

At the time, people were suspicious. Did the NSA insert a backdoor? The answer turned out to be the opposite: when differential cryptanalysis was discovered publicly in 1990 (by Biham and Shamir), researchers realized the NSA's S-box changes had actually hardened the cipher against this exact attack. The NSA had known about differential cryptanalysis for years and kept it secret, but they used that knowledge to strengthen DES, not weaken it. The 56-bit key, however, was a different story -- short enough that the NSA could brute-force it with their computing resources in the 1970s.

## The Feistel network

DES is a 16-round Feistel network. In each round, the 64-bit block is split into two 32-bit halves. The right half goes through a round function (expansion to 48 bits, XOR with the round key, S-box substitution, permutation) and then gets XORed with the left half. The halves are swapped, and you repeat 16 times.

The Feistel structure has an elegant property: decryption is exactly the same as encryption, just with the round keys in reverse order. This was important in the 1970s when hardware implementations were expensive and you wanted one circuit for both directions.

## Why 56 bits wasn't enough

From the day DES was published, people argued the key was too short. At 56 bits, the key space is 2^56 -- about 72 quadrillion keys. In 1977, that was out of reach for anyone without a government-sized budget. By 1997, the DESCHALL project broke a DES key in 56 hours using a distributed network of volunteers. In 1998, the EFF built a dedicated machine called Deep Crack that could break DES in 56 hours for $250,000. Today, a modest GPU rig can do it in days.

This is the lesson DES teaches us about key sizes: what's secure today won't be secure forever. Crypto designs need headroom.

## Triple DES (3DES): the stopgap

Rather than abandon DES entirely, the industry created Triple DES: encrypt with key K1, decrypt with key K2, encrypt with K3. The "decrypt" in the middle isn't a mistake -- it makes 3DES compatible with regular DES when K1=K2=K3 (the middle decryption cancels the first encryption). Effective key size with three different keys is 168 bits (though a meet-in-the-middle attack reduces this to 112 bits of practical security).

3DES is still approved for some legacy government applications, but it's been deprecated by NIST for new use and will be disallowed after 2023. It's about 3x slower than AES and can only process 64-bit blocks (making it vulnerable to birthday-bound attacks like Sweet32 after encrypting ~32 GB with the same key).

## DES today: educational value only

For new systems, DES is off the table. Even 3DES should only exist in legacy code you're trying to migrate away from. But as a learning tool, DES is excellent. The Feistel structure, the S-box design principles, the key schedule -- these are the building blocks that inform how we think about block cipher design today. If you're studying cryptography, implementing DES from scratch teaches you more about how ciphers work than reading ten papers on AES. Just don't deploy it.

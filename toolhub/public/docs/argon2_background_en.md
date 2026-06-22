# Argon2 Technical Background

Argon2 is the password hashing algorithm you should be using in 2024 and beyond. It won the Password Hashing Competition in 2015, beating out a field of two dozen candidates, and has since been standardized in RFC 9106. The team behind it -- Alex Biryukov, Daniel Dinu, and Dmitry Khovratovich -- designed it specifically to make life miserable for attackers with specialized hardware. That's the whole point of Argon2, really: it's memory-hard.

## What "memory-hard" actually means

Most password hashing before Argon2 was designed to be CPU-hard -- you crank up the iteration count and brute-forcing gets linearly more expensive. The problem is that GPUs and ASICs can parallelize CPU-bound work embarrassingly well. A GPU with a few thousand cores can try passwords thousands of times faster than your server CPU can hash them once. That's not a fair fight.

Memory-hardness changes the battlefield. Argon2 forces the algorithm to allocate and repeatedly access a large chunk of memory -- tens or hundreds of megabytes. GPUs have fast memory but very little of it per core. An ASIC that tried to crack Argon2 hashes at scale would need absurd amounts of RAM, which drives up the cost of building cracking rigs by orders of magnitude. It's a much more elegant defense than just making the hash slower.

## The three variants and when to use each

Argon2 comes in three flavors, and the naming isn't super intuitive if you're new to it:

**Argon2d** is the fastest. It accesses memory in a data-dependent pattern -- the path through memory depends on the password itself. This makes it maximally resistant to GPU/ASIC attacks, but it also means an attacker who can watch the memory access pattern (a side-channel attack) might learn something about the password. Use this only when side channels aren't a threat -- like on a server you fully control that no one else shares.

**Argon2i** is the side-channel-resistant version. Memory access is data-independent -- it follows a fixed pattern regardless of the password. This means no information leaks through timing or cache behavior, but the trade-off is that it's easier to optimize for parallel hardware. Use it when you're worried about side channels, like in a shared hosting environment.

**Argon2id** is the hybrid, and it's what you should use unless you have a specific reason not to. The first half of the computation uses Argon2i-style data-independent access (to prevent side-channel leakage during the most sensitive phase), and the second half switches to Argon2d-style data-dependent access (to slam the door on GPU attacks). RFC 9106 and NIST both recommend it as the default.

## Under the hood: Blake2b and the memory matrix

Argon2 builds on Blake2b, a fast cryptographic hash that's much faster than SHA-256 on 64-bit platforms. The algorithm starts by filling a large block of memory with pseudo-random data derived from the password, salt, and parameters. Then it iterates through that memory, reading from and writing to different positions, creating a dependency chain where you can't compute any block without having the entire memory array available.

The parameters give you three knobs to turn:

- **Memory cost (m)** -- how many kibibytes of memory to use. Typical values range from 64 MiB (development) to 256 MiB or more (production). More memory means more resistance to hardware attacks.
- **Time cost (t)** -- how many passes to make over the memory. Each pass doubles the compute time. Values of 1-3 are common; going above 10 rarely makes sense.
- **Parallelism (p)** -- how many independent lanes to process simultaneously. Usually 1-4. High parallelism doesn't help much on typical server hardware and can actually weaken security by dividing the available memory per lane.

After all the iterations, the final block gets hashed again with Blake2b to produce the output hash -- typically 32 bytes, but configurable.

## The gotcha with Argon2id parameters

Here's something that trips people up: you need to balance memory and time cost against what your production servers can actually handle. If you set memory to 1 GB and a login request takes 3 seconds on your two-core server, users will hate you, and someone will probably turn it down to something insecure just to make the complaints stop.

The better approach: benchmark on your actual production hardware. Pick parameters that make a single hash take about 0.5-1 second. That's fast enough that users don't notice, but slow enough that an attacker trying billions of guesses would need centuries and a utility-scale power budget. Then set up monitoring to alert you when average hash time changes (because that could mean someone changed the config, or your hardware got unexpectedly faster).

## Migrating from bcrypt or PBKDF2

If you're on bcrypt or PBKDF2-SHA256 today, Argon2id is a meaningful upgrade. bcrypt is limited to 72 bytes of password input and uses a fixed 4 KB memory footprint -- fine in 1999, not great now. PBKDF2 is just iterated SHA hashing with no memory component at all.

The migration pattern: when a user logs in, if their hash is in the old format, verify against it normally, then re-hash with Argon2id and store the new hash transparently. Over time, your active users all get upgraded. You can also add a "last login" column and force-upgrade anyone who hasn't logged in for N months by resetting their password.

## Quantum resistance

Argon2 isn't post-quantum by design, but its memory-hardness gives it a surprising edge. Quantum computers don't get to magically bypass memory -- Grover's algorithm speeds up searching unsorted data, but it doesn't make RAM cheaper. So an attacker with a quantum computer might cut the effective security of the hash output in half (from 256-bit to 128-bit against preimage attacks), but they'd still need the same massive memory footprint per guess. That means Argon2 should hold up better against quantum attacks than purely CPU-bound schemes.

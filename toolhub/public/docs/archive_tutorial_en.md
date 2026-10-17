# Archive Tool — Usage Tutorial

The tool has two modes: **Extract** and **Create**, switched by the radio buttons at the top.

## Extract an archive

1. Switch to **Extract**, upload a `.zip` / `.tar` / `.7z` file.
2. If the archive is password-protected, fill in the password box — leaving it empty tries once, and only then prompts you for the password on failure.
3. Click **Open archive**; the tool lists all entries (name, size, modified time).
4. Click **Extract** next to an entry to get just that one, or **Extract all** at the top to download everything at once.

> The browser may block bulk downloads; a small gap is inserted between files when extracting all.

## Create an archive

1. Switch to **Create**, upload one or more files (add multiple times, remove with ✕).
2. Pick the container: **ZIP** / **TAR** / **7Z**. Switching format auto-applies the default algorithm and extension.
3. Pick the compression: deflate / store / gzip / bzip2 / xz / zstd / lz4.
4. Set the output file name (or leave the default).
5. Click **Create archive**, then download when done.

## Size limits

- An archive to extract above **2GB** is refused; above **1GB** it warns first.

## Tips

- Just packaging a bunch of images to share? Use **store** (images are already compressed, re-compressing is pointless and slower).
- Smallest size and the recipient uses 7-Zip? Use **7Z + xz**.
- Maximum compatibility (Windows Explorer can open it)? Use **ZIP + deflate**.

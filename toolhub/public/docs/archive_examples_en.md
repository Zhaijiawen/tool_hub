# Archive Tool — Examples

## Extract a downloaded ZIP

**Input:** `dataset.zip` (45 MB, 200 CSVs inside)
**Action:** Extract mode, upload, open archive
**Output:** entry list, click Extract all to download 200 files

No command line needed — see what's inside and grab what you need, all in the browser.

## Extract an encrypted 7Z

**Input:** `secrets.7z` (encrypted)
**Action:** upload, fill password, open
**Output:** decrypted entry list

The password is used locally to unlock only; it is not uploaded.

## Package project source to share

**Input:** 30 files under `src/` (12 MB total)
**Action:** Create mode, ZIP + deflate, output `project.zip`
**Output:** `project.zip` (~3 MB)

deflate compresses text well, bringing size down to about 1/4.

## Pack a bunch of JPEGs (store)

**Input:** 80 photos (280 MB total)
**Action:** Create mode, ZIP + store
**Output:** `photos.zip` (~279 MB)

JPEGs are already compressed, so store barely grows size but is far more convenient than sending files one by one, and much faster.

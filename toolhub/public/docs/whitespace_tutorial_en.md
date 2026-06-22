# Whitespace Handling — Usage Tutorial

The whitespace tool has two modes, and they do one thing each. Pick the one that matches what you need.

Paste your text into the input area. Multi-line text is fine — both modes handle it.

**Trim Whitespace** removes whitespace from the start and end of your text. Everything in between stays exactly as it was. This is the operation for cleaning up form inputs: a user types or pastes something with accidental leading or trailing spaces, and trim normalizes it before it hits your validation or database.

**Compress Whitespace** is more aggressive. It replaces every run of whitespace characters — multiple spaces, mixed tabs and spaces, blank-line gaps — with a single space. It also trims the edges. The result is text where every word is separated by exactly one space and there's no whitespace at either end.

Hit the operation button, and the processed text appears in the output area. Click **Copy** to grab it.

## When to use which

Trim is your default for sanitizing individual values. If you're cleaning up a name field, an email address, or a search query, trim is all you need. Internal spaces in `"John Doe"` should stay — trimming only the edges gives you a clean value.

Compress is for blocks of text where the spacing has gone wrong. Think of pasted content from a PDF where words have random gaps, or a CSV file where someone used uneven spacing around commas, or code where tabs and spaces are mixed inconsistently. Compress normalizes everything to clean single spaces.

A hybrid approach that's less common but useful: trim first, then decide if you still need compression. Sometimes the edges are the only problem.

## Where whitespace causes real headaches

- **Login forms**: A trailing space in a username or password field means the credentials don't match. Your backend hashes `"password"` but the user sent `"password "` — different hash, login fails, user is confused. Trim before hashing.
- **CSV imports**: `"New York"` and `" New York"` are different values. Your database gets a duplicate city with slightly different spelling. Compress or trim every field during preprocessing.
- **Diff tools**: Two files with different trailing whitespace will show as completely changed if whitespace is significant to the diff algorithm. Trim before comparing.
- **API integration**: A partner's API might return strings with inconsistent spacing. Compressing before processing normalizes your input regardless of what they send.

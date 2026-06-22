# Timestamp Converter — Usage Tutorial

The timestamp converter is a two-way bridge: feed it a Unix timestamp and it gives you a human-readable date, or give it a date string and it spits out the timestamp. It also converts between different string formats.

## Converting a Unix timestamp to a date

Paste or type a Unix timestamp (in seconds) into the input field. The converter shows you the corresponding date and time in your local timezone, in UTC, and in several common formats.

If your timestamp is in milliseconds — which is what JavaScript's `Date.now()` produces — toggle the millisecond mode. The converter divides by 1000 internally so you don't have to. If you accidentally put a second-based timestamp in millisecond mode, you'll get a date in 1970, which is a pretty good hint that something's off.

## Converting a date to a timestamp

Switch to date-to-timestamp mode and pick a date and time using the picker. The converter computes the Unix timestamp (in seconds). You can also paste an ISO 8601 string like `2024-04-09T14:30:00Z` and get the timestamp directly.

This direction is useful when you're setting up test data, configuring an API request, or trying to figure out what timestamp corresponds to "next Tuesday at 3 PM."

## Converting between date formats

The format converter takes a date string and reformats it. Got dates in `MM/DD/YYYY` from a spreadsheet that your database expects as `YYYY-MM-DD`? Paste them in, set the source format, set the target format, and convert. The tool uses standard format tokens:

| Token | Meaning | Example |
|---|---|---|
| `YYYY` | 4-digit year | 2024 |
| `YY` | 2-digit year | 24 |
| `MM` | 2-digit month | 04 |
| `DD` | 2-digit day | 09 |
| `HH` | 2-digit hour (24h) | 14 |
| `hh` | 2-digit hour (12h) | 02 |
| `mm` | 2-digit minute | 30 |
| `ss` | 2-digit second | 00 |
| `A` | AM/PM | PM |

## Choosing the right output timezone

The converter defaults to your local timezone, but you can switch to UTC or any IANA timezone (like `America/New_York` or `Asia/Shanghai`). This is critical when you're coordinating across teams in different timezones — you need to know whether "midnight" means midnight UTC or midnight local.

A common workflow: your server logs are in UTC, but you're debugging an issue that a user reported at "9 PM Eastern." Convert the user's local time to UTC, then scan the logs around that UTC timestamp. The converter handles the offset calculation so you don't have to remember whether Eastern is UTC-5 or UTC-4 depending on daylight saving time.

## Handling ambiguous inputs

Sometimes you'll paste something and the converter won't know what to make of it. A number like `1712620800` could be a Unix timestamp or an ID. An abbreviated month name like "Jan" could be January in English or something else entirely in another language. When the output looks wrong:
- Check whether you need second or millisecond mode
- Verify your source format string matches the actual input format
- Confirm the timezone setting
- Try the other conversion direction — sometimes it's clearer which way the data should flow

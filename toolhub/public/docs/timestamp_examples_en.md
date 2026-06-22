# Timestamp Converter — Examples

## Unix timestamp to human-readable date

This is the most common use case. You see a number in a database or API response and need to know what it means.

**Input:** `1712620800` (seconds)
**Mode:** Unix timestamp to date
**Output:**
```
UTC:     2024-04-09 00:00:00
Local:   2024-04-08 20:00:00 (UTC-4)
ISO 8601: 2024-04-09T00:00:00.000Z
```

Same timestamp, different clock readings depending on timezone. The local time shows EDT (Eastern Daylight Time, UTC-4). If you're in a different timezone, your local output will differ.

**Input:** `1700000000000` (milliseconds)
**Mode:** Unix timestamp to date (millisecond mode)
**Output:**
```
UTC:     2023-11-14 22:13:20
ISO 8601: 2023-11-14T22:13:20.000Z
```

This is a real value from a JavaScript `Date.now()` call in late 2023. Notice how hard it is to read in its raw form — the converter makes it instant.

## Date to Unix timestamp

Building an API request that needs a timestamp parameter? Use this direction.

**Input:** `2024-12-25 00:00:00` (UTC)
**Mode:** Date to Unix timestamp
**Output:** `1735104000`

Now you know the Unix timestamp for Christmas 2024 at midnight UTC. If you need it in milliseconds for JavaScript, multiply by 1000: `1735104000000`.

## Format conversion — spreadsheet dates to ISO

A common data cleanup task: spreadsheet exports often use `MM/DD/YYYY` but your database wants `YYYY-MM-DD`.

**Input:** `12/25/2024`
**From format:** `MM/DD/YYYY`
**To format:** `YYYY-MM-DD`
**Output:** `2024-12-25`

Batch this through the converter and you've standardized an entire column.

## Converting log timestamps

Log files love custom formats. Apache logs use `[09/Apr/2024:14:30:45 +0000]`, application logs might use `2024-04-09 14:30:45.123`.

**Input:** `09/Apr/2024:14:30:45 +0000`
**From format:** `DD/MMM/YYYY:HH:mm:ss Z`
**To format:** `YYYY-MM-DD HH:mm:ss`
**Output:** `2024-04-09 14:30:45`

The `MMM` token handles abbreviated month names, and `Z` handles the timezone offset. Once everything is in a uniform format, sorting and searching become straightforward.

## Current timestamp reference

Need the current Unix timestamp right now? The converter's "Now" button fills in the current date and computes the timestamp. Handy when you're writing a script and need to hardcode a "recent" value, or when you're verifying that an API is returning fresh data.

If the current output shows `1712000000` and your API is returning creation dates of `1711900000`, that's about a day ago — you can roughly estimate time differences without pulling out a calculator.

## Troubleshooting: the 1970 problem

**Input:** `1712620800`
**Mode:** Millisecond (wrong mode!)
**Output:** `1970-01-20 19:43:40`

A timestamp in the billions with millisecond mode on gives you a date in January 1970 — about 20 days after the epoch. If you ever see dates around 1970, check your units. Same thing happens when you send seconds to `new Date()` in JavaScript without multiplying by 1000.

**Input:** `1712620800000`
**Mode:** Second (wrong mode!)
**Output:** Year 56246

Going the other direction, putting a millisecond timestamp into second mode gives you a date tens of thousands of years in the future. Both mistakes are obvious once you see them, which makes the converter a fast sanity check.

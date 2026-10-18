# Date Difference — The Technical Background

Subtracting two dates sounds trivial. Every edge case in the calendar is waiting in that subtraction.

## Why you can't just subtract timestamps

The obvious approach: convert both dates to millisecond timestamps and divide. That works for days and smaller units. It fails for months and years:

- A month is 28, 29, 30, or 31 days
- A year is 365 or 366 days
- Leap seconds exist (ignored by most civil systems)

So "January 31 + 1 month" isn't "February 31" (doesn't exist) — it's February 29. Timestamp division gives you "30.44 days", a number that matches no actual month and no calendar reality.

## What this tool does

**Days and smaller** (hours, minutes, seconds, milliseconds): exact timestamp arithmetic. No ambiguity.

**Months and years**: calendar-aware stepping — count whole months from the start date until you reach the end date, then break the remainder into smaller units. "January 31 to March 1" yields 1 month + 1 day, not 30 days or 1.03 months.

All results keep two decimal places, avoiding float noise like "0.30000000000000004".

## Precision boundaries

- The tool uses your device's local timezone — no timezone conversion, it's calendar math on dates
- Same start and end date = 0, not 1 (many scheduling tools count inclusive and return 1; this one doesn't — add 1 yourself if you need inclusive counting)
- An end date before the start date errors out instead of producing a negative result

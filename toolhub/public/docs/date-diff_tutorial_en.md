# Date Difference — How to Use

Measure the gap between two dates. Pick a start, pick an end, pick a unit — the result updates instantly.

## Basic usage

1. Select the **start date** (defaults to today)
2. Select the **end date**
3. Pick a **unit**: years, months, days, hours, minutes, seconds, milliseconds
4. The result computes automatically, to two decimal places

An end date earlier than the start date triggers an error — check you haven't swapped them.

## Choosing the unit

| What you want to know | Unit |
|---|---|
| How long a project ran | Months or days |
| How much billing/membership time is left | Days |
| Hours until a deadline | Hours |
| Order-of-magnitude API/script runtime | Seconds or milliseconds |
| Total span with decimal precision | Years or months |

Years and months are calendar-aware, not simple division. From January 31 to March 1, "months" gives ~1.03 while "days" gives 30 — both correct, different conventions.

## Common scenarios

**Payment cycle**: Statement date March 15, due date April 15 — pick "days" to confirm it's exactly 30.

**Trial period**: Signup date to today in "days" tells you which day of the "7-day trial" you're on.

**Backward planning**: Launch June 30, today is May 20 — "days" gives 41, then decide whether to cut scope or add people.

## Division of labor with the Date Calculator

- **This tool**: given two dates, find the gap
- **Date Calculator** (`/convert/date-calc`): given one date and a duration, find the other date

Opposite directions — don't mix them up. "What date is 90 days from now" belongs to the Date Calculator; "how many days between these two" belongs here.

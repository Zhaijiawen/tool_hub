# Date Math: It's Harder Than You'd Think

Adding days to a date sounds trivial. Until you realize months have different lengths, leap years exist, timezones shift, and "add one month" has at least three reasonable interpretations.

## The Calendar Is a Mess (and That's Why This Tool Exists)

### Months Are Variable

The simplest date operations trip people up because months aren't fixed-length:

- January has 31 days. So does March. But February has 28 (or 29).
- "Add one month to January 31" -- what's the answer? February 28? March 3? Different systems give different answers.
- April, June, September, November have 30 days. The rest have 31. Except February.

### Leap Years

The Gregorian calendar's leap year rule: years divisible by 4 are leap years, except years divisible by 100 (which are not), unless also divisible by 400 (which are). So 2000 was a leap year, 1900 was not, 2024 was. This 400-year cycle averages out to 365.2425 days per year.

### Business Days vs Calendar Days

"Add 5 business days" sounds simple but:
- Weekends (Saturday/Sunday) don't count
- Public holidays vary by country and year
- Some organizations have their own holiday calendars

### Timezones Make Everything Worse

A "day" boundary depends on timezone. If you're calculating "tomorrow at 9 AM" but the server is in UTC and the user is in Tokyo, you need to know which timezone "tomorrow" refers to. For date-only calculations this matters less, but once time enters the picture, timezone awareness is critical.

## Common Date Operations

### Simple Offsets
- Yesterday / today / tomorrow
- N days from now / N days ago
- Next/last week, month, year

### Period Boundaries
- First day of month / last day of month
- Quarter start and end dates
- Fiscal year boundaries (often different from calendar year)

### Differences
- Days between two dates
- Weeks between two dates
- Months/years between two dates (with variable-length month handling)

### Business Logic
- Add N business days (skip weekends)
- Calculate due dates with holiday exclusions
- SLA deadlines in business hours

## ISO 8601: The Standard That Helps

ISO 8601 dates look like `2024-03-15`. This format is unambiguous (no confusing MM/DD vs DD/MM), sortable as strings, and supported by every modern programming language. Whenever you're storing or exchanging dates, use ISO 8601. It saves everyone the headache of guessing the format.

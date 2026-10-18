# Date Difference — Code Examples

## JavaScript: difference in days

```javascript
function diffInDays(start, end) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  // Strip the time-of-day before comparing — otherwise Jan 1 23:00 to Jan 2 01:00
  // computes as 0.08 days instead of 1
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((b - a) / MS_PER_DAY)
}

diffInDays(new Date('2024-01-31'), new Date('2024-03-01'))  // 30
```

## JavaScript: calendar-month difference

```javascript
function diffInCalendarMonths(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12
  months += end.getMonth() - start.getMonth()
  // If the end day-of-month hasn't reached the start day-of-month,
  // the final month isn't complete — back off one month
  if (end.getDate() < start.getDate()) months--
  return months
}

diffInCalendarMonths(new Date('2024-01-31'), new Date('2024-03-01'))  // 1
```

## Python: dateutil from the standard ecosystem

```python
from datetime import date
from dateutil.relativedelta import relativedelta

start = date(2024, 1, 31)
end = date(2024, 3, 1)

rd = relativedelta(end, start)
print(f"{rd.years}y {rd.months}m {rd.days}d")  # 0y 1m 1d

# Pure day count
print((end - start).days)  # 30
```

## SQL: day difference between two date columns

```sql
-- In most databases, subtracting dates yields days directly
SELECT DATEDIFF(day, start_date, end_date) AS days
FROM orders;
```

## Remember

- Days and below: timestamp math. Months and years: calendar math.
- "N months from date X" always has the end-of-month trap (Jan 31 + 1 month)
- When comparing dates only, zero out the time first or overnight gaps become fractions

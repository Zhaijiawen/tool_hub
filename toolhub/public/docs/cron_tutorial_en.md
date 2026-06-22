# Cron Expression Parser -- How to Use

Two ways to use this tool: parse a cron expression to understand what it does, or build one visually without memorizing the syntax.

## Parsing a Cron Expression

Paste or type a cron expression and you get an instant plain-English description plus the next few execution times.

**5-field (Unix standard):** `0 9 * * 1-5`
**6-field (Quartz with seconds):** `0 0 9 * * MON-FRI`

The tool translates these into readable descriptions:
- `0 9 * * 1-5` -- "At 09:00, Monday through Friday"
- `*/5 * * * *` -- "Every 5 minutes"
- `0 0 1 * *` -- "At midnight, on day 1 of every month"

Below the description you'll see the next 5 execution times calculated from your browser's local timezone. This is the most reliable way to verify your cron expression -- just look at the dates and times and ask yourself "is this when I want it to run?"

## Building an Expression Visually

If you don't want to remember the field order and special characters, use the visual builder. Select what you want for each component and the expression auto-generates:

1. **Minute**: Fixed minute (`:00`, `:30`) or step (every 5, 10, 15 minutes)
2. **Hour**: Specific hours or every N hours
3. **Day**: Every day, a specific date, or the last day of the month
4. **Month**: All year or specific months
5. **Weekday**: Weekdays, weekends, or specific days

The generated expression updates as you make selections. Copy it and paste it into your crontab, GitHub Actions workflow, or wherever you need it.

## Common Patterns by Use Case

### Daily jobs

| What you want | Expression |
|---|---|
| Backup at 2 AM | `0 2 * * *` |
| Report at 8 AM | `0 8 * * *` |
| Twice a day (noon and 6 PM) | `0 12,18 * * *` |

### Weekly jobs

| What you want | Expression |
|---|---|
| Monday at 9 AM | `0 9 * * 1` |
| Friday at 5 PM | `0 17 * * 5` |
| Every hour on weekdays | `0 * * * 1-5` |

### Monthly jobs

| What you want | Expression |
|---|---|
| 1st of the month | `0 9 1 * *` |
| Last day of month | `0 23 L * *` (Quartz only) |
| First day of each quarter | `0 0 1 1,4,7,10 *` |

### High-frequency jobs

| What you want | Expression |
|---|---|
| Every 5 minutes | `*/5 * * * *` |
| Every 10 minutes | `*/10 * * * *` |
| Every 30 minutes | `0,30 * * * *` |

## Error Diagnosis

The tool catches common mistakes before they hit production:

- **Month 13?** Range is 1-12.
- **Weekday 8?** Range is 0-7 (or 1-7 for Quartz).
- **Step value of 0?** `*/0` makes no sense -- use `*/1` or just `*`.
- **Mixed day-of-month and day-of-week in Quartz?** Use `?` in one of them to avoid ambiguity.

## A Few Habits Worth Building

- Always read the plain-English description. Even if you wrote the expression yourself, read what the tool says it means. You'd be surprised how often a missing `?` or an extra `*` changes the meaning.
- Check the next 5 execution times. Especially for edge cases: end of month, beginning of month, daylight saving transitions. The time list doesn't lie.
- Know your timezone. The tool shows times in your browser's timezone. The server where this runs may be UTC. Adjust accordingly or add timezone configuration to your scheduler.
- Comment your crons. A `# Runs weekdays at 9 AM EST` comment above the expression saves the next person (including future you) from having to parse it again.

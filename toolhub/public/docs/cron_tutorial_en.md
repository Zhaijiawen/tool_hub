# Cron Expression Parser - Tutorial

## Getting Started

The Cron expression parser helps developers and operations engineers quickly understand, validate, and generate Cron time expressions without memorizing complex syntax rules.

## Parsing a Cron Expression

### Step 1: Enter the Expression

Paste or type a Cron expression in the input box:

- **5-field format (Unix standard)**: `0 9 * * 1-5`
- **6-field format (Quartz, with seconds)**: `0 0 9 * * MON-FRI`

### Step 2: View the Plain-text Description

The tool instantly translates the expression into a human-readable description, for example:
- `0 9 * * 1-5` → "At 09:00 AM, Monday through Friday"
- `*/5 * * * *` → "Every 5 minutes"
- `0 0 1 * *` → "At 12:00 AM, on day 1 of every month"

### Step 3: View Next Execution Times

The tool lists the next 5 execution times to help you confirm the schedule is correct:

```
Next execution times:
1. 2024-04-15 09:00:00 (Monday)
2. 2024-04-16 09:00:00 (Tuesday)
3. 2024-04-17 09:00:00 (Wednesday)
4. 2024-04-18 09:00:00 (Thursday)
5. 2024-04-19 09:00:00 (Friday)
```

## Reverse-generating a Cron Expression

### Using the Visual Builder Panel

If you're not familiar with Cron syntax, use the visual selection panel:

1. **Minute**: Select a fixed minute (e.g., `:00`, `:30`) or a step (e.g., every 5 minutes)
2. **Hour**: Select specific hours or every N hours
3. **Day**: Select every day, a fixed date, or the last day of the month
4. **Month**: Select all year or specific months
5. **Weekday**: Select weekdays, weekends, or specific days

After making selections, the corresponding Cron expression is auto-generated below for direct copy-paste.

## Common Cron Scenarios

### Daily Tasks

| Requirement | Cron Expression |
|-------------|----------------|
| Backup at 2 AM daily | `0 2 * * *` |
| Send report at 8 AM daily | `0 8 * * *` |
| Run at noon and 6 PM daily | `0 12,18 * * *` |

### Weekly Tasks

| Requirement | Cron Expression |
|-------------|----------------|
| Every Monday at 9 AM | `0 9 * * 1` |
| Every Friday at 5 PM | `0 17 * * 5` |
| Every hour on weekdays | `0 * * * 1-5` |

### Monthly Tasks

| Requirement | Cron Expression |
|-------------|----------------|
| Payroll notification on 1st | `0 9 1 * *` |
| Last day of month | `0 23 L * *` (Quartz) |
| First day of each quarter | `0 0 1 1,4,7,10 *` |

### High-frequency Tasks

| Requirement | Cron Expression |
|-------------|----------------|
| Check every 5 minutes | `*/5 * * * *` |
| Every 10 minutes | `*/10 * * * *` |
| Every 30 minutes | `0,30 * * * *` |

## Error Diagnosis

### Common Errors and Fixes

**Error: Month field out of range**
```
Input:  0 9 * 13 *
Error:  Month value 13 is out of valid range [1-12]
Fix:    0 9 * 12 * (December)
```

**Error: Invalid weekday value**
```
Input:  0 9 * * 8
Error:  Weekday value 8 is out of valid range [0-7]
Fix:    0 9 * * 1-5 (weekdays)
```

**Error: Step value is zero**
```
Input:  */0 * * * *
Error:  Step value cannot be 0
Fix:    */1 * * * * (every minute)
```

## Best Practices

1. **Always verify with plain-text description**: After creating or receiving a Cron expression, confirm its meaning using this tool's description feature
2. **Check next execution times**: Especially for edge cases like end of month or year — the time list is the most reliable check
3. **Be aware of timezones**: This tool displays times based on your browser's local timezone; deployed servers may use UTC
4. **Document Cron meanings**: Add a comment in your code explaining what the Cron expression does to make maintenance easier for others


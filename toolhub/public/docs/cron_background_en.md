# Cron Expression Parser - Technical Background

## What is Cron

Cron is a time-based job scheduling daemon in Unix/Linux systems that allows users to automatically execute commands or scripts at specified times or intervals. The name "Cron" comes from the Greek word "chronos" (time).

## Cron Expression Format

### Standard 5-field Format (Unix Cron)

```
┌───────── Minute (0 - 59)
│ ┌─────── Hour (0 - 23)
│ │ ┌───── Day of month (1 - 31)
│ │ │ ┌─── Month (1 - 12)
│ │ │ │ ┌─ Day of week (0 - 7, both 0 and 7 = Sunday)
│ │ │ │ │
* * * * *
```

### Quartz 6-field Format (with seconds)

```
┌────────── Second (0 - 59)
│ ┌──────── Minute (0 - 59)
│ │ ┌────── Hour (0 - 23)
│ │ │ ┌──── Day of month (1 - 31)
│ │ │ │ ┌── Month (1 - 12)
│ │ │ │ │ ┌ Day of week (1 - 7, 1 = Sunday)
│ │ │ │ │ │
* * * * * *
```

## Special Characters

| Character | Meaning | Example |
|-----------|---------|---------|
| `*` | Any value | `* * * * *` = every minute |
| `,` | List of values | `1,15 * * * *` = at minute 1 and 15 of every hour |
| `-` | Range | `1-5 * * * *` = minutes 1 through 5 of every hour |
| `/` | Step | `*/5 * * * *` = every 5 minutes |
| `?` | No specific value (day/weekday) | Quartz-specific |
| `L` | Last | `L` in day field = last day of month |
| `W` | Nearest weekday | `15W` = nearest weekday to the 15th |
| `#` | Nth weekday | `3#2` = second Wednesday |

## Common Cron Expressions

| Expression | Meaning |
|-----------|---------|
| `* * * * *` | Every minute |
| `0 * * * *` | Every hour on the hour |
| `0 0 * * *` | Every day at midnight |
| `0 9 * * 1-5` | Every weekday at 9 AM |
| `0 0 1 * *` | First of every month at midnight |
| `0 0 * * 0` | Every Sunday at midnight |
| `*/5 * * * *` | Every 5 minutes |
| `0 8,12,18 * * *` | Every day at 8 AM, 12 PM, and 6 PM |
| `0 0 1 1 *` | January 1st every year |

## How Cron Works

The Cron daemon checks all registered jobs (called crontab entries) every minute. It compares the current time against each job's time expression and executes the corresponding command when a match is found.

## Cron Implementations on Different Platforms

### Linux Cron (Vixie Cron)
The most common Unix Cron implementation, using the 5-field format. Supports preset keywords like `@reboot`, `@daily`.

### Quartz Scheduler (Java)
The most popular job scheduling library in the Java ecosystem. Uses a 6-field format (with seconds) and supports additional special characters like `L`, `W`, `#`.

### Spring @Scheduled
Annotation-based scheduling in Spring Framework. Supports standard Cron expressions as well as `fixedDelay`/`fixedRate` approaches.

### Node.js node-cron
A Cron library for Node.js following the Unix 5-field format.

### GitHub Actions Cron
GitHub Actions uses UTC-timezone 5-field Cron expressions to configure scheduled workflows.

## Important Considerations

1. **Timezone issues**: Cron usually runs in the server's local timezone; be aware of issues caused by daylight saving time
2. **Missed executions**: If the server is down during a scheduled time, the job will not run retroactively
3. **Concurrency issues**: If a job's execution time exceeds the interval, concurrent runs may occur; consider adding locks
4. **Minimum granularity**: Standard Unix Cron has a minimum granularity of 1 minute; higher frequencies require Quartz or custom implementations


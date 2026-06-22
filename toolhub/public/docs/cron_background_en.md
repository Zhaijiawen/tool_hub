# Cron Expressions: What Those Five Asterisks Actually Mean

If you've configured a scheduled job on a Linux server, a GitHub Action, or a Spring Boot app, you've stared at something like `0 9 * * 1-5` and hoped you got it right. Let's break down what each field does.

## The Five Fields (Standard Unix Cron)

```
┌───────── Minute (0-59)
│ ┌─────── Hour (0-23)
│ │ ┌───── Day of month (1-31)
│ │ │ ┌─── Month (1-12)
│ │ │ │ ┌─ Day of week (0-7, where 0 and 7 are both Sunday)
│ │ │ │ │
* * * * *
```

`* * * * *` means "every minute of every hour of every day of every month of every day of the week." That's the wildcard -- it matches everything.

For Quartz (Java), there's a sixth field for seconds at the front. The day-of-week in Quartz uses 1-7 where 1=Sunday, which is annoyingly different from Unix cron.

## The Special Characters

| Character | What it does | Example |
|---|---|---|
| `*` | Matches any value | `* * * * *` = every minute |
| `,` | List of specific values | `1,15 * * * *` = at minute 1 and 15 |
| `-` | Range of values | `1-5 * * * *` = minutes 1 through 5 |
| `/` | Step values | `*/5 * * * *` = every 5 minutes |
| `?` | No specific value (Quartz) | Used when day-of-month and day-of-week would conflict |
| `L` | Last (Quartz) | `L` in day field = last day of month |
| `W` | Nearest weekday (Quartz) | `15W` = closest weekday to the 15th |
| `#` | Nth occurrence (Quartz) | `3#2` = second Wednesday of the month |

## Expressions You'll Actually Memorize

| Expression | What it does |
|---|---|
| `* * * * *` | Every minute (great way to spike CPU if you're not careful) |
| `0 * * * *` | Every hour on the hour |
| `0 0 * * *` | Midnight every day |
| `0 9 * * 1-5` | 9 AM on weekdays |
| `0 0 1 * *` | First day of every month at midnight |
| `0 0 * * 0` | Every Sunday at midnight |
| `*/5 * * * *` | Every 5 minutes |
| `0 8,12,18 * * *` | Three times a day: 8 AM, noon, 6 PM |
| `0 0 1 1 *` | January 1st every year |

## Where Cron Shows Up

- **Linux crontab**: The original. 5-field format. Supports `@reboot`, `@daily`, `@weekly` macros.
- **Quartz Scheduler** (Java/Spring): 6-field format with seconds. Extra features like `L`, `W`, `#`.
- **Spring @Scheduled**: Uses cron expressions with an optional sixth field for seconds.
- **GitHub Actions**: 5-field UTC cron. The `schedule` trigger in workflows uses this.
- **Kubernetes CronJob**: 5-field format in the `schedule` field of a CronJob manifest.
- **node-cron** (Node.js): 5-field format, timezone support via options.

## Gotchas That Burn People

1. **Timezone**: Cron runs in the server's local timezone by default. If your server is UTC and you write `0 9 * * *` thinking it's 9 AM your time, it's actually running at whatever 9 UTC is for you. GitHub Actions cron is always UTC.
2. **Day-of-month vs day-of-week**: In standard cron, if you specify both day-of-month and day-of-week, the job runs when EITHER matches. Not both. This trips people up constantly. Quartz fixes this with `?`.
3. **Minimum granularity is 1 minute**: Standard cron can't do "every 30 seconds." You need Quartz or a custom loop for sub-minute scheduling.
4. **Missed runs**: If the server is down when a job was supposed to fire, it won't retroactively run when it comes back up. Anacron handles this for daily/weekly/monthly jobs on Linux.

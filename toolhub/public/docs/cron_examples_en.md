# Cron Expression Examples in Real Code

Here's how cron expressions look in the frameworks and tools you actually use.

## Quick Reference

| Expression | Meaning | Where you'd use it |
|---|---|---|
| `* * * * *` | Every minute | Health checks, metrics collection |
| `*/5 * * * *` | Every 5 minutes | Cache refresh, queue processing |
| `0 * * * *` | Every hour | Stats aggregation |
| `0 0 * * *` | Midnight daily | Log rotation, daily backups |
| `0 9 * * 1-5` | 9 AM weekdays | Morning reports, reminders |
| `0 0 * * 0` | Sunday midnight | Weekly reports |
| `0 0 1 * *` | 1st of month | Monthly billing |
| `0 0 1 1 *` | Jan 1 yearly | Annual reports |

## Spring Boot with @Scheduled

```java
@Component
public class ScheduledTasks {

    // 8 AM daily report
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendMorningReport() {
        reportService.generateAndSend();
    }

    // Every 5 minutes: clean expired sessions
    @Scheduled(cron = "0 */5 * * * ?")
    public void cleanExpiredSessions() {
        sessionService.removeExpired();
    }

    // Monday 9 AM weekly report
    @Scheduled(cron = "0 0 9 ? * MON")
    public void sendWeeklyReport() {
        weeklyReportService.generate();
    }

    // Last day of month 5 PM: billing settlement
    @Scheduled(cron = "0 0 17 L * ?")
    public void sendMonthlySettlement() {
        billingService.sendSettlementNotice();
    }
}
```

Note the `?` in the day-of-week or day-of-month field -- Quartz requires one of them to be `?` when you specify the other.

## Node.js (node-cron)

```javascript
const cron = require('node-cron');

// Daily backup at 2 AM (New York time)
cron.schedule('0 2 * * *', () => {
  console.log('Starting daily backup...');
  backupService.run();
}, {
  timezone: 'America/New_York'
});

// Every 10 minutes: check pending queue
cron.schedule('*/10 * * * *', async () => {
  const pending = await Queue.getPending();
  if (pending.length > 0) {
    await processQueue(pending);
  }
});

// Business hours only: sync data every hour 9-6 weekdays
cron.schedule('0 9-18 * * 1-5', () => {
  syncService.syncFromUpstream();
});
```

node-cron's `timezone` option is important -- without it the cron runs in whatever timezone the server process uses, which may not be what you expect.

## Linux crontab

```bash
# Edit with: crontab -e

# Database backup at 3 AM
0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

# Health check every 5 minutes
*/5 * * * * /opt/scripts/health-check.sh

# Weekday reminder at 9 AM
0 9 * * 1-5 /usr/local/bin/send-reminder.py

# Clean logs older than 30 days on the 1st
0 0 1 * * find /var/log/app -mtime +30 -delete

# Full backup every Sunday at 2 AM (using @weekly macro)
@weekly /usr/local/bin/full-backup.sh
```

The `>> /var/log/backup.log 2>&1` pattern redirects both stdout and stderr to a log file. Without it, cron emails the output to the user -- fine for a personal server, annoying at scale.

## GitHub Actions

```yaml
name: Daily Report

on:
  schedule:
    # Runs at 0:00 UTC every day
    - cron: '0 0 * * *'

  workflow_dispatch:  # Manual trigger too

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate report
        run: node scripts/generate-report.js
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: daily-report
          path: report.html
```

GitHub Actions cron is always UTC. No timezone option. Schedule triggers can also be delayed during high load periods -- don't rely on them for time-sensitive operations.

## Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  schedule: "0 1 * * *"        # 1 AM daily
  successfulJobsHistoryLimit: 3  # Keep last 3 successes
  failedJobsHistoryLimit: 1      # Keep last 1 failure
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: backup-tool:latest
            command: ["/bin/sh", "-c", "pg_dump $DB_URL > /backup/$(date +%Y%m%d).sql"]
            env:
            - name: DB_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
          restartPolicy: OnFailure
```

`successfulJobsHistoryLimit` and `failedJobsHistoryLimit` control how many completed/failed pod records kubectl keeps around. Default is 3 for successes, 1 for failures, but adjust based on your debugging needs.

## Three Common Pitfalls (and How to Fix Them)

### Timezone confusion

```bash
# Problem: Server is UTC, you thought it was local time
0 9 * * * /scripts/task.sh  # Actually runs at 9:00 UTC

# Fix: Set timezone in crontab or scheduler config
CRON_TZ=America/New_York
0 9 * * * /scripts/task.sh  # Now 9:00 AM New York time
```

### Month-end dates that don't exist

```bash
# Problem: Runs on the 31st -- but February and April don't have one
0 0 31 * * /scripts/task.sh  # Silently skipped in short months

# Fix: Use Quartz's L field for "last day of month"
0 0 0 L * ?  # Always the last day, regardless of month length
```

### Concurrent overlapping runs

```bash
# Problem: Task takes 30 minutes but triggers every 10 minutes
*/10 * * * * /scripts/long-task.sh  # Soon you have 3 copies running

# Fix: flock prevents concurrent execution
*/10 * * * * flock -n /tmp/task.lock /scripts/long-task.sh
```

`flock -n` exits immediately if it can't acquire the lock, so overlapping runs just get skipped rather than piling up.

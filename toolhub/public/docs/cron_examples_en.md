# Cron Expression Parser - Examples

## Common Cron Expression Reference

### Basic Examples

| Expression | Meaning | Use Case |
|-----------|---------|---------|
| `* * * * *` | Every minute | High-frequency status checks |
| `*/5 * * * *` | Every 5 minutes | Cache refresh, health checks |
| `0 * * * *` | Every hour on the hour | Statistics aggregation |
| `0 0 * * *` | Every day at midnight | Log cleanup, data backup |
| `0 9 * * 1-5` | Weekdays at 9 AM | Workday reminders |
| `0 0 * * 0` | Every Sunday at midnight | Weekly report generation |
| `0 0 1 * *` | 1st of every month at midnight | Monthly billing |
| `0 0 1 1 *` | January 1st every year | Annual statistics |

---

## Example 1: Spring Boot Scheduled Tasks

```java
@Component
public class ScheduledTasks {

    // Send morning report at 8 AM every day
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendMorningReport() {
        reportService.generateAndSend();
    }

    // Clean expired sessions every 5 minutes
    @Scheduled(cron = "0 */5 * * * ?")
    public void cleanExpiredSessions() {
        sessionService.removeExpired();
    }

    // Send weekly report every Monday at 9 AM
    @Scheduled(cron = "0 0 9 ? * MON")
    public void sendWeeklyReport() {
        weeklyReportService.generate();
    }

    // Send monthly settlement notice on the last day of month at 5 PM
    @Scheduled(cron = "0 0 17 L * ?")
    public void sendMonthlySettlement() {
        billingService.sendSettlementNotice();
    }
}
```

---

## Example 2: Node.js Scheduled Tasks (node-cron)

```javascript
const cron = require('node-cron');

// Daily database backup at 2 AM
cron.schedule('0 2 * * *', () => {
  console.log('Starting daily data backup...');
  backupService.run();
}, {
  timezone: 'America/New_York'  // specify timezone
});

// Check pending queue every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  const pending = await Queue.getPending();
  if (pending.length > 0) {
    await processQueue(pending);
  }
});

// Sync data every hour on weekdays
cron.schedule('0 9-18 * * 1-5', () => {
  syncService.syncFromUpstream();
});
```

---

## Example 3: Linux crontab Configuration

```bash
# Edit crontab: crontab -e

# Backup database every day at 3 AM
0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

# Check service status every 5 minutes
*/5 * * * * /opt/scripts/health-check.sh

# Send email reminder on weekdays at 9 AM
0 9 * * 1-5 /usr/local/bin/send-reminder.py

# Clean logs older than 30 days on the 1st of every month
0 0 1 * * find /var/log/app -mtime +30 -delete

# Full backup every Sunday at 2 AM
@weekly /usr/local/bin/full-backup.sh
```

---

## Example 4: GitHub Actions Scheduled Workflow

```yaml
name: Daily Report

on:
  # Runs at 0:00 UTC every day
  schedule:
    - cron: '0 0 * * *'

  # Also supports manual trigger
  workflow_dispatch:

jobs:
  generate-report:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Generate daily report
        run: node scripts/generate-report.js

      - name: Upload report
        uses: actions/upload-artifact@v3
        with:
          name: daily-report
          path: report.html
```

---

## Example 5: Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  # Run at 1 AM every day
  schedule: "0 1 * * *"

  # Keep last 3 successful job records
  successfulJobsHistoryLimit: 3

  # Keep last 1 failed job record
  failedJobsHistoryLimit: 1

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

---

## Common Pitfalls and Solutions

### Pitfall 1: Timezone Confusion

```bash
# Problem: Server is in UTC, set "9 AM daily", but runs at a different local time
0 9 * * * /scripts/task.sh  # Runs at 9:00 UTC

# Solution: Set timezone at the top of crontab or use environment variable
CRON_TZ=America/New_York
0 9 * * * /scripts/task.sh  # Now runs at 9:00 AM New York time
```

### Pitfall 2: Month-end Date Field

```bash
# Problem: Set to run on the 31st, but Feb, Apr, etc. have no 31st
0 0 31 * * /scripts/task.sh  # Skipped in months without day 31

# Solution: Use Quartz L field for last day of month
0 0 0 L * ?  # Last day of every month (Quartz format)
```

### Pitfall 3: Concurrent Execution

```bash
# Problem: Task takes 30 min, triggers every 10 min, causing concurrent runs
*/10 * * * * /scripts/long-task.sh

# Solution: Use flock to prevent concurrency
*/10 * * * * flock -n /tmp/task.lock /scripts/long-task.sh


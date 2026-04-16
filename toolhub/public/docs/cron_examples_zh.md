# Cron 表达式解析 - 代码示例

## 常用 Cron 表达式速查表

### 基础示例

| 表达式 | 含义 | 应用场景 |
|--------|------|---------|
| `* * * * *` | 每分钟 | 高频状态检查 |
| `*/5 * * * *` | 每5分钟 | 缓存刷新、健康检查 |
| `0 * * * *` | 每小时整点 | 统计汇总 |
| `0 0 * * *` | 每天凌晨 | 日志清理、数据备份 |
| `0 9 * * 1-5` | 工作日上午9点 | 工作日提醒 |
| `0 0 * * 0` | 每周日凌晨 | 周报生成 |
| `0 0 1 * *` | 每月1号凌晨 | 月度账单 |
| `0 0 1 1 *` | 每年1月1日 | 年度统计 |

---

## 示例 1：Spring Boot 定时任务

```java
@Component
public class ScheduledTasks {

    // 每天早上8点发送晨报
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendMorningReport() {
        reportService.generateAndSend();
    }

    // 每5分钟清理过期会话
    @Scheduled(cron = "0 */5 * * * ?")
    public void cleanExpiredSessions() {
        sessionService.removeExpired();
    }

    // 每周一上午9点发送周报
    @Scheduled(cron = "0 0 9 ? * MON")
    public void sendWeeklyReport() {
        weeklyReportService.generate();
    }

    // 每月最后一天下午5点发结账通知
    @Scheduled(cron = "0 0 17 L * ?")
    public void sendMonthlySettlement() {
        billingService.sendSettlementNotice();
    }
}
```

---

## 示例 2：Node.js 定时任务（node-cron）

```javascript
const cron = require('node-cron');

// 每天凌晨2点进行数据备份
cron.schedule('0 2 * * *', () => {
  console.log('开始每日数据备份...');
  backupService.run();
}, {
  timezone: 'Asia/Shanghai'  // 指定时区
});

// 每10分钟检查待处理队列
cron.schedule('*/10 * * * *', async () => {
  const pending = await Queue.getPending();
  if (pending.length > 0) {
    await processQueue(pending);
  }
});

// 工作日每小时同步数据
cron.schedule('0 9-18 * * 1-5', () => {
  syncService.syncFromUpstream();
});
```

---

## 示例 3：Linux crontab 配置

```bash
# 编辑 crontab: crontab -e

# 每天凌晨3点备份数据库
0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

# 每5分钟检查服务状态
*/5 * * * * /opt/scripts/health-check.sh

# 工作日早上9点发送邮件提醒
0 9 * * 1-5 /usr/local/bin/send-reminder.py

# 每月1号凌晨清理30天前的日志
0 0 1 * * find /var/log/app -mtime +30 -delete

# 每周日凌晨2点全量备份（重启后也执行）
@weekly /usr/local/bin/full-backup.sh
```

---

## 示例 4：GitHub Actions 定时工作流

```yaml
name: Daily Report

on:
  # 每天UTC时间0点（北京时间8点）运行
  schedule:
    - cron: '0 0 * * *'

  # 也支持手动触发
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

## 示例 5：Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  # 每天凌晨1点执行
  schedule: "0 1 * * *"

  # 保留最近3次成功记录
  successfulJobsHistoryLimit: 3

  # 保留最近1次失败记录
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

## 常见坑和解决方案

### 坑1：时区混乱

```bash
# 问题：服务器在UTC时区，设置了"每天9点"，实际执行是下午5点（北京时间）
0 9 * * * /scripts/task.sh  # 实际执行是北京时间17:00

# 解决：在命令中指定时区，或在crontab顶部设置
CRON_TZ=Asia/Shanghai
0 9 * * * /scripts/task.sh  # 现在是北京时间9:00
```

### 坑2：月末的日期字段

```bash
# 问题：每月31号执行，但2月、4月等没有31号
0 0 31 * * /scripts/task.sh  # 某些月份不执行

# 解决：使用 Quartz 的 L 字段表示月最后一天
0 0 0 L * ?  # 每月最后一天（Quartz格式）
```

### 坑3：并发执行

```bash
# 问题：任务耗时30分钟，但每10分钟触发一次，导致并发
*/10 * * * * /scripts/long-task.sh

# 解决：使用 flock 防止并发
*/10 * * * * flock -n /tmp/task.lock /scripts/long-task.sh


# Cron 表达式实际代码示例

各种框架和工具里 cron 表达式的真实写法。

## 速查表

| 表达式 | 含义 | 用在哪 |
|---|---|---|
| `* * * * *` | 每分钟 | 健康检查、指标采集 |
| `*/5 * * * *` | 每 5 分钟 | 缓存刷新、队列处理 |
| `0 * * * *` | 每小时 | 统计汇总 |
| `0 0 * * *` | 每天凌晨 | 日志轮转、日备份 |
| `0 9 * * 1-5` | 工作日上午 9 点 | 晨报、提醒 |
| `0 0 * * 0` | 每周日凌晨 | 周报 |
| `0 0 1 * *` | 每月 1 号 | 月度账单 |
| `0 0 1 1 *` | 每年 1 月 1 日 | 年报 |

## Spring Boot @Scheduled

```java
@Component
public class ScheduledTasks {

    // 每天早 8 点发晨报
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendMorningReport() {
        reportService.generateAndSend();
    }

    // 每 5 分钟清理过期会话
    @Scheduled(cron = "0 */5 * * * ?")
    public void cleanExpiredSessions() {
        sessionService.removeExpired();
    }

    // 每周一上午 9 点周报
    @Scheduled(cron = "0 0 9 ? * MON")
    public void sendWeeklyReport() {
        weeklyReportService.generate();
    }

    // 每月最后一天下午 5 点结算
    @Scheduled(cron = "0 0 17 L * ?")
    public void sendMonthlySettlement() {
        billingService.sendSettlementNotice();
    }
}
```

注意日期和星期字段里的 `?` -- 在 Quartz 里指定了一个另一个就必须用 `?`，不然会有歧义。

## Node.js（node-cron）

```javascript
const cron = require('node-cron');

// 每天凌晨 2 点备份（上海时间）
cron.schedule('0 2 * * *', () => {
  console.log('开始每日备份...');
  backupService.run();
}, {
  timezone: 'Asia/Shanghai'
});

// 每 10 分钟检查待处理队列
cron.schedule('*/10 * * * *', async () => {
  const pending = await Queue.getPending();
  if (pending.length > 0) {
    await processQueue(pending);
  }
});

// 工作日 9 点到 18 点每小时同步
cron.schedule('0 9-18 * * 1-5', () => {
  syncService.syncFromUpstream();
});
```

node-cron 的 `timezone` 选项很重要 -- 不指定的话用服务器进程的时区，可能跟你预期的不一样。

## Linux crontab

```bash
# 编辑：crontab -e

# 每天凌晨 3 点备份数据库
0 3 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1

# 每 5 分钟检查服务状态
*/5 * * * * /opt/scripts/health-check.sh

# 工作日 9 点发提醒
0 9 * * 1-5 /usr/local/bin/send-reminder.py

# 每月 1 号清理 30 天前的日志
0 0 1 * * find /var/log/app -mtime +30 -delete

# 每周日 2 点全量备份（用 @weekly 宏）
@weekly /usr/local/bin/full-backup.sh
```

`>> /var/log/backup.log 2>&1` 把标准输出和标准错误都重定向到日志文件。不加的话 cron 会给用户发邮件 -- 个人服务器无所谓，规模化部署就很烦了。

## GitHub Actions

```yaml
name: Daily Report

on:
  schedule:
    # 每天 UTC 0 点执行
    - cron: '0 0 * * *'

  workflow_dispatch:  # 也支持手动触发

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

GitHub Actions 的 cron 永远是 UTC 时间，没有时区选项。高峰期调度可能延迟执行 -- 别依赖它做严格时间敏感的操作。

## Kubernetes CronJob

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: database-backup
spec:
  schedule: "0 1 * * *"        # 每天凌晨 1 点
  successfulJobsHistoryLimit: 3  # 保留最近 3 次成功
  failedJobsHistoryLimit: 1      # 保留最近 1 次失败
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

`successfulJobsHistoryLimit` 和 `failedJobsHistoryLimit` 控制 kubectl 保留多少条完成/失败的 pod 记录，默认成功 3 条失败 1 条，按你的排查需求调整。

## 三个常见坑（和解决方案）

### 时区混乱

```bash
# 问题：服务器 UTC，你以为写的是北京时间
0 9 * * * /scripts/task.sh  # 实际是 UTC 9:00，北京时间 17:00

# 解决：crontab 顶部或调度器配置里指定时区
CRON_TZ=Asia/Shanghai
0 9 * * * /scripts/task.sh  # 现在是北京时间 9:00
```

### 月末日期不存在

```bash
# 问题：每月 31 号执行，但 2 月、4 月等没有 31 号
0 0 31 * * /scripts/task.sh  # 小月直接跳过

# 解决：Quartz 用 L 表示"当月最后一天"
0 0 0 L * ?  # 每月最后一天，不管大小月
```

### 并发重叠执行

```bash
# 问题：任务要跑 30 分钟，但每 10 分钟触发一次
*/10 * * * * /scripts/long-task.sh  # 很快就三个实例同时跑

# 解决：flock 防止并发
*/10 * * * * flock -n /tmp/task.lock /scripts/long-task.sh
```

`flock -n` 拿不到锁直接退出，重叠的触发会被跳过而不是堆积。

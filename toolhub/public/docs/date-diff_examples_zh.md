# 日期差值 — 代码示例

## JavaScript: 天为单位的差值

```javascript
function diffInDays(start, end) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  // 去掉时分秒，只按日期比——否则 1 月 1 日 23 点到 1 月 2 日 01 点会算成 0.08 天
  const a = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const b = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((b - a) / MS_PER_DAY)
}

diffInDays(new Date('2024-01-31'), new Date('2024-03-01'))  // 30
```

## JavaScript: 按日历的月差值

```javascript
function diffInCalendarMonths(start, end) {
  let months = (end.getFullYear() - start.getFullYear()) * 12
  months += end.getMonth() - start.getMonth()
  // 结束日的「日」早于起始日的「日」，说明最后一个月没走满，退一个月
  if (end.getDate() < start.getDate()) months--
  return months
}

diffInCalendarMonths(new Date('2024-01-31'), new Date('2024-03-01'))  // 1
```

## Python: 标准库 dateutil

```python
from datetime import date
from dateutil.relativedelta import relativedelta

start = date(2024, 1, 31)
end = date(2024, 3, 1)

rd = relativedelta(end, start)
print(f"{rd.years}年 {rd.months}个月 {rd.days}天")  # 0年 1个月 1天

# 纯天数为
print((end - start).days)  # 30
```

## SQL: 两个日期列相差天数

```sql
-- 大多数数据库日期相减直接得天差
SELECT DATEDIFF(day, start_date, end_date) AS days
FROM orders;
```

## 记住

- 天及以下用时间戳，月和年必须走日历
- 涉及「N 个月后是哪天」一律有月末陷阱（1 月 31 日 + 1 个月）
- 只比日期时先抹掉时分秒，否则跨午夜的差值是小数

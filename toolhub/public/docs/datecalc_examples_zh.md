# 日期计算代码示例

## 基本日期操作

### 简单日期算术
```python
from datetime import date, datetime, timedelta

def basic_date_arithmetic():
    """基本日期加减法示例"""
    # 当前日期
    today = date.today()
    print(f"今天: {today}")
    
    # 添加天数
    tomorrow = today + timedelta(days=1)
    next_week = today + timedelta(weeks=1)
    next_month = today + timedelta(days=30)
    
    print(f"明天: {tomorrow}")
    print(f"下周: {next_week}")
    print(f"下个月: {next_month}")
    
    # 减去天数
    yesterday = today - timedelta(days=1)
    last_week = today - timedelta(weeks=1)
    last_month = today - timedelta(days=30)
    
    print(f"昨天: {yesterday}")
    print(f"上周: {last_week}")
    print(f"上个月: {last_month}")
    
    # 日期差值
    days_diff = (tomorrow - yesterday).days
    print(f"昨天和明天之间的天数: {days_diff}")

basic_date_arithmetic()
```

### 日期范围生成
```python
def date_range_examples():
    """生成日期范围和序列"""
    start_date = date(2024, 3, 1)
    end_date = date(2024, 3, 31)
    
    # 每日范围
    current_date = start_date
    daily_dates = []
    while current_date <= end_date:
        daily_dates.append(current_date)
        current_date += timedelta(days=1)
    
    print(f"3月份的每日日期: {len(daily_dates)} 天")
    print(f"前5天: {daily_dates[:5]}")
    
    # 每周范围
    weekly_dates = []
    current_date = start_date
    while current_date <= end_date:
        weekly_dates.append(current_date)
        current_date += timedelta(weeks=1)
    
    print(f"每周日期: {len(weekly_dates)} 周")
    print(f"每周日期: {weekly_dates}")
    
    # 工作日范围（排除周末）
    business_dates = []
    current_date = start_date
    while current_date <= end_date:
        if current_date.weekday() < 5:  # 周一到周五
            business_dates.append(current_date)
        current_date += timedelta(days=1)
    
    print(f"3月份的工作日: {len(business_dates)} 天")

date_range_examples()
```

### 相对日期计算
```python
def relative_date_examples():
    """从当前日期计算相对日期"""
    today = date.today()
    
    # 常见相对日期
    relative_dates = {
        "昨天": today - timedelta(days=1),
        "明天": today + timedelta(days=1),
        "下周": today + timedelta(weeks=1),
        "上周": today - timedelta(weeks=1),
        "下个月": today + timedelta(days=30),
        "上个月": today - timedelta(days=30),
        "明年": today + timedelta(days=365),
        "去年": today - timedelta(days=365)
    }
    
    print("从今天开始的相对日期:")
    for description, calculated_date in relative_dates.items():
        print(f"{description}: {calculated_date}")
    
    # N天前/后
    for n in [3, 7, 14, 30, 90]:
        future_date = today + timedelta(days=n)
        past_date = today - timedelta(days=n)
        print(f"{n}天后: {future_date}")
        print(f"{n}天前: {past_date}")

relative_date_examples()
```

## 高级日期计算

### 工作日计算
```python
def business_day_examples():
    """计算工作日（排除周末）"""
    def add_business_days(start_date, business_days):
        """向日期添加工作日"""
        current_date = start_date
        days_added = 0
        
        while days_added < business_days:
            current_date += timedelta(days=1)
            # 跳过周末（周六=5，周日=6）
            if current_date.weekday() < 5:
                days_added += 1
        
        return current_date
    
    def count_business_days(start_date, end_date):
        """计算两个日期之间的工作日"""
        business_days = 0
        current_date = start_date
        
        while current_date <= end_date:
            if current_date.weekday() < 5:  # 周一到周五
                business_days += 1
            current_date += timedelta(days=1)
        
        return business_days
    
    # 测试工作日计算
    start_date = date(2024, 3, 15)  # 周五
    print(f"开始日期: {start_date}")
    
    # 添加工作日
    for days in [1, 3, 5, 10]:
        result = add_business_days(start_date, days)
        print(f"开始 + {days} 个工作日: {result}")
    
    # 计算工作日
    end_date = date(2024, 3, 25)
    business_days = count_business_days(start_date, end_date)
    print(f"{start_date} 和 {end_date} 之间的工作日: {business_days}")

business_day_examples()
```

### 月份和年份计算
```python
def month_year_examples():
    """高级月份和年份计算"""
    from dateutil import relativedelta
    
    base_date = date(2024, 3, 15)
    print(f"基准日期: {base_date}")
    
    # 月份计算
    next_month = base_date + relativedelta(months=1)
    last_month = base_date - relativedelta(months=1)
    three_months_later = base_date + relativedelta(months=3)
    six_months_ago = base_date - relativedelta(months=6)
    
    print(f"下个月: {next_month}")
    print(f"上个月: {last_month}")
    print(f"三个月后: {three_months_later}")
    print(f"六个月前: {six_months_ago}")
    
    # 年份计算
    next_year = base_date + relativedelta(years=1)
    last_year = base_date - relativedelta(years=1)
    five_years_later = base_date + relativedelta(years=5)
    
    print(f"明年: {next_year}")
    print(f"去年: {last_year}")
    print(f"五年后: {five_years_later}")
    
    # 组合计算
    two_months_three_years_later = base_date + relativedelta(months=2, years=3)
    print(f"两个月零三年后: {two_months_three_years_later}")

month_year_examples()
```

### 日历导航
```python
def calendar_navigation_examples():
    """导航日历周期和边界"""
    def get_month_boundaries(target_date):
        """获取月份的第一天和最后一天"""
        first_day = target_date.replace(day=1)
        if target_date.month == 12:
            next_month = target_date.replace(year=target_date.year + 1, month=1, day=1)
        else:
            next_month = target_date.replace(month=target_date.month + 1, day=1)
        last_day = next_month - timedelta(days=1)
        return first_day, last_day
    
    def get_quarter_boundaries(target_date):
        """获取季度的开始和结束日期"""
        quarter = (target_date.month - 1) // 3 + 1
        quarter_start_month = (quarter - 1) * 3 + 1
        quarter_start = target_date.replace(month=quarter_start_month, day=1)
        
        if quarter == 4:
            quarter_end = target_date.replace(year=target_date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            quarter_end = target_date.replace(month=quarter_start_month + 3, day=1) - timedelta(days=1)
        
        return quarter_start, quarter_end
    
    def get_year_boundaries(target_date):
        """获取年份的开始和结束日期"""
        year_start = target_date.replace(month=1, day=1)
        year_end = target_date.replace(month=12, day=31)
        return year_start, year_end
    
    # 测试日历导航
    test_date = date(2024, 3, 15)
    print(f"测试日期: {test_date}")
    
    # 月份边界
    month_start, month_end = get_month_boundaries(test_date)
    print(f"月份开始: {month_start}")
    print(f"月份结束: {month_end}")
    
    # 季度边界
    quarter_start, quarter_end = get_quarter_boundaries(test_date)
    print(f"季度开始: {quarter_start}")
    print(f"季度结束: {quarter_end}")
    
    # 年份边界
    year_start, year_end = get_year_boundaries(test_date)
    print(f"年份开始: {year_start}")
    print(f"年份结束: {year_end}")

calendar_navigation_examples()
``` 
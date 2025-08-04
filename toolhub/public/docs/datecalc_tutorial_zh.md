# 日期计算使用教程

## 环境设置

### 前置条件
- Python 3.6+ 包含 datetime 和 dateutil 模块
- 理解日期算术概念
- 基本日历系统知识
- 熟悉工作日计算

### 库安装
```python
# Python 内置模块（无需安装）
import datetime
from datetime import date, datetime, timedelta

# 可选：安装 dateutil 进行高级日期操作
# pip install python-dateutil
from dateutil import relativedelta, parser

# 可选：安装 pandas 进行高级日期操作
# pip install pandas
import pandas as pd
```

## 基本概念

### 日期算术基础
```python
def date_arithmetic_basics():
    """理解基本日期算术"""
    # 当前日期
    today = date.today()
    print(f"今天: {today}")
    
    # 添加天数
    tomorrow = today + timedelta(days=1)
    print(f"明天: {tomorrow}")
    
    # 减去天数
    yesterday = today - timedelta(days=1)
    print(f"昨天: {yesterday}")
    
    # 添加周数
    next_week = today + timedelta(weeks=1)
    print(f"下周: {next_week}")
    
    # 日期差值
    days_diff = (tomorrow - yesterday).days
    print(f"昨天和明天之间的天数: {days_diff}")

date_arithmetic_basics()
```

### 时间单位和间隔
```python
def time_units_examples():
    """使用不同的时间单位"""
    # 创建基准日期
    base_date = date(2024, 1, 15)
    print(f"基准日期: {base_date}")
    
    # 添加不同的时间单位
    time_units = {
        "days": timedelta(days=5),
        "weeks": timedelta(weeks=2),
        "hours": timedelta(hours=24),
        "minutes": timedelta(minutes=1440),  # 24小时
        "seconds": timedelta(seconds=86400)   # 24小时
    }
    
    for unit, delta in time_units.items():
        result = base_date + delta
        print(f"基准 + {unit}: {result}")

time_units_examples()
```

## 基本日期计算

### 简单日期加减法
```python
def simple_date_calculations():
    """基本日期加减法"""
    # 开始日期
    start_date = date(2024, 3, 15)
    print(f"开始日期: {start_date}")
    
    # 添加各种间隔
    intervals = [1, 7, 30, 365]  # 天、周、月、年
    
    for days in intervals:
        future_date = start_date + timedelta(days=days)
        past_date = start_date - timedelta(days=days)
        print(f"+{days} 天: {future_date}")
        print(f"-{days} 天: {past_date}")
    
    # 计算日期范围
    end_date = start_date + timedelta(days=30)
    date_range = (end_date - start_date).days
    print(f"日期范围: {date_range} 天")

simple_date_calculations()
```

### 相对日期计算
```python
def relative_date_calculations():
    """计算相对日期"""
    today = date.today()
    
    # 常见相对日期
    relative_dates = {
        "yesterday": today - timedelta(days=1),
        "tomorrow": today + timedelta(days=1),
        "next_week": today + timedelta(weeks=1),
        "last_week": today - timedelta(weeks=1),
        "next_month": today + timedelta(days=30),
        "last_month": today - timedelta(days=30)
    }
    
    for description, calculated_date in relative_dates.items():
        print(f"{description}: {calculated_date}")
    
    # N天前/后
    for n in [3, 7, 14, 30]:
        future_date = today + timedelta(days=n)
        past_date = today - timedelta(days=n)
        print(f"{n} 天后: {future_date}")
        print(f"{n} 天前: {past_date}")

relative_date_calculations()
```

### 月份和年份计算
```python
def month_year_calculations():
    """使用 dateutil 进行高级月份和年份计算"""
    from dateutil import relativedelta
    
    base_date = date(2024, 3, 15)
    print(f"基准日期: {base_date}")
    
    # 月份计算
    next_month = base_date + relativedelta(months=1)
    last_month = base_date - relativedelta(months=1)
    print(f"下个月: {next_month}")
    print(f"上个月: {last_month}")
    
    # 年份计算
    next_year = base_date + relativedelta(years=1)
    last_year = base_date - relativedelta(years=1)
    print(f"明年: {next_year}")
    print(f"去年: {last_year}")
    
    # 组合计算
    three_months_later = base_date + relativedelta(months=3)
    six_months_ago = base_date - relativedelta(months=6)
    print(f"三个月后: {three_months_later}")
    print(f"六个月前: {six_months_ago}")

month_year_calculations()
```

## 高级日期计算

### 工作日计算
```python
def business_day_calculations():
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

business_day_calculations()
```

### 日历导航
```python
def calendar_navigation():
    """导航日历周期"""
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
        """获取季度开始和结束日期"""
        quarter = (target_date.month - 1) // 3 + 1
        quarter_start_month = (quarter - 1) * 3 + 1
        quarter_start = target_date.replace(month=quarter_start_month, day=1)
        
        if quarter == 4:
            quarter_end = target_date.replace(year=target_date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            quarter_end = target_date.replace(month=quarter_start_month + 3, day=1) - timedelta(days=1)
        
        return quarter_start, quarter_end
    
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

calendar_navigation()
```

### 处理日期范围
```python
def date_range_operations():
    """处理日期范围和间隔"""
    def generate_date_range(start_date, end_date, step_days=1):
        """生成日期范围"""
        current_date = start_date
        dates = []
        
        while current_date <= end_date:
            dates.append(current_date)
            current_date += timedelta(days=step_days)
        
        return dates
    
    def calculate_date_statistics(date_list):
        """计算日期列表的统计信息"""
        if not date_list:
            return {}
        
        total_days = (date_list[-1] - date_list[0]).days
        business_days = sum(1 for d in date_list if d.weekday() < 5)
        weekends = sum(1 for d in date_list if d.weekday() >= 5)
        
        return {
            "total_days": total_days,
            "business_days": business_days,
            "weekends": weekends,
            "date_count": len(date_list)
        }
    
    # 测试日期范围操作
    start_date = date(2024, 3, 1)
    end_date = date(2024, 3, 31)
    
    # 生成每日范围
    daily_range = generate_date_range(start_date, end_date)
    print(f"每日范围: {len(daily_range)} 天")
    
    # 生成每周范围
    weekly_range = generate_date_range(start_date, end_date, 7)
    print(f"每周范围: {len(weekly_range)} 周")
    
    # 计算统计信息
    stats = calculate_date_statistics(daily_range)
    print(f"2024年3月统计: {stats}")

date_range_operations()
```

## 金融和业务计算

### 付款计划计算
```python
def payment_schedule_calculations():
    """计算付款计划和到期日"""
    def calculate_payment_schedule(principal, annual_rate, months, start_date):
        """计算月付款计划"""
        monthly_rate = annual_rate / 12 / 100
        monthly_payment = principal * (monthly_rate * (1 + monthly_rate)**months) / ((1 + monthly_rate)**months - 1)
        
        schedule = []
        remaining_balance = principal
        current_date = start_date
        
        for month in range(1, months + 1):
            interest = remaining_balance * monthly_rate
            principal_payment = monthly_payment - interest
            remaining_balance -= principal_payment
            
            schedule.append({
                "payment_date": current_date,
                "payment_number": month,
                "payment_amount": monthly_payment,
                "principal_payment": principal_payment,
                "interest_payment": interest,
                "remaining_balance": remaining_balance
            })
            
            current_date += relativedelta(months=1)
        
        return schedule
    
    # 测试付款计划
    principal = 10000
    annual_rate = 5.0
    months = 12
    start_date = date(2024, 4, 1)
    
    schedule = calculate_payment_schedule(principal, annual_rate, months, start_date)
    
    print(f"${principal} 在 {annual_rate}% 年利率下的付款计划:")
    for payment in schedule[:3]:  # 显示前3次付款
        print(f"付款 {payment['payment_number']}: {payment['payment_date']} - ${payment['payment_amount']:.2f}")

payment_schedule_calculations()
```

### SLA和截止日期计算
```python
def sla_calculations():
    """计算SLA合规性和截止日期"""
    def calculate_sla_deadline(start_datetime, sla_hours, business_hours_only=True):
        """计算SLA截止日期"""
        if business_hours_only:
            # 营业时间：上午9点到下午5点，周一到周五
            current_datetime = start_datetime
            hours_remaining = sla_hours
            
            while hours_remaining > 0:
                current_datetime += timedelta(hours=1)
                
                # 检查是否在营业时间内
                if (current_datetime.weekday() < 5 and  # 周一到周五
                    9 <= current_datetime.hour < 17):  # 上午9点到下午5点
                    hours_remaining -= 1
                else:
                    # 如果超出时间则跳到下一个营业日
                    if current_datetime.hour >= 17:
                        current_datetime = current_datetime.replace(hour=9, minute=0, second=0)
                        current_datetime += timedelta(days=1)
                    elif current_datetime.weekday() >= 5:
                        current_datetime = current_datetime.replace(hour=9, minute=0, second=0)
                        current_datetime += timedelta(days=7 - current_datetime.weekday())
            
            return current_datetime
        else:
            # 24/7 SLA
            return start_datetime + timedelta(hours=sla_hours)
    
    # 测试SLA计算
    start_time = datetime(2024, 3, 15, 14, 30, 0)  # 周五下午2:30
    print(f"开始时间: {start_time}")
    
    # 4小时营业时间SLA
    business_deadline = calculate_sla_deadline(start_time, 4, business_hours_only=True)
    print(f"4小时营业时间SLA截止日期: {business_deadline}")
    
    # 4小时24/7 SLA
    continuous_deadline = calculate_sla_deadline(start_time, 4, business_hours_only=False)
    print(f"4小时24/7 SLA截止日期: {continuous_deadline}")

sla_calculations()
```

## 错误处理和验证

### 日期验证
```python
def date_validation():
    """验证日期输入并处理错误"""
    def is_valid_date(date_string):
        """检查字符串是否可以解析为有效日期"""
        try:
            parsed_date = parser.parse(date_string)
            return True, parsed_date.date()
        except (ValueError, TypeError):
            return False, None
    
    def is_business_day(check_date):
        """检查日期是否为工作日"""
        return check_date.weekday() < 5
    
    def validate_date_range(start_date, end_date):
        """验证开始日期在结束日期之前"""
        if start_date > end_date:
            return False, "开始日期必须在结束日期之前"
        return True, "有效日期范围"
    
    # 测试日期验证
    test_dates = ["2024-03-15", "2024-13-01", "invalid-date", "2024-02-30"]
    
    for date_str in test_dates:
        is_valid, parsed_date = is_valid_date(date_str)
        if is_valid:
            business_day = is_business_day(parsed_date)
            print(f"{date_str}: 有效日期，工作日: {business_day}")
        else:
            print(f"{date_str}: 无效日期")
    
    # 测试日期范围验证
    start = date(2024, 3, 15)
    end = date(2024, 3, 10)
    is_valid_range, message = validate_date_range(start, end)
    print(f"日期范围验证: {message}")

date_validation()
```

### 安全日期计算
```python
def safe_date_calculations():
    """带错误处理的安全日期计算"""
    def safe_add_days(base_date, days):
        """安全地向日期添加天数"""
        try:
            if not isinstance(base_date, date):
                return None, "基准日期必须是日期对象"
            if not isinstance(days, int):
                return None, "天数必须是整数"
            
            result = base_date + timedelta(days=days)
            return result, None
        except Exception as e:
            return None, f"错误: {str(e)}"
    
    def safe_date_difference(date1, date2):
        """安全地计算两个日期之间的差值"""
        try:
            if not isinstance(date1, date) or not isinstance(date2, date):
                return None, "两个参数都必须是日期对象"
            
            difference = (date2 - date1).days
            return difference, None
        except Exception as e:
            return None, f"错误: {str(e)}"
    
    # 测试安全计算
    test_cases = [
        (date(2024, 3, 15), 5),
        (date(2024, 3, 15), -3),
        ("2024-03-15", 5),  # 无效输入
        (date(2024, 3, 15), "five")  # 无效输入
    ]
    
    for base_date, days in test_cases:
        result, error = safe_add_days(base_date, days)
        if error:
            print(f"向 {base_date} 添加 {days} 天时出错: {error}")
        else:
            print(f"{base_date} + {days} 天 = {result}")

safe_date_calculations()
```

## 性能和优化

### 批量日期处理
```python
def batch_date_processing():
    """高效处理多个日期计算"""
    import time
    
    # 生成测试数据
    base_date = date(2024, 1, 1)
    test_dates = [base_date + timedelta(days=i) for i in range(1000)]
    
    # 批量添加天数
    start_time = time.time()
    future_dates = [d + timedelta(days=30) for d in test_dates]
    end_time = time.time()
    print(f"批量处理1000个日期: {end_time - start_time:.4f} 秒")
    
    # 批量工作日计算
    start_time = time.time()
    business_days = [d for d in test_dates if d.weekday() < 5]
    end_time = time.time()
    print(f"工作日过滤: {end_time - start_time:.4f} 秒")
    print(f"找到的工作日: {len(business_days)}")
    
    # 批量日期范围计算
    start_time = time.time()
    date_ranges = [(d, d + timedelta(days=7)) for d in test_dates[:100]]
    end_time = time.time()
    print(f"日期范围生成: {end_time - start_time:.4f} 秒")

batch_date_processing()
```

### 缓存策略
```python
def caching_strategies():
    """为日期计算实现缓存"""
    # 工作日计算的简单缓存
    business_day_cache = {}
    
    def cached_is_business_day(check_date):
        """带缓存的工作日检查"""
        date_key = check_date.isoformat()
        
        if date_key in business_day_cache:
            return business_day_cache[date_key]
        
        is_business = check_date.weekday() < 5
        business_day_cache[date_key] = is_business
        return is_business
    
    # 测试缓存
    test_dates = [date(2024, 3, 15 + i) for i in range(10)]
    
    print("测试工作日缓存:")
    for test_date in test_dates:
        is_business = cached_is_business_day(test_date)
        print(f"{test_date}: {'工作日' if is_business else '周末'}")
    
    print(f"缓存大小: {len(business_day_cache)}")

caching_strategies()
``` 
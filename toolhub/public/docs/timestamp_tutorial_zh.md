# 时间戳转换使用教程

## 环境设置

### 前置条件
- Python 3.6+ 和 datetime、time 模块
- 时区概念理解
- Unix时间戳基础知识
- ISO 8601格式熟悉度

### 库安装
```python
# Python内置模块（无需安装）
import datetime
import time
import calendar

# 可选：安装pytz用于时区处理
# pip install pytz
import pytz

# 可选：安装dateutil用于高级解析
# pip install python-dateutil
from dateutil import parser
```

## 基本概念

### 时间戳类型
```python
def timestamp_types():
    """理解不同的时间戳类型"""
    # 不同格式的当前时间
    now = datetime.datetime.now()
    
    # Unix时间戳（自纪元以来的秒数）
    unix_timestamp = int(time.time())
    print(f"Unix时间戳: {unix_timestamp}")
    
    # 毫秒级Unix时间戳
    unix_ms = int(time.time() * 1000)
    print(f"Unix时间戳（毫秒）: {unix_ms}")
    
    # ISO 8601格式
    iso_format = now.isoformat()
    print(f"ISO 8601: {iso_format}")
    
    # RFC 2822格式
    rfc_format = now.strftime("%a, %d %b %Y %H:%M:%S %z")
    print(f"RFC 2822: {rfc_format}")

timestamp_types()
```

### 时区感知
```python
def timezone_concepts():
    """理解时区概念"""
    # UTC时间
    utc_now = datetime.datetime.utcnow()
    print(f"UTC时间: {utc_now}")
    
    # 本地时间
    local_now = datetime.datetime.now()
    print(f"本地时间: {local_now}")
    
    # 时区感知的datetime
    import pytz
    utc_tz = pytz.UTC
    aware_utc = utc_tz.localize(utc_now)
    print(f"时区感知UTC: {aware_utc}")
    
    # 转换为不同时区
    pst = pytz.timezone('US/Pacific')
    pst_time = aware_utc.astimezone(pst)
    print(f"PST时间: {pst_time}")

timezone_concepts()
```

## 基本时间戳操作

### 当前时间戳生成
```python
def current_timestamp():
    """生成各种格式的当前时间戳"""
    # 当前Unix时间戳
    current_unix = int(time.time())
    print(f"当前Unix时间戳: {current_unix}")
    
    # 当前毫秒级时间戳
    current_ms = int(time.time() * 1000)
    print(f"当前时间戳（毫秒）: {current_ms}")
    
    # 当前微秒级时间戳
    current_us = int(time.time() * 1000000)
    print(f"当前时间戳（微秒）: {current_us}")
    
    # 带时区的ISO格式
    now = datetime.datetime.now()
    iso_with_tz = now.isoformat()
    print(f"带时区的ISO: {iso_with_tz}")

current_timestamp()
```

### 时间戳转日期时间
```python
def timestamp_to_datetime():
    """将时间戳转换为datetime对象"""
    # Unix时间戳
    unix_ts = 1640995200  # 2022-01-01 00:00:00 UTC
    
    # 转换为datetime（UTC）
    dt_utc = datetime.datetime.utcfromtimestamp(unix_ts)
    print(f"UTC datetime: {dt_utc}")
    
    # 转换为本地datetime
    dt_local = datetime.datetime.fromtimestamp(unix_ts)
    print(f"本地datetime: {dt_local}")
    
    # 转换为时区感知datetime
    import pytz
    utc_tz = pytz.UTC
    dt_aware = utc_tz.localize(datetime.datetime.utcfromtimestamp(unix_ts))
    print(f"时区感知: {dt_aware}")
    
    # 转换为特定时区
    pst = pytz.timezone('US/Pacific')
    dt_pst = dt_aware.astimezone(pst)
    print(f"PST datetime: {dt_pst}")

timestamp_to_datetime()
```

### 日期时间转时间戳
```python
def datetime_to_timestamp():
    """将datetime对象转换为时间戳"""
    # 创建datetime对象
    dt = datetime.datetime(2022, 1, 1, 12, 0, 0)
    print(f"Datetime: {dt}")
    
    # 转换为Unix时间戳
    unix_ts = int(dt.timestamp())
    print(f"Unix时间戳: {unix_ts}")
    
    # 转换为毫秒
    ms_ts = int(dt.timestamp() * 1000)
    print(f"毫秒: {ms_ts}")
    
    # 转换时区感知datetime
    import pytz
    utc_tz = pytz.UTC
    aware_dt = utc_tz.localize(dt)
    aware_ts = int(aware_dt.timestamp())
    print(f"时区感知时间戳: {aware_ts}")

datetime_to_timestamp()
```

## 高级时间戳操作

### 自定义格式解析
```python
def custom_format_parsing():
    """解析自定义格式的时间戳"""
    # 自定义日期字符串
    date_string = "2022-01-01 12:30:45"
    
    # 使用strptime解析
    dt = datetime.datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
    print(f"解析的datetime: {dt}")
    
    # 转换为时间戳
    timestamp = int(dt.timestamp())
    print(f"时间戳: {timestamp}")
    
    # 使用dateutil解析（更灵活）
    from dateutil import parser
    flexible_dt = parser.parse("Jan 1, 2022 12:30:45 PM")
    print(f"灵活解析: {flexible_dt}")
    
    # 处理各种格式
    formats = [
        "2022-01-01",
        "01/01/2022",
        "2022-01-01T12:30:45Z",
        "January 1, 2022"
    ]
    
    for date_str in formats:
        try:
            parsed = parser.parse(date_str)
            print(f"{date_str} -> {parsed}")
        except Exception as e:
            print(f"解析{date_str}时出错: {e}")

custom_format_parsing()
```

### 时区转换
```python
def timezone_conversion():
    """在时区之间转换时间戳"""
    # 创建时区感知datetime
    import pytz
    utc_tz = pytz.UTC
    utc_dt = utc_tz.localize(datetime.datetime(2022, 1, 1, 12, 0, 0))
    print(f"UTC datetime: {utc_dt}")
    
    # 转换为不同时区
    timezones = ['US/Pacific', 'US/Eastern', 'Europe/London', 'Asia/Tokyo']
    
    for tz_name in timezones:
        tz = pytz.timezone(tz_name)
        converted = utc_dt.astimezone(tz)
        print(f"{tz_name}: {converted}")
    
    # 处理DST转换
    dst_dt = utc_tz.localize(datetime.datetime(2022, 3, 13, 2, 0, 0))
    pst = pytz.timezone('US/Pacific')
    dst_converted = dst_dt.astimezone(pst)
    print(f"DST转换: {dst_converted}")

timezone_conversion()
```

### 精度处理
```python
def precision_handling():
    """处理不同的时间戳精度"""
    # 高精度时间戳
    precise_ts = 1640995200.123456
    
    # 转换为不同精度
    seconds = int(precise_ts)
    milliseconds = int(precise_ts * 1000)
    microseconds = int(precise_ts * 1000000)
    
    print(f"原始: {precise_ts}")
    print(f"秒: {seconds}")
    print(f"毫秒: {milliseconds}")
    print(f"微秒: {microseconds}")
    
    # 转换回带精度的datetime
    dt_precise = datetime.datetime.fromtimestamp(precise_ts)
    print(f"精确datetime: {dt_precise}")
    
    # 带微秒格式化
    formatted = dt_precise.strftime("%Y-%m-%d %H:%M:%S.%f")
    print(f"带微秒格式化: {formatted}")

precision_handling()
```

## 格式转换

### ISO 8601格式
```python
def iso_format_operations():
    """使用ISO 8601格式"""
    # 当前时间的ISO格式
    now = datetime.datetime.now()
    iso_now = now.isoformat()
    print(f"ISO格式: {iso_now}")
    
    # 解析ISO格式
    parsed_iso = datetime.datetime.fromisoformat(iso_now)
    print(f"解析的ISO: {parsed_iso}")
    
    # 带时区的ISO格式
    import pytz
    utc_tz = pytz.UTC
    utc_now = utc_tz.localize(datetime.datetime.utcnow())
    iso_utc = utc_now.isoformat()
    print(f"ISO UTC: {iso_utc}")
    
    # 自定义ISO格式
    custom_iso = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    print(f"自定义ISO: {custom_iso}")

iso_format_operations()
```

### RFC 2822格式
```python
def rfc_format_operations():
    """使用RFC 2822格式"""
    # 当前时间的RFC格式
    now = datetime.datetime.now()
    rfc_now = now.strftime("%a, %d %b %Y %H:%M:%S %z")
    print(f"RFC 2822: {rfc_now}")
    
    # 解析RFC格式
    rfc_string = "Sat, 01 Jan 2022 12:00:00 +0000"
    parsed_rfc = datetime.datetime.strptime(rfc_string, "%a, %d %b %Y %H:%M:%S %z")
    print(f"解析的RFC: {parsed_rfc}")
    
    # 转换为时间戳
    rfc_timestamp = int(parsed_rfc.timestamp())
    print(f"RFC时间戳: {rfc_timestamp}")

rfc_format_operations()
```

### 自定义格式化
```python
def custom_formatting():
    """自定义时间戳格式化"""
    now = datetime.datetime.now()
    
    # 各种自定义格式
    formats = {
        "仅日期": "%Y-%m-%d",
        "仅时间": "%H:%M:%S",
        "日期和时间": "%Y-%m-%d %H:%M:%S",
        "带时区": "%Y-%m-%d %H:%M:%S %z",
        "可读": "%B %d, %Y at %I:%M %p",
        "紧凑": "%Y%m%d_%H%M%S",
        "日志格式": "%Y-%m-%d %H:%M:%S.%f"
    }
    
    for format_name, format_string in formats.items():
        formatted = now.strftime(format_string)
        print(f"{format_name}: {formatted}")

custom_formatting()
```

## 错误处理和验证

### 时间戳验证
```python
def timestamp_validation():
    """验证时间戳输入"""
    def is_valid_unix_timestamp(timestamp):
        """检查时间戳是否为有效Unix时间戳"""
        try:
            # 检查是否为数字
            ts = float(timestamp)
            
            # 检查合理范围（1970-2100）
            min_ts = 0
            max_ts = 4102444800  # 2100-01-01
            
            return min_ts <= ts <= max_ts
        except (ValueError, TypeError):
            return False
    
    # 测试用例
    test_cases = [
        1640995200,      # 有效
        0,               # 有效（纪元）
        4102444800,      # 有效（2100）
        -1,              # 无效（负数）
        9999999999999,   # 无效（过大）
        "invalid",       # 无效（字符串）
        None             # 无效（None）
    ]
    
    for test_case in test_cases:
        is_valid = is_valid_unix_timestamp(test_case)
        print(f"{test_case}: {'有效' if is_valid else '无效'}")

timestamp_validation()
```

### 安全转换函数
```python
def safe_conversion():
    """带错误处理的安全时间戳转换"""
    def safe_timestamp_to_datetime(timestamp):
        """安全地将时间戳转换为datetime"""
        try:
            if isinstance(timestamp, str):
                timestamp = float(timestamp)
            
            dt = datetime.datetime.fromtimestamp(timestamp)
            return dt
        except (ValueError, TypeError, OSError) as e:
            print(f"转换错误: {e}")
            return None
    
    def safe_datetime_to_timestamp(dt):
        """安全地将datetime转换为时间戳"""
        try:
            if dt is None:
                return None
            
            timestamp = int(dt.timestamp())
            return timestamp
        except (ValueError, TypeError, OSError) as e:
            print(f"转换错误: {e}")
            return None
    
    # 测试安全转换
    test_timestamps = [1640995200, "1640995200", "invalid", None]
    
    for ts in test_timestamps:
        dt = safe_timestamp_to_datetime(ts)
        if dt:
            converted_back = safe_datetime_to_timestamp(dt)
            print(f"{ts} -> {dt} -> {converted_back}")

safe_conversion()
```

## 性能和优化

### 批量处理
```python
def batch_processing():
    """高效处理多个时间戳"""
    # 生成测试时间戳
    timestamps = [1640995200 + i for i in range(1000)]
    
    # 批量转换为datetime
    start_time = time.time()
    datetimes = [datetime.datetime.fromtimestamp(ts) for ts in timestamps]
    end_time = time.time()
    
    print(f"在{end_time - start_time:.4f}秒内转换了{len(timestamps)}个时间戳")
    
    # 批量格式化为ISO
    start_time = time.time()
    iso_formats = [dt.isoformat() for dt in datetimes]
    end_time = time.time()
    
    print(f"在{end_time - start_time:.4f}秒内格式化了{len(iso_formats)}个datetime")
    
    # 显示前几个结果
    for i in range(5):
        print(f"{timestamps[i]} -> {datetimes[i]} -> {iso_formats[i]}")

batch_processing()
```

### 缓存策略
```python
def caching_strategies():
    """实现时间戳转换的缓存"""
    # 时区转换的简单缓存
    timezone_cache = {}
    
    def cached_timezone_convert(dt, timezone_name):
        """带缓存的datetime转换"""
        cache_key = f"{dt.isoformat()}_{timezone_name}"
        
        if cache_key in timezone_cache:
            return timezone_cache[cache_key]
        
        # 执行转换
        import pytz
        tz = pytz.timezone(timezone_name)
        converted = dt.astimezone(tz)
        
        # 缓存结果
        timezone_cache[cache_key] = converted
        return converted
    
    # 测试缓存
    now = datetime.datetime.now()
    timezones = ['US/Pacific', 'US/Eastern', 'Europe/London']
    
    for tz in timezones:
        result = cached_timezone_convert(now, tz)
        print(f"{tz}: {result}")
    
    print(f"缓存大小: {len(timezone_cache)}")

caching_strategies()
```

## 测试和验证

### 往返测试
```python
def round_trip_testing():
    """测试时间戳转换往返"""
    # 测试用例
    test_cases = [
        datetime.datetime(2022, 1, 1, 12, 0, 0),
        datetime.datetime(2030, 12, 31, 23, 59, 59),
        datetime.datetime(1970, 1, 1, 0, 0, 0),
        datetime.datetime.now()
    ]
    
    for dt in test_cases:
        # 转换为时间戳
        timestamp = int(dt.timestamp())
        
        # 转换回datetime
        converted_dt = datetime.datetime.fromtimestamp(timestamp)
        
        # 比较
        is_equal = dt == converted_dt
        print(f"{dt} -> {timestamp} -> {converted_dt} -> {'✓' if is_equal else '✗'}")

round_trip_testing()
```

### 边界情况测试
```python
def edge_case_testing():
    """测试时间戳转换的边界情况"""
    # 测试闰年
    leap_year = datetime.datetime(2024, 2, 29, 12, 0, 0)
    leap_ts = int(leap_year.timestamp())
    print(f"闰年: {leap_year} -> {leap_ts}")
    
    # 测试DST转换
    dst_start = datetime.datetime(2022, 3, 13, 2, 0, 0)
    dst_ts = int(dst_start.timestamp())
    print(f"DST开始: {dst_start} -> {dst_ts}")
    
    # 测试纪元
    epoch = datetime.datetime(1970, 1, 1, 0, 0, 0)
    epoch_ts = int(epoch.timestamp())
    print(f"纪元: {epoch} -> {epoch_ts}")
    
    # 测试2038年边界
    boundary = datetime.datetime(2038, 1, 19, 3, 14, 7)
    boundary_ts = int(boundary.timestamp())
    print(f"2038边界: {boundary} -> {boundary_ts}")

edge_case_testing()
``` 
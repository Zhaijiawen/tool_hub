# 时间戳转换代码示例

## 基本时间戳操作

### 当前时间戳示例
```python
import time
import datetime

def current_timestamp_examples():
    """获取当前时间戳的示例"""
    # 当前Unix时间戳
    current_unix = int(time.time())
    print(f"当前Unix时间戳: {current_unix}")
    
    # 当前毫秒时间戳
    current_ms = int(time.time() * 1000)
    print(f"当前时间戳（毫秒）: {current_ms}")
    
    # 当前微秒时间戳
    current_us = int(time.time() * 1000000)
    print(f"当前时间戳（微秒）: {current_us}")
    
    # 当前日期时间
    now = datetime.datetime.now()
    print(f"当前日期时间: {now}")
    
    # 当前UTC日期时间
    utc_now = datetime.datetime.utcnow()
    print(f"当前UTC: {utc_now}")

current_timestamp_examples()
```

### 时间戳转日期时间转换
```python
def timestamp_to_datetime_examples():
    """将时间戳转换为日期时间对象"""
    # Unix时间戳
    unix_ts = 1640995200  # 2022-01-01 00:00:00 UTC
    
    # 转换为UTC日期时间
    dt_utc = datetime.datetime.utcfromtimestamp(unix_ts)
    print(f"UTC日期时间: {dt_utc}")
    
    # 转换为本地日期时间
    dt_local = datetime.datetime.fromtimestamp(unix_ts)
    print(f"本地日期时间: {dt_local}")
    
    # 转换毫秒时间戳
    ms_ts = 1640995200000
    dt_ms = datetime.datetime.fromtimestamp(ms_ts / 1000)
    print(f"从毫秒转换: {dt_ms}")
    
    # 带时区转换
    import pytz
    utc_tz = pytz.UTC
    dt_aware = utc_tz.localize(datetime.datetime.utcfromtimestamp(unix_ts))
    print(f"时区感知: {dt_aware}")

timestamp_to_datetime_examples()
```

### 日期时间转时间戳转换
```python
def datetime_to_timestamp_examples():
    """将日期时间对象转换为时间戳"""
    # 创建日期时间对象
    dt = datetime.datetime(2022, 1, 1, 12, 0, 0)
    print(f"日期时间: {dt}")
    
    # 转换为Unix时间戳
    unix_ts = int(dt.timestamp())
    print(f"Unix时间戳: {unix_ts}")
    
    # 转换为毫秒
    ms_ts = int(dt.timestamp() * 1000)
    print(f"毫秒: {ms_ts}")
    
    # 转换为微秒
    us_ts = int(dt.timestamp() * 1000000)
    print(f"微秒: {us_ts}")
    
    # 转换时区感知日期时间
    import pytz
    utc_tz = pytz.UTC
    aware_dt = utc_tz.localize(dt)
    aware_ts = int(aware_dt.timestamp())
    print(f"时区感知时间戳: {aware_ts}")

datetime_to_timestamp_examples()
```

## 格式转换示例

### ISO 8601格式
```python
def iso_format_examples():
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
    
    # 无微秒的ISO格式
    iso_clean = now.strftime("%Y-%m-%dT%H:%M:%S")
    print(f"清洁ISO: {iso_clean}")

iso_format_examples()
```

### RFC 2822格式
```python
def rfc_format_examples():
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
    
    # 无时区的RFC格式
    rfc_no_tz = now.strftime("%a, %d %b %Y %H:%M:%S")
    print(f"无时区RFC: {rfc_no_tz}")

rfc_format_examples()
```

### 自定义格式示例
```python
def custom_format_examples():
    """自定义时间戳格式化示例"""
    now = datetime.datetime.now()
    
    # 各种自定义格式
    formats = {
        "仅日期": "%Y-%m-%d",
        "仅时间": "%H:%M:%S",
        "日期和时间": "%Y-%m-%d %H:%M:%S",
        "带时区": "%Y-%m-%d %H:%M:%S %z",
        "可读": "%B %d, %Y at %I:%M %p",
        "紧凑": "%Y%m%d_%H%M%S",
        "日志格式": "%Y-%m-%d %H:%M:%S.%f",
        "文件名": "%Y%m%d_%H%M%S",
        "数据库": "%Y-%m-%d %H:%M:%S"
    }
    
    for format_name, format_string in formats.items():
        formatted = now.strftime(format_string)
        print(f"{format_name}: {formatted}")

custom_format_examples()
```

## 时区转换示例

### 基本时区转换
```python
def timezone_conversion_examples():
    """在时区之间转换时间戳"""
    # 创建时区感知日期时间
    import pytz
    utc_tz = pytz.UTC
    utc_dt = utc_tz.localize(datetime.datetime(2022, 1, 1, 12, 0, 0))
    print(f"UTC日期时间: {utc_dt}")
    
    # 转换为不同时区
    timezones = ['US/Pacific', 'US/Eastern', 'Europe/London', 'Asia/Tokyo']
    
    for tz_name in timezones:
        tz = pytz.timezone(tz_name)
        converted = utc_dt.astimezone(tz)
        print(f"{tz_name}: {converted}")
    
    # 将本地时间转换为UTC
    local_dt = datetime.datetime.now()
    local_tz = pytz.timezone('US/Pacific')
    local_aware = local_tz.localize(local_dt)
    utc_converted = local_aware.astimezone(utc_tz)
    print(f"本地到UTC: {local_dt} -> {utc_converted}")

timezone_conversion_examples()
```

### DST处理示例
```python
def dst_handling_examples():
    """处理夏令时转换"""
    import pytz
    
    # DST转换日期
    dst_transitions = [
        datetime.datetime(2022, 3, 13, 2, 0, 0),  # 春季前移
        datetime.datetime(2022, 11, 6, 2, 0, 0),  # 秋季后移
    ]
    
    pst = pytz.timezone('US/Pacific')
    utc_tz = pytz.UTC
    
    for dt in dst_transitions:
        # 本地化到PST
        pst_aware = pst.localize(dt)
        print(f"PST: {pst_aware}")
        
        # 转换为UTC
        utc_converted = pst_aware.astimezone(utc_tz)
        print(f"UTC: {utc_converted}")
        
        # 转换回PST
        pst_back = utc_converted.astimezone(pst)
        print(f"PST返回: {pst_back}")
        print()

dst_handling_examples()
```

## 高级解析示例

### 灵活日期解析
```python
def flexible_parsing_examples():
    """灵活解析各种日期格式"""
    from dateutil import parser
    
    # 各种日期格式
    date_strings = [
        "2022-01-01",
        "01/01/2022",
        "2022-01-01T12:30:45Z",
        "January 1, 2022",
        "Jan 1, 2022 12:30 PM",
        "2022-01-01 12:30:45",
        "1st January 2022",
        "2022/01/01 12:30:45"
    ]
    
    for date_str in date_strings:
        try:
            parsed = parser.parse(date_str)
            timestamp = int(parsed.timestamp())
            print(f"{date_str} -> {parsed} -> {timestamp}")
        except Exception as e:
            print(f"解析{date_str}时出错: {e}")

flexible_parsing_examples()
```

### 自定义格式解析
```python
def custom_parsing_examples():
    """解析自定义日期格式"""
    # 自定义格式字符串
    custom_formats = [
        ("%Y-%m-%d", "2022-01-01"),
        ("%m/%d/%Y", "01/01/2022"),
        ("%Y-%m-%d %H:%M:%S", "2022-01-01 12:30:45"),
        ("%B %d, %Y", "January 1, 2022"),
        ("%Y%m%d", "20220101"),
        ("%d-%m-%Y", "01-01-2022")
    ]
    
    for format_string, date_string in custom_formats:
        try:
            parsed = datetime.datetime.strptime(date_string, format_string)
            timestamp = int(parsed.timestamp())
            print(f"{date_string} ({format_string}) -> {parsed} -> {timestamp}")
        except Exception as e:
            print(f"解析{date_string}时出错: {e}")

custom_parsing_examples()
```

## 精度和性能示例

### 精度处理
```python
def precision_examples():
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
    
    # 转换回带精度的日期时间
    dt_precise = datetime.datetime.fromtimestamp(precise_ts)
    print(f"精确日期时间: {dt_precise}")
    
    # 带微秒格式化
    formatted = dt_precise.strftime("%Y-%m-%d %H:%M:%S.%f")
    print(f"带微秒格式化: {formatted}")
    
    # 移除微秒
    dt_no_micro = dt_precise.replace(microsecond=0)
    print(f"无微秒: {dt_no_micro}")

precision_examples()
```

### 性能比较
```python
import time

def performance_examples():
    """比较不同时间戳操作的性能"""
    # 测试数据
    test_timestamps = [1640995200 + i for i in range(1000)]
    
    # 测试时间戳到日期时间转换
    start_time = time.time()
    datetimes = [datetime.datetime.fromtimestamp(ts) for ts in test_timestamps]
    end_time = time.time()
    print(f"时间戳到日期时间: {end_time - start_time:.4f} 秒")
    
    # 测试日期时间到时间戳转换
    start_time = time.time()
    timestamps = [int(dt.timestamp()) for dt in datetimes]
    end_time = time.time()
    print(f"日期时间到时间戳: {end_time - start_time:.4f} 秒")
    
    # 测试ISO格式化
    start_time = time.time()
    iso_formats = [dt.isoformat() for dt in datetimes]
    end_time = time.time()
    print(f"ISO格式化: {end_time - start_time:.4f} 秒")
    
    # 测试自定义格式化
    start_time = time.time()
    custom_formats = [dt.strftime("%Y-%m-%d %H:%M:%S") for dt in datetimes]
    end_time = time.time()
    print(f"自定义格式化: {end_time - start_time:.4f} 秒")

performance_examples()
```

## 错误处理示例

### 验证函数
```python
def validation_examples():
    """验证时间戳输入"""
    def is_valid_unix_timestamp(timestamp):
        """检查是否为有效Unix时间戳"""
        try:
            ts = float(timestamp)
            min_ts = 0
            max_ts = 4102444800  # 2100-01-01
            return min_ts <= ts <= max_ts
        except (ValueError, TypeError):
            return False
    
    def is_valid_datetime_string(date_string):
        """检查字符串是否可以解析为日期时间"""
        try:
            datetime.datetime.fromisoformat(date_string)
            return True
        except ValueError:
            return False
    
    # 测试用例
    test_cases = [
        (1640995200, "有效Unix时间戳"),
        (0, "纪元时间戳"),
        (4102444800, "未来时间戳"),
        (-1, "负时间戳"),
        (9999999999999, "过大时间戳"),
        ("2022-01-01", "有效日期字符串"),
        ("invalid", "无效字符串"),
        (None, "空值")
    ]
    
    for test_case, description in test_cases:
        if isinstance(test_case, (int, float)):
            is_valid = is_valid_unix_timestamp(test_case)
        elif isinstance(test_case, str):
            is_valid = is_valid_datetime_string(test_case)
        else:
            is_valid = False
        
        print(f"{description}: {test_case} -> {'有效' if is_valid else '无效'}")

validation_examples()
```

### 安全转换函数
```python
def safe_conversion_examples():
    """带错误处理的安全时间戳转换"""
    def safe_timestamp_to_datetime(timestamp):
        """安全地将时间戳转换为日期时间"""
        try:
            if isinstance(timestamp, str):
                timestamp = float(timestamp)
            
            dt = datetime.datetime.fromtimestamp(timestamp)
            return dt
        except (ValueError, TypeError, OSError) as e:
            print(f"转换错误: {e}")
            return None
    
    def safe_datetime_to_timestamp(dt):
        """安全地将日期时间转换为时间戳"""
        try:
            if dt is None:
                return None
            
            timestamp = int(dt.timestamp())
            return timestamp
        except (ValueError, TypeError, OSError) as e:
            print(f"转换错误: {e}")
            return None
    
    def safe_parse_date(date_string):
        """安全地解析日期字符串"""
        try:
            from dateutil import parser
            return parser.parse(date_string)
        except Exception as e:
            print(f"解析错误: {e}")
            return None
    
    # 测试安全转换
    test_inputs = [
        1640995200,
        "1640995200",
        "2022-01-01",
        "invalid",
        None
    ]
    
    for test_input in test_inputs:
        if isinstance(test_input, (int, float)) or (isinstance(test_input, str) and test_input.isdigit()):
            dt = safe_timestamp_to_datetime(test_input)
            if dt:
                converted_back = safe_datetime_to_timestamp(dt)
                print(f"{test_input} -> {dt} -> {converted_back}")
        else:
            dt = safe_parse_date(test_input)
            if dt:
                timestamp = safe_datetime_to_timestamp(dt)
                print(f"{test_input} -> {dt} -> {timestamp}")

safe_conversion_examples()
```

## JavaScript示例

### Node.js时间戳示例
```javascript
// 当前时间戳示例
function currentTimestampExamples() {
    // 当前Unix时间戳
    const currentUnix = Math.floor(Date.now() / 1000);
    console.log(`当前Unix时间戳: ${currentUnix}`);
    
    // 当前毫秒时间戳
    const currentMs = Date.now();
    console.log(`当前时间戳（毫秒）: ${currentMs}`);
    
    // 当前日期对象
    const now = new Date();
    console.log(`当前日期: ${now}`);
    
    // ISO格式
    const isoFormat = now.toISOString();
    console.log(`ISO格式: ${isoFormat}`);
}

// 时间戳转换示例
function timestampConversionExamples() {
    // Unix时间戳
    const unixTs = 1640995200;
    
    // 转换为Date对象
    const date = new Date(unixTs * 1000);
    console.log(`Unix ${unixTs} -> 日期: ${date}`);
    
    // 转换Date为时间戳
    const timestamp = Math.floor(date.getTime() / 1000);
    console.log(`日期 -> Unix: ${timestamp}`);
    
    // 格式化日期
    const formatted = date.toLocaleString();
    console.log(`格式化: ${formatted}`);
}

// 时区示例
function timezoneExamples() {
    const date = new Date();
    
    // 不同时区格式
    const formats = {
        'UTC': date.toUTCString(),
        'ISO': date.toISOString(),
        '本地': date.toLocaleString(),
        '日期': date.toDateString(),
        '时间': date.toTimeString()
    };
    
    for (const [format, value] of Object.entries(formats)) {
        console.log(`${format}: ${value}`);
    }
}

// 使用示例（在Python文件中注释掉）
// currentTimestampExamples();
// timestampConversionExamples();
// timezoneExamples();
```

## 测试示例

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
        
        # 转换回日期时间
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
    
    # 测试微秒精度
    precise = datetime.datetime(2022, 1, 1, 12, 0, 0, 123456)
    precise_ts = precise.timestamp()
    print(f"精确: {precise} -> {precise_ts}")

edge_case_testing()
``` 
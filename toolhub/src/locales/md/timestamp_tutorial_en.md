# Timestamp Conversion Usage Tutorial

## Environment Setup

### Prerequisites
- Python 3.6+ with datetime and time modules
- Understanding of timezone concepts
- Basic knowledge of Unix timestamps
- Familiarity with ISO 8601 format

### Library Installation
```python
# Python built-in modules (no installation needed)
import datetime
import time
import calendar

# Optional: Install pytz for timezone handling
# pip install pytz
import pytz

# Optional: Install dateutil for advanced parsing
# pip install python-dateutil
from dateutil import parser
```

## Basic Concepts

### Timestamp Types
```python
def timestamp_types():
    """Understanding different timestamp types"""
    # Current time in different formats
    now = datetime.datetime.now()
    
    # Unix timestamp (seconds since epoch)
    unix_timestamp = int(time.time())
    print(f"Unix timestamp: {unix_timestamp}")
    
    # Unix timestamp in milliseconds
    unix_ms = int(time.time() * 1000)
    print(f"Unix timestamp (ms): {unix_ms}")
    
    # ISO 8601 format
    iso_format = now.isoformat()
    print(f"ISO 8601: {iso_format}")
    
    # RFC 2822 format
    rfc_format = now.strftime("%a, %d %b %Y %H:%M:%S %z")
    print(f"RFC 2822: {rfc_format}")

timestamp_types()
```

### Timezone Awareness
```python
def timezone_concepts():
    """Understanding timezone concepts"""
    # UTC time
    utc_now = datetime.datetime.utcnow()
    print(f"UTC time: {utc_now}")
    
    # Local time
    local_now = datetime.datetime.now()
    print(f"Local time: {local_now}")
    
    # Timezone-aware datetime
    import pytz
    utc_tz = pytz.UTC
    aware_utc = utc_tz.localize(utc_now)
    print(f"Timezone-aware UTC: {aware_utc}")
    
    # Convert to different timezone
    pst = pytz.timezone('US/Pacific')
    pst_time = aware_utc.astimezone(pst)
    print(f"PST time: {pst_time}")

timezone_concepts()
```

## Basic Timestamp Operations

### Current Timestamp Generation
```python
def current_timestamp():
    """Generate current timestamp in various formats"""
    # Current Unix timestamp
    current_unix = int(time.time())
    print(f"Current Unix timestamp: {current_unix}")
    
    # Current timestamp in milliseconds
    current_ms = int(time.time() * 1000)
    print(f"Current timestamp (ms): {current_ms}")
    
    # Current timestamp in microseconds
    current_us = int(time.time() * 1000000)
    print(f"Current timestamp (μs): {current_us}")
    
    # ISO format with timezone
    now = datetime.datetime.now()
    iso_with_tz = now.isoformat()
    print(f"ISO with timezone: {iso_with_tz}")

current_timestamp()
```

### Timestamp to Datetime Conversion
```python
def timestamp_to_datetime():
    """Convert timestamp to datetime objects"""
    # Unix timestamp
    unix_ts = 1640995200  # 2022-01-01 00:00:00 UTC
    
    # Convert to datetime (UTC)
    dt_utc = datetime.datetime.utcfromtimestamp(unix_ts)
    print(f"UTC datetime: {dt_utc}")
    
    # Convert to local datetime
    dt_local = datetime.datetime.fromtimestamp(unix_ts)
    print(f"Local datetime: {dt_local}")
    
    # Convert to timezone-aware datetime
    import pytz
    utc_tz = pytz.UTC
    dt_aware = utc_tz.localize(datetime.datetime.utcfromtimestamp(unix_ts))
    print(f"Timezone-aware: {dt_aware}")
    
    # Convert to specific timezone
    pst = pytz.timezone('US/Pacific')
    dt_pst = dt_aware.astimezone(pst)
    print(f"PST datetime: {dt_pst}")

timestamp_to_datetime()
```

### Datetime to Timestamp Conversion
```python
def datetime_to_timestamp():
    """Convert datetime objects to timestamps"""
    # Create datetime object
    dt = datetime.datetime(2022, 1, 1, 12, 0, 0)
    print(f"Datetime: {dt}")
    
    # Convert to Unix timestamp
    unix_ts = int(dt.timestamp())
    print(f"Unix timestamp: {unix_ts}")
    
    # Convert to milliseconds
    ms_ts = int(dt.timestamp() * 1000)
    print(f"Milliseconds: {ms_ts}")
    
    # Convert timezone-aware datetime
    import pytz
    utc_tz = pytz.UTC
    aware_dt = utc_tz.localize(dt)
    aware_ts = int(aware_dt.timestamp())
    print(f"Timezone-aware timestamp: {aware_ts}")

datetime_to_timestamp()
```

## Advanced Timestamp Operations

### Custom Format Parsing
```python
def custom_format_parsing():
    """Parse timestamps in custom formats"""
    # Custom date string
    date_string = "2022-01-01 12:30:45"
    
    # Parse using strptime
    dt = datetime.datetime.strptime(date_string, "%Y-%m-%d %H:%M:%S")
    print(f"Parsed datetime: {dt}")
    
    # Convert to timestamp
    timestamp = int(dt.timestamp())
    print(f"Timestamp: {timestamp}")
    
    # Parse with dateutil (more flexible)
    from dateutil import parser
    flexible_dt = parser.parse("Jan 1, 2022 12:30:45 PM")
    print(f"Flexible parsing: {flexible_dt}")
    
    # Handle various formats
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
            print(f"Error parsing {date_str}: {e}")

custom_format_parsing()
```

### Timezone Conversion
```python
def timezone_conversion():
    """Convert timestamps between timezones"""
    # Create timezone-aware datetime
    import pytz
    utc_tz = pytz.UTC
    utc_dt = utc_tz.localize(datetime.datetime(2022, 1, 1, 12, 0, 0))
    print(f"UTC datetime: {utc_dt}")
    
    # Convert to different timezones
    timezones = ['US/Pacific', 'US/Eastern', 'Europe/London', 'Asia/Tokyo']
    
    for tz_name in timezones:
        tz = pytz.timezone(tz_name)
        converted = utc_dt.astimezone(tz)
        print(f"{tz_name}: {converted}")
    
    # Handle DST transitions
    dst_dt = utc_tz.localize(datetime.datetime(2022, 3, 13, 2, 0, 0))
    pst = pytz.timezone('US/Pacific')
    dst_converted = dst_dt.astimezone(pst)
    print(f"DST transition: {dst_converted}")

timezone_conversion()
```

### Precision Handling
```python
def precision_handling():
    """Handle different timestamp precisions"""
    # High precision timestamp
    precise_ts = 1640995200.123456
    
    # Convert to different precisions
    seconds = int(precise_ts)
    milliseconds = int(precise_ts * 1000)
    microseconds = int(precise_ts * 1000000)
    
    print(f"Original: {precise_ts}")
    print(f"Seconds: {seconds}")
    print(f"Milliseconds: {milliseconds}")
    print(f"Microseconds: {microseconds}")
    
    # Convert back to datetime with precision
    dt_precise = datetime.datetime.fromtimestamp(precise_ts)
    print(f"Precise datetime: {dt_precise}")
    
    # Format with microseconds
    formatted = dt_precise.strftime("%Y-%m-%d %H:%M:%S.%f")
    print(f"Formatted with microseconds: {formatted}")

precision_handling()
```

## Format Conversion

### ISO 8601 Format
```python
def iso_format_operations():
    """Work with ISO 8601 format"""
    # Current time in ISO format
    now = datetime.datetime.now()
    iso_now = now.isoformat()
    print(f"ISO format: {iso_now}")
    
    # Parse ISO format
    parsed_iso = datetime.datetime.fromisoformat(iso_now)
    print(f"Parsed ISO: {parsed_iso}")
    
    # ISO format with timezone
    import pytz
    utc_tz = pytz.UTC
    utc_now = utc_tz.localize(datetime.datetime.utcnow())
    iso_utc = utc_now.isoformat()
    print(f"ISO UTC: {iso_utc}")
    
    # Custom ISO format
    custom_iso = now.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
    print(f"Custom ISO: {custom_iso}")

iso_format_operations()
```

### RFC 2822 Format
```python
def rfc_format_operations():
    """Work with RFC 2822 format"""
    # Current time in RFC format
    now = datetime.datetime.now()
    rfc_now = now.strftime("%a, %d %b %Y %H:%M:%S %z")
    print(f"RFC 2822: {rfc_now}")
    
    # Parse RFC format
    rfc_string = "Sat, 01 Jan 2022 12:00:00 +0000"
    parsed_rfc = datetime.datetime.strptime(rfc_string, "%a, %d %b %Y %H:%M:%S %z")
    print(f"Parsed RFC: {parsed_rfc}")
    
    # Convert to timestamp
    rfc_timestamp = int(parsed_rfc.timestamp())
    print(f"RFC timestamp: {rfc_timestamp}")

rfc_format_operations()
```

### Custom Formatting
```python
def custom_formatting():
    """Custom timestamp formatting"""
    now = datetime.datetime.now()
    
    # Various custom formats
    formats = {
        "Date only": "%Y-%m-%d",
        "Time only": "%H:%M:%S",
        "Date and time": "%Y-%m-%d %H:%M:%S",
        "With timezone": "%Y-%m-%d %H:%M:%S %z",
        "Readable": "%B %d, %Y at %I:%M %p",
        "Compact": "%Y%m%d_%H%M%S",
        "Log format": "%Y-%m-%d %H:%M:%S.%f"
    }
    
    for format_name, format_string in formats.items():
        formatted = now.strftime(format_string)
        print(f"{format_name}: {formatted}")

custom_formatting()
```

## Error Handling and Validation

### Timestamp Validation
```python
def timestamp_validation():
    """Validate timestamp inputs"""
    def is_valid_unix_timestamp(timestamp):
        """Check if timestamp is valid Unix timestamp"""
        try:
            # Check if it's a number
            ts = float(timestamp)
            
            # Check reasonable range (1970-2100)
            min_ts = 0
            max_ts = 4102444800  # 2100-01-01
            
            return min_ts <= ts <= max_ts
        except (ValueError, TypeError):
            return False
    
    # Test cases
    test_cases = [
        1640995200,      # Valid
        0,               # Valid (epoch)
        4102444800,      # Valid (2100)
        -1,              # Invalid (negative)
        9999999999999,   # Invalid (too large)
        "invalid",       # Invalid (string)
        None             # Invalid (None)
    ]
    
    for test_case in test_cases:
        is_valid = is_valid_unix_timestamp(test_case)
        print(f"{test_case}: {'Valid' if is_valid else 'Invalid'}")

timestamp_validation()
```

### Safe Conversion Functions
```python
def safe_conversion():
    """Safe timestamp conversion with error handling"""
    def safe_timestamp_to_datetime(timestamp):
        """Safely convert timestamp to datetime"""
        try:
            if isinstance(timestamp, str):
                timestamp = float(timestamp)
            
            dt = datetime.datetime.fromtimestamp(timestamp)
            return dt
        except (ValueError, TypeError, OSError) as e:
            print(f"Conversion error: {e}")
            return None
    
    def safe_datetime_to_timestamp(dt):
        """Safely convert datetime to timestamp"""
        try:
            if dt is None:
                return None
            
            timestamp = int(dt.timestamp())
            return timestamp
        except (ValueError, TypeError, OSError) as e:
            print(f"Conversion error: {e}")
            return None
    
    # Test safe conversions
    test_timestamps = [1640995200, "1640995200", "invalid", None]
    
    for ts in test_timestamps:
        dt = safe_timestamp_to_datetime(ts)
        if dt:
            converted_back = safe_datetime_to_timestamp(dt)
            print(f"{ts} -> {dt} -> {converted_back}")

safe_conversion()
```

## Performance and Optimization

### Batch Processing
```python
def batch_processing():
    """Process multiple timestamps efficiently"""
    # Generate test timestamps
    timestamps = [1640995200 + i for i in range(1000)]
    
    # Batch convert to datetime
    start_time = time.time()
    datetimes = [datetime.datetime.fromtimestamp(ts) for ts in timestamps]
    end_time = time.time()
    
    print(f"Converted {len(timestamps)} timestamps in {end_time - start_time:.4f} seconds")
    
    # Batch format to ISO
    start_time = time.time()
    iso_formats = [dt.isoformat() for dt in datetimes]
    end_time = time.time()
    
    print(f"Formatted {len(iso_formats)} datetimes in {end_time - start_time:.4f} seconds")
    
    # Show first few results
    for i in range(5):
        print(f"{timestamps[i]} -> {datetimes[i]} -> {iso_formats[i]}")

batch_processing()
```

### Caching Strategies
```python
def caching_strategies():
    """Implement caching for timestamp conversions"""
    # Simple cache for timezone conversions
    timezone_cache = {}
    
    def cached_timezone_convert(dt, timezone_name):
        """Convert datetime with caching"""
        cache_key = f"{dt.isoformat()}_{timezone_name}"
        
        if cache_key in timezone_cache:
            return timezone_cache[cache_key]
        
        # Perform conversion
        import pytz
        tz = pytz.timezone(timezone_name)
        converted = dt.astimezone(tz)
        
        # Cache result
        timezone_cache[cache_key] = converted
        return converted
    
    # Test caching
    now = datetime.datetime.now()
    timezones = ['US/Pacific', 'US/Eastern', 'Europe/London']
    
    for tz in timezones:
        result = cached_timezone_convert(now, tz)
        print(f"{tz}: {result}")
    
    print(f"Cache size: {len(timezone_cache)}")

caching_strategies()
```

## Testing and Validation

### Round-trip Testing
```python
def round_trip_testing():
    """Test timestamp conversion round-trips"""
    # Test cases
    test_cases = [
        datetime.datetime(2022, 1, 1, 12, 0, 0),
        datetime.datetime(2030, 12, 31, 23, 59, 59),
        datetime.datetime(1970, 1, 1, 0, 0, 0),
        datetime.datetime.now()
    ]
    
    for dt in test_cases:
        # Convert to timestamp
        timestamp = int(dt.timestamp())
        
        # Convert back to datetime
        converted_dt = datetime.datetime.fromtimestamp(timestamp)
        
        # Compare
        is_equal = dt == converted_dt
        print(f"{dt} -> {timestamp} -> {converted_dt} -> {'✓' if is_equal else '✗'}")

round_trip_testing()
```

### Edge Case Testing
```python
def edge_case_testing():
    """Test edge cases in timestamp conversion"""
    # Test leap year
    leap_year = datetime.datetime(2024, 2, 29, 12, 0, 0)
    leap_ts = int(leap_year.timestamp())
    print(f"Leap year: {leap_year} -> {leap_ts}")
    
    # Test DST transition
    dst_start = datetime.datetime(2022, 3, 13, 2, 0, 0)
    dst_ts = int(dst_start.timestamp())
    print(f"DST start: {dst_start} -> {dst_ts}")
    
    # Test epoch
    epoch = datetime.datetime(1970, 1, 1, 0, 0, 0)
    epoch_ts = int(epoch.timestamp())
    print(f"Epoch: {epoch} -> {epoch_ts}")
    
    # Test year 2038 boundary
    boundary = datetime.datetime(2038, 1, 19, 3, 14, 7)
    boundary_ts = int(boundary.timestamp())
    print(f"2038 boundary: {boundary} -> {boundary_ts}")

edge_case_testing()
``` 
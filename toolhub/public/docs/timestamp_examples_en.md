# Timestamp Conversion Code Examples

## Basic Timestamp Operations

### Current Timestamp Examples
```python
import time
import datetime

def current_timestamp_examples():
    """Examples of getting current timestamps"""
    # Current Unix timestamp
    current_unix = int(time.time())
    print(f"Current Unix timestamp: {current_unix}")
    
    # Current timestamp in milliseconds
    current_ms = int(time.time() * 1000)
    print(f"Current timestamp (ms): {current_ms}")
    
    # Current timestamp in microseconds
    current_us = int(time.time() * 1000000)
    print(f"Current timestamp (μs): {current_us}")
    
    # Current datetime
    now = datetime.datetime.now()
    print(f"Current datetime: {now}")
    
    # Current UTC datetime
    utc_now = datetime.datetime.utcnow()
    print(f"Current UTC: {utc_now}")

current_timestamp_examples()
```

### Timestamp to Datetime Conversion
```python
def timestamp_to_datetime_examples():
    """Convert timestamps to datetime objects"""
    # Unix timestamp
    unix_ts = 1640995200  # 2022-01-01 00:00:00 UTC
    
    # Convert to UTC datetime
    dt_utc = datetime.datetime.utcfromtimestamp(unix_ts)
    print(f"UTC datetime: {dt_utc}")
    
    # Convert to local datetime
    dt_local = datetime.datetime.fromtimestamp(unix_ts)
    print(f"Local datetime: {dt_local}")
    
    # Convert milliseconds timestamp
    ms_ts = 1640995200000
    dt_ms = datetime.datetime.fromtimestamp(ms_ts / 1000)
    print(f"From milliseconds: {dt_ms}")
    
    # Convert with timezone
    import pytz
    utc_tz = pytz.UTC
    dt_aware = utc_tz.localize(datetime.datetime.utcfromtimestamp(unix_ts))
    print(f"Timezone-aware: {dt_aware}")

timestamp_to_datetime_examples()
```

### Datetime to Timestamp Conversion
```python
def datetime_to_timestamp_examples():
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
    
    # Convert to microseconds
    us_ts = int(dt.timestamp() * 1000000)
    print(f"Microseconds: {us_ts}")
    
    # Convert timezone-aware datetime
    import pytz
    utc_tz = pytz.UTC
    aware_dt = utc_tz.localize(dt)
    aware_ts = int(aware_dt.timestamp())
    print(f"Timezone-aware timestamp: {aware_ts}")

datetime_to_timestamp_examples()
```

## Format Conversion Examples

### ISO 8601 Format
```python
def iso_format_examples():
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
    
    # ISO format without microseconds
    iso_clean = now.strftime("%Y-%m-%dT%H:%M:%S")
    print(f"ISO clean: {iso_clean}")

iso_format_examples()
```

### RFC 2822 Format
```python
def rfc_format_examples():
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
    
    # RFC format without timezone
    rfc_no_tz = now.strftime("%a, %d %b %Y %H:%M:%S")
    print(f"RFC no timezone: {rfc_no_tz}")

rfc_format_examples()
```

### Custom Format Examples
```python
def custom_format_examples():
    """Custom timestamp formatting examples"""
    now = datetime.datetime.now()
    
    # Various custom formats
    formats = {
        "Date only": "%Y-%m-%d",
        "Time only": "%H:%M:%S",
        "Date and time": "%Y-%m-%d %H:%M:%S",
        "With timezone": "%Y-%m-%d %H:%M:%S %z",
        "Readable": "%B %d, %Y at %I:%M %p",
        "Compact": "%Y%m%d_%H%M%S",
        "Log format": "%Y-%m-%d %H:%M:%S.%f",
        "Filename": "%Y%m%d_%H%M%S",
        "Database": "%Y-%m-%d %H:%M:%S"
    }
    
    for format_name, format_string in formats.items():
        formatted = now.strftime(format_string)
        print(f"{format_name}: {formatted}")

custom_format_examples()
```

## Timezone Conversion Examples

### Basic Timezone Conversion
```python
def timezone_conversion_examples():
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
    
    # Convert local time to UTC
    local_dt = datetime.datetime.now()
    local_tz = pytz.timezone('US/Pacific')
    local_aware = local_tz.localize(local_dt)
    utc_converted = local_aware.astimezone(utc_tz)
    print(f"Local to UTC: {local_dt} -> {utc_converted}")

timezone_conversion_examples()
```

### DST Handling Examples
```python
def dst_handling_examples():
    """Handle Daylight Saving Time transitions"""
    import pytz
    
    # DST transition dates
    dst_transitions = [
        datetime.datetime(2022, 3, 13, 2, 0, 0),  # Spring forward
        datetime.datetime(2022, 11, 6, 2, 0, 0),  # Fall back
    ]
    
    pst = pytz.timezone('US/Pacific')
    utc_tz = pytz.UTC
    
    for dt in dst_transitions:
        # Localize to PST
        pst_aware = pst.localize(dt)
        print(f"PST: {pst_aware}")
        
        # Convert to UTC
        utc_converted = pst_aware.astimezone(utc_tz)
        print(f"UTC: {utc_converted}")
        
        # Convert back to PST
        pst_back = utc_converted.astimezone(pst)
        print(f"PST back: {pst_back}")
        print()

dst_handling_examples()
```

## Advanced Parsing Examples

### Flexible Date Parsing
```python
def flexible_parsing_examples():
    """Parse various date formats flexibly"""
    from dateutil import parser
    
    # Various date formats
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
            print(f"Error parsing {date_str}: {e}")

flexible_parsing_examples()
```

### Custom Format Parsing
```python
def custom_parsing_examples():
    """Parse custom date formats"""
    # Custom format strings
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
            print(f"Error parsing {date_string}: {e}")

custom_parsing_examples()
```

## Precision and Performance Examples

### Precision Handling
```python
def precision_examples():
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
    
    # Remove microseconds
    dt_no_micro = dt_precise.replace(microsecond=0)
    print(f"Without microseconds: {dt_no_micro}")

precision_examples()
```

### Performance Comparison
```python
import time

def performance_examples():
    """Compare performance of different timestamp operations"""
    # Test data
    test_timestamps = [1640995200 + i for i in range(1000)]
    
    # Test timestamp to datetime conversion
    start_time = time.time()
    datetimes = [datetime.datetime.fromtimestamp(ts) for ts in test_timestamps]
    end_time = time.time()
    print(f"Timestamp to datetime: {end_time - start_time:.4f} seconds")
    
    # Test datetime to timestamp conversion
    start_time = time.time()
    timestamps = [int(dt.timestamp()) for dt in datetimes]
    end_time = time.time()
    print(f"Datetime to timestamp: {end_time - start_time:.4f} seconds")
    
    # Test ISO formatting
    start_time = time.time()
    iso_formats = [dt.isoformat() for dt in datetimes]
    end_time = time.time()
    print(f"ISO formatting: {end_time - start_time:.4f} seconds")
    
    # Test custom formatting
    start_time = time.time()
    custom_formats = [dt.strftime("%Y-%m-%d %H:%M:%S") for dt in datetimes]
    end_time = time.time()
    print(f"Custom formatting: {end_time - start_time:.4f} seconds")

performance_examples()
```

## Error Handling Examples

### Validation Functions
```python
def validation_examples():
    """Validate timestamp inputs"""
    def is_valid_unix_timestamp(timestamp):
        """Check if timestamp is valid Unix timestamp"""
        try:
            ts = float(timestamp)
            min_ts = 0
            max_ts = 4102444800  # 2100-01-01
            return min_ts <= ts <= max_ts
        except (ValueError, TypeError):
            return False
    
    def is_valid_datetime_string(date_string):
        """Check if string can be parsed as datetime"""
        try:
            datetime.datetime.fromisoformat(date_string)
            return True
        except ValueError:
            return False
    
    # Test cases
    test_cases = [
        (1640995200, "Valid Unix timestamp"),
        (0, "Epoch timestamp"),
        (4102444800, "Future timestamp"),
        (-1, "Negative timestamp"),
        (9999999999999, "Too large timestamp"),
        ("2022-01-01", "Valid date string"),
        ("invalid", "Invalid string"),
        (None, "None value")
    ]
    
    for test_case, description in test_cases:
        if isinstance(test_case, (int, float)):
            is_valid = is_valid_unix_timestamp(test_case)
        elif isinstance(test_case, str):
            is_valid = is_valid_datetime_string(test_case)
        else:
            is_valid = False
        
        print(f"{description}: {test_case} -> {'Valid' if is_valid else 'Invalid'}")

validation_examples()
```

### Safe Conversion Functions
```python
def safe_conversion_examples():
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
    
    def safe_parse_date(date_string):
        """Safely parse date string"""
        try:
            from dateutil import parser
            return parser.parse(date_string)
        except Exception as e:
            print(f"Parsing error: {e}")
            return None
    
    # Test safe conversions
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

## JavaScript Examples

### Node.js Timestamp Examples
```javascript
// Current timestamp examples
function currentTimestampExamples() {
    // Current Unix timestamp
    const currentUnix = Math.floor(Date.now() / 1000);
    console.log(`Current Unix timestamp: ${currentUnix}`);
    
    // Current timestamp in milliseconds
    const currentMs = Date.now();
    console.log(`Current timestamp (ms): ${currentMs}`);
    
    // Current date object
    const now = new Date();
    console.log(`Current date: ${now}`);
    
    // ISO format
    const isoFormat = now.toISOString();
    console.log(`ISO format: ${isoFormat}`);
}

// Timestamp conversion examples
function timestampConversionExamples() {
    // Unix timestamp
    const unixTs = 1640995200;
    
    // Convert to Date object
    const date = new Date(unixTs * 1000);
    console.log(`Unix ${unixTs} -> Date: ${date}`);
    
    // Convert Date to timestamp
    const timestamp = Math.floor(date.getTime() / 1000);
    console.log(`Date -> Unix: ${timestamp}`);
    
    // Format date
    const formatted = date.toLocaleString();
    console.log(`Formatted: ${formatted}`);
}

// Timezone examples
function timezoneExamples() {
    const date = new Date();
    
    // Different timezone formats
    const formats = {
        'UTC': date.toUTCString(),
        'ISO': date.toISOString(),
        'Local': date.toLocaleString(),
        'Date': date.toDateString(),
        'Time': date.toTimeString()
    };
    
    for (const [format, value] of Object.entries(formats)) {
        console.log(`${format}: ${value}`);
    }
}

// Example usage (commented out for Python file)
// currentTimestampExamples();
// timestampConversionExamples();
// timezoneExamples();
```

## Testing Examples

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
    
    # Test microsecond precision
    precise = datetime.datetime(2022, 1, 1, 12, 0, 0, 123456)
    precise_ts = precise.timestamp()
    print(f"Precise: {precise} -> {precise_ts}")

edge_case_testing()
``` 
# Date Calculation Usage Tutorial

## Environment Setup

### Prerequisites
- Python 3.6+ with datetime and dateutil modules
- Understanding of date arithmetic concepts
- Basic knowledge of calendar systems
- Familiarity with business day calculations

### Library Installation
```python
# Python built-in modules (no installation needed)
import datetime
from datetime import date, datetime, timedelta

# Optional: Install dateutil for advanced date operations
# pip install python-dateutil
from dateutil import relativedelta, parser

# Optional: Install pandas for advanced date manipulation
# pip install pandas
import pandas as pd
```

## Basic Concepts

### Date Arithmetic Fundamentals
```python
def date_arithmetic_basics():
    """Understanding basic date arithmetic"""
    # Current date
    today = date.today()
    print(f"Today: {today}")
    
    # Adding days
    tomorrow = today + timedelta(days=1)
    print(f"Tomorrow: {tomorrow}")
    
    # Subtracting days
    yesterday = today - timedelta(days=1)
    print(f"Yesterday: {yesterday}")
    
    # Adding weeks
    next_week = today + timedelta(weeks=1)
    print(f"Next week: {next_week}")
    
    # Date difference
    days_diff = (tomorrow - yesterday).days
    print(f"Days between yesterday and tomorrow: {days_diff}")

date_arithmetic_basics()
```

### Time Units and Intervals
```python
def time_units_examples():
    """Working with different time units"""
    # Create a base date
    base_date = date(2024, 1, 15)
    print(f"Base date: {base_date}")
    
    # Add different time units
    time_units = {
        "days": timedelta(days=5),
        "weeks": timedelta(weeks=2),
        "hours": timedelta(hours=24),
        "minutes": timedelta(minutes=1440),  # 24 hours
        "seconds": timedelta(seconds=86400)   # 24 hours
    }
    
    for unit, delta in time_units.items():
        result = base_date + delta
        print(f"Base + {unit}: {result}")

time_units_examples()
```

## Basic Date Calculations

### Simple Date Addition and Subtraction
```python
def simple_date_calculations():
    """Basic date addition and subtraction"""
    # Start date
    start_date = date(2024, 3, 15)
    print(f"Start date: {start_date}")
    
    # Add various intervals
    intervals = [1, 7, 30, 365]  # days, week, month, year
    
    for days in intervals:
        future_date = start_date + timedelta(days=days)
        past_date = start_date - timedelta(days=days)
        print(f"+{days} days: {future_date}")
        print(f"-{days} days: {past_date}")
    
    # Calculate date range
    end_date = start_date + timedelta(days=30)
    date_range = (end_date - start_date).days
    print(f"Date range: {date_range} days")

simple_date_calculations()
```

### Relative Date Calculations
```python
def relative_date_calculations():
    """Calculate relative dates"""
    today = date.today()
    
    # Common relative dates
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
    
    # N days from now
    for n in [3, 7, 14, 30]:
        future_date = today + timedelta(days=n)
        past_date = today - timedelta(days=n)
        print(f"{n} days from now: {future_date}")
        print(f"{n} days ago: {past_date}")

relative_date_calculations()
```

### Month and Year Calculations
```python
def month_year_calculations():
    """Advanced month and year calculations using dateutil"""
    from dateutil import relativedelta
    
    base_date = date(2024, 3, 15)
    print(f"Base date: {base_date}")
    
    # Month calculations
    next_month = base_date + relativedelta(months=1)
    last_month = base_date - relativedelta(months=1)
    print(f"Next month: {next_month}")
    print(f"Last month: {last_month}")
    
    # Year calculations
    next_year = base_date + relativedelta(years=1)
    last_year = base_date - relativedelta(years=1)
    print(f"Next year: {next_year}")
    print(f"Last year: {last_year}")
    
    # Combined calculations
    three_months_later = base_date + relativedelta(months=3)
    six_months_ago = base_date - relativedelta(months=6)
    print(f"Three months later: {three_months_later}")
    print(f"Six months ago: {six_months_ago}")

month_year_calculations()
```

## Advanced Date Calculations

### Business Day Calculations
```python
def business_day_calculations():
    """Calculate business days (excluding weekends)"""
    def add_business_days(start_date, business_days):
        """Add business days to a date"""
        current_date = start_date
        days_added = 0
        
        while days_added < business_days:
            current_date += timedelta(days=1)
            # Skip weekends (Saturday=5, Sunday=6)
            if current_date.weekday() < 5:
                days_added += 1
        
        return current_date
    
    def count_business_days(start_date, end_date):
        """Count business days between two dates"""
        business_days = 0
        current_date = start_date
        
        while current_date <= end_date:
            if current_date.weekday() < 5:  # Monday to Friday
                business_days += 1
            current_date += timedelta(days=1)
        
        return business_days
    
    # Test business day calculations
    start_date = date(2024, 3, 15)  # Friday
    print(f"Start date: {start_date}")
    
    # Add business days
    for days in [1, 3, 5, 10]:
        result = add_business_days(start_date, days)
        print(f"Start + {days} business days: {result}")
    
    # Count business days
    end_date = date(2024, 3, 25)
    business_days = count_business_days(start_date, end_date)
    print(f"Business days between {start_date} and {end_date}: {business_days}")

business_day_calculations()
```

### Calendar Navigation
```python
def calendar_navigation():
    """Navigate calendar periods"""
    def get_month_boundaries(target_date):
        """Get first and last day of month"""
        first_day = target_date.replace(day=1)
        if target_date.month == 12:
            next_month = target_date.replace(year=target_date.year + 1, month=1, day=1)
        else:
            next_month = target_date.replace(month=target_date.month + 1, day=1)
        last_day = next_month - timedelta(days=1)
        return first_day, last_day
    
    def get_quarter_boundaries(target_date):
        """Get quarter start and end dates"""
        quarter = (target_date.month - 1) // 3 + 1
        quarter_start_month = (quarter - 1) * 3 + 1
        quarter_start = target_date.replace(month=quarter_start_month, day=1)
        
        if quarter == 4:
            quarter_end = target_date.replace(year=target_date.year + 1, month=1, day=1) - timedelta(days=1)
        else:
            quarter_end = target_date.replace(month=quarter_start_month + 3, day=1) - timedelta(days=1)
        
        return quarter_start, quarter_end
    
    # Test calendar navigation
    test_date = date(2024, 3, 15)
    print(f"Test date: {test_date}")
    
    # Month boundaries
    month_start, month_end = get_month_boundaries(test_date)
    print(f"Month start: {month_start}")
    print(f"Month end: {month_end}")
    
    # Quarter boundaries
    quarter_start, quarter_end = get_quarter_boundaries(test_date)
    print(f"Quarter start: {quarter_start}")
    print(f"Quarter end: {quarter_end}")

calendar_navigation()
```

### Working with Date Ranges
```python
def date_range_operations():
    """Work with date ranges and intervals"""
    def generate_date_range(start_date, end_date, step_days=1):
        """Generate a range of dates"""
        current_date = start_date
        dates = []
        
        while current_date <= end_date:
            dates.append(current_date)
            current_date += timedelta(days=step_days)
        
        return dates
    
    def calculate_date_statistics(date_list):
        """Calculate statistics for a list of dates"""
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
    
    # Test date range operations
    start_date = date(2024, 3, 1)
    end_date = date(2024, 3, 31)
    
    # Generate daily range
    daily_range = generate_date_range(start_date, end_date)
    print(f"Daily range: {len(daily_range)} days")
    
    # Generate weekly range
    weekly_range = generate_date_range(start_date, end_date, 7)
    print(f"Weekly range: {len(weekly_range)} weeks")
    
    # Calculate statistics
    stats = calculate_date_statistics(daily_range)
    print(f"March 2024 statistics: {stats}")

date_range_operations()
```

## Financial and Business Calculations

### Payment Schedule Calculations
```python
def payment_schedule_calculations():
    """Calculate payment schedules and due dates"""
    def calculate_payment_schedule(principal, annual_rate, months, start_date):
        """Calculate monthly payment schedule"""
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
    
    # Test payment schedule
    principal = 10000
    annual_rate = 5.0
    months = 12
    start_date = date(2024, 4, 1)
    
    schedule = calculate_payment_schedule(principal, annual_rate, months, start_date)
    
    print(f"Payment Schedule for ${principal} at {annual_rate}% APR:")
    for payment in schedule[:3]:  # Show first 3 payments
        print(f"Payment {payment['payment_number']}: {payment['payment_date']} - ${payment['payment_amount']:.2f}")

payment_schedule_calculations()
```

### SLA and Deadline Calculations
```python
def sla_calculations():
    """Calculate SLA compliance and deadlines"""
    def calculate_sla_deadline(start_datetime, sla_hours, business_hours_only=True):
        """Calculate SLA deadline"""
        if business_hours_only:
            # Business hours: 9 AM to 5 PM, Monday to Friday
            current_datetime = start_datetime
            hours_remaining = sla_hours
            
            while hours_remaining > 0:
                current_datetime += timedelta(hours=1)
                
                # Check if within business hours
                if (current_datetime.weekday() < 5 and  # Monday to Friday
                    9 <= current_datetime.hour < 17):  # 9 AM to 5 PM
                    hours_remaining -= 1
                else:
                    # Skip to next business day if outside hours
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
    
    # Test SLA calculations
    start_time = datetime(2024, 3, 15, 14, 30, 0)  # Friday 2:30 PM
    print(f"Start time: {start_time}")
    
    # 4-hour business hours SLA
    business_deadline = calculate_sla_deadline(start_time, 4, business_hours_only=True)
    print(f"4-hour business SLA deadline: {business_deadline}")
    
    # 4-hour 24/7 SLA
    continuous_deadline = calculate_sla_deadline(start_time, 4, business_hours_only=False)
    print(f"4-hour 24/7 SLA deadline: {continuous_deadline}")

sla_calculations()
```

## Error Handling and Validation

### Date Validation
```python
def date_validation():
    """Validate date inputs and handle errors"""
    def is_valid_date(date_string):
        """Check if a string can be parsed as a valid date"""
        try:
            parsed_date = parser.parse(date_string)
            return True, parsed_date.date()
        except (ValueError, TypeError):
            return False, None
    
    def is_business_day(check_date):
        """Check if a date is a business day"""
        return check_date.weekday() < 5
    
    def validate_date_range(start_date, end_date):
        """Validate that start_date is before end_date"""
        if start_date > end_date:
            return False, "Start date must be before end date"
        return True, "Valid date range"
    
    # Test date validation
    test_dates = ["2024-03-15", "2024-13-01", "invalid-date", "2024-02-30"]
    
    for date_str in test_dates:
        is_valid, parsed_date = is_valid_date(date_str)
        if is_valid:
            business_day = is_business_day(parsed_date)
            print(f"{date_str}: Valid date, Business day: {business_day}")
        else:
            print(f"{date_str}: Invalid date")
    
    # Test date range validation
    start = date(2024, 3, 15)
    end = date(2024, 3, 10)
    is_valid_range, message = validate_date_range(start, end)
    print(f"Date range validation: {message}")

date_validation()
```

### Safe Date Calculations
```python
def safe_date_calculations():
    """Safe date calculations with error handling"""
    def safe_add_days(base_date, days):
        """Safely add days to a date"""
        try:
            if not isinstance(base_date, date):
                return None, "Base date must be a date object"
            if not isinstance(days, int):
                return None, "Days must be an integer"
            
            result = base_date + timedelta(days=days)
            return result, None
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    def safe_date_difference(date1, date2):
        """Safely calculate difference between two dates"""
        try:
            if not isinstance(date1, date) or not isinstance(date2, date):
                return None, "Both arguments must be date objects"
            
            difference = (date2 - date1).days
            return difference, None
        except Exception as e:
            return None, f"Error: {str(e)}"
    
    # Test safe calculations
    test_cases = [
        (date(2024, 3, 15), 5),
        (date(2024, 3, 15), -3),
        ("2024-03-15", 5),  # Invalid input
        (date(2024, 3, 15), "five")  # Invalid input
    ]
    
    for base_date, days in test_cases:
        result, error = safe_add_days(base_date, days)
        if error:
            print(f"Error adding {days} days to {base_date}: {error}")
        else:
            print(f"{base_date} + {days} days = {result}")

safe_date_calculations()
```

## Performance and Optimization

### Batch Date Processing
```python
def batch_date_processing():
    """Process multiple date calculations efficiently"""
    import time
    
    # Generate test data
    base_date = date(2024, 1, 1)
    test_dates = [base_date + timedelta(days=i) for i in range(1000)]
    
    # Batch add days
    start_time = time.time()
    future_dates = [d + timedelta(days=30) for d in test_dates]
    end_time = time.time()
    print(f"Batch processing 1000 dates: {end_time - start_time:.4f} seconds")
    
    # Batch business day calculations
    start_time = time.time()
    business_days = [d for d in test_dates if d.weekday() < 5]
    end_time = time.time()
    print(f"Business day filtering: {end_time - start_time:.4f} seconds")
    print(f"Business days found: {len(business_days)}")
    
    # Batch date range calculations
    start_time = time.time()
    date_ranges = [(d, d + timedelta(days=7)) for d in test_dates[:100]]
    end_time = time.time()
    print(f"Date range generation: {end_time - start_time:.4f} seconds")

batch_date_processing()
```

### Caching Strategies
```python
def caching_strategies():
    """Implement caching for date calculations"""
    # Simple cache for business day calculations
    business_day_cache = {}
    
    def cached_is_business_day(check_date):
        """Check if date is business day with caching"""
        date_key = check_date.isoformat()
        
        if date_key in business_day_cache:
            return business_day_cache[date_key]
        
        is_business = check_date.weekday() < 5
        business_day_cache[date_key] = is_business
        return is_business
    
    # Test caching
    test_dates = [date(2024, 3, 15 + i) for i in range(10)]
    
    print("Testing business day cache:")
    for test_date in test_dates:
        is_business = cached_is_business_day(test_date)
        print(f"{test_date}: {'Business day' if is_business else 'Weekend'}")
    
    print(f"Cache size: {len(business_day_cache)}")

caching_strategies()
``` 
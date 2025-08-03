# Date Calculation Code Examples

## Basic Date Operations

### Simple Date Arithmetic
```python
from datetime import date, datetime, timedelta

def basic_date_arithmetic():
    """Basic date addition and subtraction examples"""
    # Current date
    today = date.today()
    print(f"Today: {today}")
    
    # Add days
    tomorrow = today + timedelta(days=1)
    next_week = today + timedelta(weeks=1)
    next_month = today + timedelta(days=30)
    
    print(f"Tomorrow: {tomorrow}")
    print(f"Next week: {next_week}")
    print(f"Next month: {next_month}")
    
    # Subtract days
    yesterday = today - timedelta(days=1)
    last_week = today - timedelta(weeks=1)
    last_month = today - timedelta(days=30)
    
    print(f"Yesterday: {yesterday}")
    print(f"Last week: {last_week}")
    print(f"Last month: {last_month}")
    
    # Date difference
    days_diff = (tomorrow - yesterday).days
    print(f"Days between yesterday and tomorrow: {days_diff}")

basic_date_arithmetic()
```

### Date Range Generation
```python
def date_range_examples():
    """Generate date ranges and sequences"""
    start_date = date(2024, 3, 1)
    end_date = date(2024, 3, 31)
    
    # Daily range
    current_date = start_date
    daily_dates = []
    while current_date <= end_date:
        daily_dates.append(current_date)
        current_date += timedelta(days=1)
    
    print(f"Daily dates in March: {len(daily_dates)} days")
    print(f"First 5 days: {daily_dates[:5]}")
    
    # Weekly range
    weekly_dates = []
    current_date = start_date
    while current_date <= end_date:
        weekly_dates.append(current_date)
        current_date += timedelta(weeks=1)
    
    print(f"Weekly dates: {len(weekly_dates)} weeks")
    print(f"Weekly dates: {weekly_dates}")
    
    # Business day range (excluding weekends)
    business_dates = []
    current_date = start_date
    while current_date <= end_date:
        if current_date.weekday() < 5:  # Monday to Friday
            business_dates.append(current_date)
        current_date += timedelta(days=1)
    
    print(f"Business days in March: {len(business_dates)} days")

date_range_examples()
```

### Relative Date Calculations
```python
def relative_date_examples():
    """Calculate relative dates from current date"""
    today = date.today()
    
    # Common relative dates
    relative_dates = {
        "yesterday": today - timedelta(days=1),
        "tomorrow": today + timedelta(days=1),
        "next_week": today + timedelta(weeks=1),
        "last_week": today - timedelta(weeks=1),
        "next_month": today + timedelta(days=30),
        "last_month": today - timedelta(days=30),
        "next_year": today + timedelta(days=365),
        "last_year": today - timedelta(days=365)
    }
    
    print("Relative dates from today:")
    for description, calculated_date in relative_dates.items():
        print(f"{description}: {calculated_date}")
    
    # N days from now
    for n in [3, 7, 14, 30, 90]:
        future_date = today + timedelta(days=n)
        past_date = today - timedelta(days=n)
        print(f"{n} days from now: {future_date}")
        print(f"{n} days ago: {past_date}")

relative_date_examples()
```

## Advanced Date Calculations

### Business Day Calculations
```python
def business_day_examples():
    """Calculate business days excluding weekends"""
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

business_day_examples()
```

### Month and Year Calculations
```python
def month_year_examples():
    """Advanced month and year calculations"""
    from dateutil import relativedelta
    
    base_date = date(2024, 3, 15)
    print(f"Base date: {base_date}")
    
    # Month calculations
    next_month = base_date + relativedelta(months=1)
    last_month = base_date - relativedelta(months=1)
    three_months_later = base_date + relativedelta(months=3)
    six_months_ago = base_date - relativedelta(months=6)
    
    print(f"Next month: {next_month}")
    print(f"Last month: {last_month}")
    print(f"Three months later: {three_months_later}")
    print(f"Six months ago: {six_months_ago}")
    
    # Year calculations
    next_year = base_date + relativedelta(years=1)
    last_year = base_date - relativedelta(years=1)
    five_years_later = base_date + relativedelta(years=5)
    
    print(f"Next year: {next_year}")
    print(f"Last year: {last_year}")
    print(f"Five years later: {five_years_later}")
    
    # Combined calculations
    two_months_three_years_later = base_date + relativedelta(months=2, years=3)
    print(f"Two months and three years later: {two_months_three_years_later}")

month_year_examples()
```

### Calendar Navigation
```python
def calendar_navigation_examples():
    """Navigate calendar periods and boundaries"""
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
    
    def get_year_boundaries(target_date):
        """Get year start and end dates"""
        year_start = target_date.replace(month=1, day=1)
        year_end = target_date.replace(month=12, day=31)
        return year_start, year_end
    
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
    
    # Year boundaries
    year_start, year_end = get_year_boundaries(test_date) 
    print(f"Year start: {year_start}")
    print(f"Year end: {year_end}")

calendar_navigation_examples()
``` 
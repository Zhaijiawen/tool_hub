# Date Calculator -- How to Use

Pick a base date, choose what you want to calculate, and get instant results. The tool handles the calendar math so you don't have to count on your fingers.

## The Two Main Modes

### Date Arithmetic (Add/Subtract)

Start with a date, then add or subtract a time interval:

1. Pick a **base date** using the date picker (defaults to today)
2. Choose the **operation**: add or subtract
3. Enter the **amount** and **unit**: days, weeks, months, or years
4. The result date appears instantly

Examples of what you can compute:
- What date is 90 days from now?
- What was the date 3 weeks ago?
- When is 6 months from March 15?
- What date is 2 years and 45 days from today?

### Date Difference

Calculate the interval between two dates:

1. Pick a **start date**
2. Pick an **end date**
3. The tool shows the difference in multiple units: total days, weeks, months, and years

This is useful for:
- How many days until a deadline?
- How long has it been since a specific event?
- What's the age in years/months/days?

## Business Day Calculations

The tool can also skip weekends when adding days:

1. Pick your base date
2. Switch to **business days** mode
3. Enter the number of business days to add

Business days are Monday through Friday. Note that this is a simple weekend exclusion -- it doesn't account for public holidays, which vary by country and year. For holiday-aware calculations you'd need a specialized business calendar tool.

## Tips for Getting Accurate Results

- **Month boundaries**: Adding one month to January 31 gives you February 28 (or 29 in a leap year). Different tools handle this differently -- this calculator caps at the last valid day of the target month.
- **Date picker vs manual entry**: The date picker ensures valid dates. If you type manually, stick to ISO 8601 format (`YYYY-MM-DD`) to avoid ambiguity.
- **Negative values**: You can add a negative number to subtract, or just switch the operation to subtract. Both work.
- **Large intervals**: Adding 10,000 days works fine. The calculator handles dates far into the past and future.
- **Browser timezone**: Date-only calculations (without time) are timezone-independent. But the date picker uses your browser's local date, so "today" means today in your timezone.

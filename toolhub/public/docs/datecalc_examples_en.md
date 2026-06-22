# Date Calculation Examples

Real-world date math scenarios you'll actually need to compute.

## Project Deadlines

**"The client signed on March 15. The contract says delivery in 90 calendar days. When is the deadline?"**

- Base date: 2024-03-15
- Operation: Add
- Amount: 90 days
- Result: 2024-06-13

That's a Thursday. If the contract specifies business days instead, you'd switch to business day mode and the result would land in late July (90 business days is roughly 18 calendar weeks).

## Age Calculation

**"How old is someone born on July 20, 1995, as of today?"**

Use date difference mode:
- Start date: 1995-07-20
- End date: today's date
- Result: shown in years, months, and days

This handles the variable-length month issue correctly -- the tool accounts for partial months and leap years in between.

## Subscription and Billing

**"A user started a monthly subscription on January 31. When does it renew?"**

- Base date: 2024-01-31
- Operation: Add
- Amount: 1 month
- Result: 2024-02-29 (2024 is a leap year)

In a non-leap year, adding one month to January 31 gives February 28. The tool caps at the last valid day of the target month. For subscriptions you might want to check if your billing system handles this edge case the same way.

**"Quarterly billing starting April 1: when are the next 4 billing dates?"**

- April 1 + 3 months = July 1
- July 1 + 3 months = October 1
- October 1 + 3 months = January 1 (next year)
- January 1 + 3 months = April 1 (next year)

## Business Day Calculations

**"A support ticket came in Friday at 4 PM. SLA is 3 business days. When is it due?"**

- Base date: 2024-03-15 (Friday)
- Operation: Add
- Amount: 3 business days
- Result: 2024-03-20 (Wednesday)

Skipping Saturday and Sunday, then Monday is 1, Tuesday is 2, Wednesday is 3 business days.

## Warranty Expiration

**"Product purchased June 15, 2023, with a 2-year warranty. When does it expire?"**

- Base date: 2023-06-15
- Operation: Add
- Amount: 2 years
- Result: 2025-06-15

Simple in this case because it's the same day of the same month two years later. The tool handles leap year February edge cases automatically.

## Historical / Look-Back

**"What was the date 1000 days ago?"**

Use subtract mode: pick today, subtract 1000 days. The tool handles the calendar math across years, months, and leap years. No mental arithmetic needed.

## Day Count Between Events

**"How many days between the project start (Jan 10) and the launch date (Sep 5)?"**

Date difference mode:
- Start: 2024-01-10
- End: 2024-09-05
- Result: 239 days

This accounts for the irregular month boundaries between January and September -- January (22 remaining days) + February (29) + March (31) + April (30) + May (31) + June (30) + July (31) + August (31) + September (5) = 239.

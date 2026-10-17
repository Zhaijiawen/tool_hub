# Python Runner — Examples

## Quick stats on a set of numbers

```python
import statistics
import random

data = [random.randint(1, 100) for _ in range(1000)]
print(f"mean: {statistics.mean(data):.2f}")
print(f"stdev: {statistics.stdev(data):.2f}")
```

Click the "stats" example to run it; it prints mean and standard deviation.

## Parse a JSON string

```python
import json
raw = '{"name": "ToolHub", "tags": ["wasm", "python"]}'
data = json.loads(raw)
print(f"name: {data['name']}")
print(f"tag count: {len(data['tags'])}")
```

Handy for poking at API responses or quick formatting.

## Extract order numbers with regex

```python
import re
text = "order A2026-1001 shipped; order B2026-1002 pending"
orders = re.findall(r"[A-Z]\d{4}-\d{4}", text)
print(orders)
```

The built-in "regex" example shows extraction, masking, and grouped counting.

## Days between two dates

```python
import datetime
d1 = datetime.date(2026, 10, 17)
d2 = d1 + datetime.timedelta(days=30)
print((d2 - d1).days)  # 30
```

The built-in "datetime" example also covers timestamp conversion and days-in-month.

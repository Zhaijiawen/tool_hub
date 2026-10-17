# Python 运行器 — 使用示例

## 快速统计一组数

```python
import statistics
import random

data = [random.randint(1, 100) for _ in range(1000)]
print(f"均值: {statistics.mean(data):.2f}")
print(f"标准差: {statistics.stdev(data):.2f}")
```

点「统计」示例即可运行，输出均值和标准差。

## 解析一段 JSON

```python
import json
raw = '{"name": "ToolHub", "tags": ["wasm", "python"]}'
data = json.loads(raw)
print(f"名称: {data['name']}")
print(f"标签数: {len(data['tags'])}")
```

处理接口返回的字符串、随手格式化都好用。

## 用正则从文本抽订单号

```python
import re
text = "订单 A2026-1001 已发货; 订单 B2026-1002 待付款"
orders = re.findall(r"[A-Z]\d{4}-\d{4}", text)
print(orders)
```

内置「正则」示例，演示提取、脱敏、分组计数。

## 算两个日期差多少天

```python
import datetime
d1 = datetime.date(2026, 10, 17)
d2 = d1 + datetime.timedelta(days=30)
print((d2 - d1).days)  # 30
```

内置「日期」示例还包含时间戳互转、月份天数等。

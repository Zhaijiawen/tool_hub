# CSV/TSV Viewer Examples

Real data formats you'll encounter and how the tool handles them.

## Standard CSV (Comma)

**Paste this and select "Comma" as delimiter:**

```
name,department,title,join_date
Alice,Engineering,Senior Engineer,2021-03-15
Bob,Product,Product Manager,2020-07-01
Carol,Design,UI Designer,2022-01-10
```

**Result:**

| name | department | title | join_date |
|---|---|---|---|
| Alice | Engineering | Senior Engineer | 2021-03-15 |
| Bob | Product | Product Manager | 2020-07-01 |
| Carol | Design | UI Designer | 2022-01-10 |

Straightforward. Four columns, three data rows, clean separators.

## TSV (Tab-Separated)

Common in database exports. **Select "Tab" as delimiter:**

```
order_id	user_id	amount	status
10001	U1001	299.00	completed
10002	U1002	59.90	pending
10003	U1003	1299.00	refunded
```

Tabs are invisible in most text editors, which is why TSV can be hard to inspect by eye. The viewer makes this painless.

## CSV with Embedded Delimiters and Newlines

**This is where parsing gets interesting:**

```
name,address,note
Alice,"New York, NY","Works in finance,
part-time photographer"
Bob,Chicago,"Regular customer"
```

The address field `"New York, NY"` has a comma inside it -- the quotes protect it. The note for Alice spans two lines -- again, handled because the field is quoted. The viewer parses this correctly, showing a proper two-row table, not a broken three-row mess.

## nginx Access Log (Space-Separated)

**Select "Space" as delimiter:**

```
127.0.0.1 - frank [10/Oct/2024:13:55:36 -0700] GET /index.html 200 2326
192.168.1.5 - - [10/Oct/2024:14:01:12 -0700] POST /api/login 401 128
```

Space-delimited logs are tricky because the bracket-enclosed fields `[10/Oct/2024:...]` contain spaces. The viewer does its best but for complex log formats you might get better results with a dedicated log parser. Still, it gives a quick visual overview.

## European Excel (Semicolon)

In many European locales, commas are decimal separators. Excel exports use semicolons instead:

**Select "Semicolon" as delimiter:**

```
Product;Price;Quantity
Laptop;999,99;5
Mouse;29,99;50
Monitor;349,00;10
```

Note `999,99` -- that's the European way of writing 999.99. If you tried to parse this with comma as delimiter you'd get nonsense. Auto-detect usually gets this right.

## JSON Export

After parsing the employee CSV from Example 1 and clicking Copy:

```json
[
  { "name": "Alice", "department": "Engineering", "title": "Senior Engineer", "join_date": "2021-03-15" },
  { "name": "Bob", "department": "Product", "title": "Product Manager", "join_date": "2020-07-01" },
  { "name": "Carol", "department": "Design", "title": "UI Designer", "join_date": "2022-01-10" }
]
```

Ready to paste into any code that works with JSON. All values are strings (CSV has no type information), so you'll need to do your own type conversion if you need numbers or dates.

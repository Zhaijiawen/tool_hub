# CSV / TSV Preview - Examples

## Example 1: Standard CSV (comma-separated)

**Paste the content below and select "Comma" as delimiter:**

```
name,department,title,join_date
Alice,Engineering,Senior Engineer,2021-03-15
Bob,Product,Product Manager,2020-07-01
Carol,Design,UI Designer,2022-01-10
```

**Parsed result:**

| name | department | title | join_date |
|------|-----------|-------|-----------|
| Alice | Engineering | Senior Engineer | 2021-03-15 |
| Bob | Product | Product Manager | 2020-07-01 |
| Carol | Design | UI Designer | 2022-01-10 |

---

## Example 2: TSV (tab-separated)

Tab-separated files are common in database exports and log pipelines.

**Paste the content below and select "Tab" as delimiter:**

```
order_id	user_id	amount	status
10001	U1001	299.00	completed
10002	U1002	59.90	pending
10003	U1003	1299.00	refunded
```

---

## Example 3: CSV with special characters

**Quoted fields protect commas and embedded newlines:**

```
name,address,note
Alice,"New York, NY","Works in finance,
part-time photographer"
Bob,Chicago,"Regular customer"
```

The tool correctly parses multi-line fields and addresses containing commas.

---

## Example 4: nginx log (space-separated)

**Select "Space" as delimiter:**

```
127.0.0.1 - frank [10/Oct/2024:13:55:36 -0700] GET /index.html 200 2326
192.168.1.5 - - [10/Oct/2024:14:01:12 -0700] POST /api/login 401 128
```

---

## Example 5: European Excel export (semicolon-separated)

In European locales, Excel uses commas as decimal separators, so CSV exports use semicolons as delimiters.

**Select "Semicolon" as delimiter:**

```
Product;Price;Quantity
Laptop;999.99;5
Mouse;29.99;50
Monitor;349.00;10
```

---

## Copy as JSON Example

After parsing Example 1 and clicking "Copy":

```json
[
  { "name": "Alice", "department": "Engineering", "title": "Senior Engineer", "join_date": "2021-03-15" },
  { "name": "Bob", "department": "Product", "title": "Product Manager", "join_date": "2020-07-01" },
  { "name": "Carol", "department": "Design", "title": "UI Designer", "join_date": "2022-01-10" }
]
```

Ready to paste directly into JavaScript, Python, or any other code.


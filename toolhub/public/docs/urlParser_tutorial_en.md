# URL Parser — Tutorial

## Parse a URL

1. Paste the full URL into the input field (auto-parses on input)
2. A **Valid URL** or **Invalid URL** tag appears at the top
3. View the "Parts" tab for a breakdown of all fields

## View Query Parameters

1. Switch to the "Query Params" tab
2. Parameters are displayed as a table (key/value columns)
3. Check "URL-decode values" to show `%E4%B8%AD%E6%96%87` as readable text
4. Click "Copy" next to any row to copy that parameter's value
5. Click "Copy All Params" to copy all params in `key=value` format

## Use the URL Builder

1. Switch to the "Builder" tab
2. After parsing a URL, the fields are pre-filled automatically
3. Modify any field — the "Built URL" result updates in real time
4. Click the copy button to copy the assembled URL

## FAQ

**Q: The URL shows as invalid but I know it's correct?**

A: Parsing requires a full protocol prefix, like `https://` or `http://`. Entering just `example.com` won't work.

**Q: Parameter values look garbled?**

A: Enable the "URL-decode values" option.


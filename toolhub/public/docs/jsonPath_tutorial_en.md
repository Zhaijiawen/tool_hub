# JSONPath Query - Tutorial

Think of JSONPath as a search tool for JSON. You've got a JSON document, you write a path expression, you get back exactly the nodes that match. No grepping, no manual traversal.

## Quick start

Hit one of the example buttons ("All Titles", "Books Under $10", etc.) to load demo data and see queries in action. The best way to learn is to modify the example queries and watch the results change.

## Working with your own data

1. Paste your JSON into the left panel
2. Hit Format if it's a minified mess
3. If there's a syntax error, the tool highlights it -- fix it before querying
4. Write your JSONPath expression in the right input

The query runs as you type. No submit button needed.

## The expressions you'll use most

**Navigate to a field:**
```
$.user.name
```
Straightforward property access. Returns the value at that path.

**Get all items in an array:**
```
$.items[*]
```
The `*` wildcard matches every element. Combined with a property access: `$.items[*].id` gets all IDs.

**Recursive search -- find all matching keys at any depth:**
```
$..id
```
Super useful when you don't know (or care) how deep a field is nested. `$..price` finds every price in the document, whether it's at `$.store.book[0].price` or `$.store.bicycle.price`.

**Filter with conditions:**
```
$.products[?(@.price < 100 && @.inStock == true)]
```
This is where things get interesting. The `@` symbol refers to each array element as the filter iterates. You're saying: "give me every product where the price is under 100 AND it's in stock."

**Array slicing:**
```
$.items[0:3]    // first 3
$.items[-3:]    // last 3
$.items[1:4]    // indices 1, 2, 3
```
Classic start:end slicing. Start is inclusive, end is exclusive, just like JavaScript's `.slice()`.

**Multi-index selection:**
```
$.items[0,2,4]
```
Picks specific indices. Not a range -- exactly those three.

**Regex filtering:**
```
$.users[?(@.email =~ /.*@gmail\.com/)]
```
The `=~` operator does regex matching. Great for pattern-based filtering on string fields.

## Reading results

The result panel shows match count in a green tag. Results display as formatted JSON. Hit Copy to grab them. If nothing matches, you'll see an empty result -- double-check your path is targeting the right structure.

## Real-world patterns

API response with an envelope:
```json
{"code": 0, "data": {"users": [{"id": 1, "name": "Alice"}, {"id": 2, "name": "Bob"}]}}
```
Extract all names: `$.data.users[*].name`

Nested paginated response:
```json
{"data": {"items": [...], "total": 100}}
```
Count check: `$.data.total`
Get items: `$.data.items[*]`

## Gotchas

- JSONPath is case-sensitive. `$.User` is not `$.user`.
- The `..` recursive operator can be slow on very large documents (100K+ nodes). Be specific when you can.
- Filters with `=~` use JavaScript regex syntax, not POSIX. Case-insensitive flag works: `=~ /pattern/i`.
- Some implementations don't support `[-1]` for last element. `jsonpath-plus` does.

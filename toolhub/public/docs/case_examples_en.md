# Case Conversion -- Real Examples

These are scenarios you'll actually hit in day-to-day development work.

## Normalizing Messy Input

Users type things in all kinds of inconsistent ways. Here's how to clean it up:

**Input (what a user typed):**
```
hELLO wORLD this IS a TEST
```

**Sentence case output:**
```
Hello world this is a test
```

Much more readable. One click and it looks like a normal person wrote it.

## Prepping Field Names for Display

API responses often use snake_case. If you're showing these as labels in a UI, Title Case or Sentence case makes them presentable:

**Input (API field names):**
```
user_first_name
user_last_name
email_address
```

**Title Case output:**
```
User First Name
User Last Name
Email Address
```

Now they look like actual labels instead of database columns.

## Creating a Constants File

Got a list of configuration keys or error codes that should be SCREAMING_SNAKE_CASE? Drop them in and hit UPPERCASE:

**Input:**
```
maximum retry count
database connection timeout
api rate limit exceeded
```

**UPPERCASE output:**
```
MAXIMUM RETRY COUNT
DATABASE CONNECTION TIMEOUT
API RATE LIMIT EXCEEDED
```

From there it's a quick find-and-replace to swap spaces for underscores. The tool does the heavy lifting of normalizing the case.

## Preparing URL Slugs

When you need to turn titles or headings into URL-friendly lowercase text:

**Input:**
```
My Button Component
Header Navigation Bar
Footer Social Links
```

**lowercase output:**
```
my button component
header navigation bar
footer social links
```

Then replace spaces with hyphens and you've got clean URL slugs. The tool handles the case step; the rest is a simple text edit.

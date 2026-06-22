# Shell — What's Going On Under the Hood

The shell is both a REPL and a scripting language. It's the glue that holds Unix systems together — you type commands, and the shell interprets, expands, and executes them. Bash (Bourne Again Shell, 1989) is the default on most Linux distros and macOS. Zsh is the default on macOS since Catalina. Fish is the user-friendly newcomer.

## How Commands Execute

When you type `ls -la *.txt`, the shell does several things before running anything:

1. **Tokenization** — splits the line into words: `ls`, `-la`, `*.txt`
2. **Expansion** — `*.txt` expands via globbing to matching filenames
3. **Redirection** — sets up `>`, `<`, `|`, `2>&1`
4. **Execution** — `fork()` + `exec()` to run `ls` in a child process

Pipes `|` connect stdout of one command to stdin of the next. Everything is a file descriptor (stdin=0, stdout=1, stderr=2).

## Scripting Basics

```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined var, pipe failure

NAME=${1:-World}   # First arg, default to "World"
echo "Hello, $NAME"

# Loops
for file in *.txt; do
  echo "Processing $file"
  wc -l "$file"
done

# Conditionals
if [[ -f config.yaml ]]; then
  echo "Config found"
else
  echo "No config"
fi
```

## Variables and Quoting

```bash
name="John"           # No spaces around =
greeting="Hello, $name"  # Double quotes: variables expand
literal='Hello, $name'   # Single quotes: literal string

# Command substitution
now=$(date +%Y-%m-%d)
files=$(ls /var/log)
```

The golden rule: **always quote variable expansions unless you explicitly want word splitting**. `"$var"` is safe; `$var` splits on whitespace.

## Common Patterns

```bash
# Find and process files
find . -name "*.log" -mtime +7 -exec rm {} \;

# Text processing pipeline
cat access.log | grep " 500 " | awk '{print $1}' | sort | uniq -c | sort -rn | head -10

# Loop over command output
while IFS= read -r line; do
  echo "Got: $line"
done < file.txt
```

## `set -euo pipefail`

Put this at the top of every script:
- `-e` — exit immediately if any command fails
- `-u` — treat unset variables as errors
- `-o pipefail` — a pipe fails if any component fails, not just the last one

Without these, scripts silently continue after errors, which is how disasters happen in production.

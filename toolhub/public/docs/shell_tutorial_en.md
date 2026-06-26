# Shell — Using the Formatter

Paste messy shell scripts into the editor, hit format, and get clean, readable output.

## Hello World

```bash
#!/bin/bash
echo "Hello, World!"
```

Make it executable and run:

```bash
chmod +x script.sh
./script.sh
```

## Variables

```bash
name="John"
age=25
echo "Name: $name, Age: $age"

# Default values
greeting=${1:-"Hello"}  # Use first arg, default to "Hello"

# Command substitution
now=$(date)
files_count=$(ls | wc -l)
```

## Conditionals

```bash
if [[ "$age" -ge 18 ]]; then
  echo "Adult"
elif [[ "$age" -ge 13 ]]; then
  echo "Teenager"
else
  echo "Child"
fi

# File tests
if [[ -f "config.yaml" ]]; then echo "File exists"; fi
if [[ -d "/var/log" ]]; then echo "Directory exists"; fi

# String tests
if [[ "$name" == "John" ]]; then echo "Match"; fi
if [[ -z "$var" ]]; then echo "Empty"; fi   # -z = zero length
```

## Loops

```bash
# For loop
for i in {1..5}; do
  echo "Number: $i"
done

for file in *.txt; do
  echo "Processing $file"
done

# While loop
count=0
while [[ $count -lt 5 ]]; do
  echo "Count: $count"
  ((count++))
done

# Read file line by line
while IFS= read -r line; do
  echo "$line"
done < input.txt
```

## Functions

```bash
greet() {
  local name=$1
  echo "Hello, $name!"
}

greet "John"

# Function with return value (0-255)
is_even() {
  (( $1 % 2 == 0 ))
}
```

## Practical Tips

- Start every script with `#!/bin/bash` and `set -euo pipefail`
- Always quote variables: `"$var"`, not `$var`
- Use `[[ ]]` for tests, not `[ ]` — it's safer and has more features
- `shellcheck` is the linter you want — it catches common mistakes before they become incidents

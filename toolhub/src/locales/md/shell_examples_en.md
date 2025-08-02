# Shell Code Examples

This document provides practical shell code examples covering core concepts.

## Basic Script Examples

### Hello World Script

```bash
#!/bin/bash
echo "Hello, World!"
```

### Simple Variable Usage

```bash
#!/bin/bash

# Variable assignment
name="Shell"
version="5.0"
is_active=true

# Using variables
echo "Name: $name"
echo "Version: $version"
echo "Active: $is_active"

# Command substitution
current_time=$(date)
echo "Current time: $current_time"

# Arithmetic operations
a=10
b=5
sum=$((a + b))
echo "Sum: $sum"
```

### File Operations

```bash
#!/bin/bash

# Create a file
echo "Hello, Shell!" > output.txt

# Append to file
echo "This is a new line" >> output.txt

# Read file content
content=$(cat output.txt)
echo "File content: $content"

# Check if file exists
if [ -f "output.txt" ]; then
    echo "File exists"
else
    echo "File does not exist"
fi

# Copy file
cp output.txt backup.txt

# Remove file
rm output.txt
```

## Control Structures

### If-Else Statements

```bash
#!/bin/bash

# Number comparison
number=15

if [ $number -gt 10 ]; then
    echo "Number is greater than 10"
elif [ $number -eq 10 ]; then
    echo "Number is equal to 10"
else
    echo "Number is less than 10"
fi

# String comparison
name="John"

if [ "$name" = "John" ]; then
    echo "Hello, John!"
elif [ "$name" = "Jane" ]; then
    echo "Hello, Jane!"
else
    echo "Hello, stranger!"
fi

# File and directory checks
if [ -f "file.txt" ]; then
    echo "File exists"
fi

if [ -d "directory" ]; then
    echo "Directory exists"
fi
```

### Loops

```bash
#!/bin/bash

# For loop with range
for i in {1..5}; do
    echo "Number: $i"
done

# For loop with list
for fruit in apple banana orange; do
    echo "Fruit: $fruit"
done

# While loop
counter=0
while [ $counter -lt 5 ]; do
    echo "Counter: $counter"
    ((counter++))
done

# Until loop
count=0
until [ $count -ge 3 ]; do
    echo "Count: $count"
    ((count++))
done

# For loop with files
for file in *.txt; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
    fi
done
```

### Case Statement

```bash
#!/bin/bash

# Simple case statement
day="Monday"

case $day in
    "Monday")
        echo "Start of the week"
        ;;
    "Tuesday"|"Wednesday"|"Thursday")
        echo "Mid week"
        ;;
    "Friday")
        echo "End of work week"
        ;;
    "Saturday"|"Sunday")
        echo "Weekend"
        ;;
    *)
        echo "Unknown day"
        ;;
esac
```

## Functions

### Basic Functions

```bash
#!/bin/bash

# Function definition
greet() {
    local name=$1
    echo "Hello, $name!"
}

# Function call
greet "Alice"
greet "Bob"

# Function with multiple parameters
calculate() {
    local a=$1
    local b=$2
    local operation=$3
    
    case $operation in
        "add")
            echo $((a + b))
            ;;
        "subtract")
            echo $((a - b))
            ;;
        "multiply")
            echo $((a * b))
            ;;
        "divide")
            echo $((a / b))
            ;;
        *)
            echo "Unknown operation"
            ;;
    esac
}

# Using the function
result=$(calculate 10 5 "add")
echo "Result: $result"
```

### Function with Return Values

```bash
#!/bin/bash

# Function that returns a value
is_even() {
    local number=$1
    if [ $((number % 2)) -eq 0 ]; then
        return 0  # Success (even)
    else
        return 1  # Failure (odd)
    fi
}

# Using the function
for i in {1..10}; do
    if is_even $i; then
        echo "$i is even"
    else
        echo "$i is odd"
    fi
done
```

## Text Processing

### Grep Examples

```bash
#!/bin/bash

# Search for pattern in file
grep "pattern" file.txt

# Case insensitive search
grep -i "pattern" file.txt

# Show line numbers
grep -n "pattern" file.txt

# Invert match (show lines without pattern)
grep -v "pattern" file.txt

# Recursive search in directories
grep -r "pattern" directory/

# Count matches
grep -c "pattern" file.txt
```

### Sed Examples

```bash
#!/bin/bash

# Replace text
sed 's/old/new/g' file.txt

# Replace only first occurrence per line
sed 's/old/new/' file.txt

# In-place editing
sed -i 's/old/new/g' file.txt

# Delete lines containing pattern
sed '/pattern/d' file.txt

# Print only lines 5-10
sed -n '5,10p' file.txt

# Add text to beginning of each line
sed 's/^/prefix: /' file.txt
```

### Awk Examples

```bash
#!/bin/bash

# Print first field of each line
awk '{print $1}' file.txt

# Print lines matching pattern
awk '/pattern/ {print $0}' file.txt

# Print lines where field 3 is greater than 10
awk '$3 > 10 {print $0}' file.txt

# Calculate sum of field 2
awk '{sum += $2} END {print "Sum:", sum}' file.txt

# Print formatted output
awk '{printf "Name: %s, Age: %s\n", $1, $2}' file.txt
```

## File and Directory Operations

### Directory Navigation

```bash
#!/bin/bash

# Get current directory
current_dir=$(pwd)
echo "Current directory: $current_dir"

# Change directory
cd /path/to/directory

# Go to home directory
cd ~

# Go to parent directory
cd ..

# Create directory
mkdir new_directory

# Create nested directories
mkdir -p parent/child/grandchild

# List directory contents
ls -la

# List only directories
ls -d */
```

### File Management

```bash
#!/bin/bash

# Copy files
cp source.txt destination.txt

# Copy directory recursively
cp -r source_dir/ destination_dir/

# Move/rename files
mv oldname.txt newname.txt

# Remove files
rm file.txt

# Remove directory and contents
rm -rf directory/

# Create symbolic link
ln -s target_file link_name

# Find files by name
find . -name "*.txt"

# Find files by size (larger than 1MB)
find . -size +1M
```

## Process Management

### Process Control

```bash
#!/bin/bash

# Run command in background
sleep 10 &

# List background jobs
jobs

# Bring job to foreground
fg %1

# Send job to background
bg %1

# Kill process by PID
kill 1234

# Kill process by name
killall process_name

# Check if process is running
if pgrep -x "process_name" > /dev/null; then
    echo "Process is running"
else
    echo "Process is not running"
fi
```

### System Information

```bash
#!/bin/bash

# Get system information
echo "Hostname: $(hostname)"
echo "User: $(whoami)"
echo "Current date: $(date)"
echo "Uptime: $(uptime)"

# Get disk usage
df -h

# Get memory usage
free -h

# Get CPU information
lscpu

# Get process list
ps aux

# Get network connections
netstat -tuln
```

## Error Handling

### Exit Codes and Error Checking

```bash
#!/bin/bash

# Check if command succeeded
if command; then
    echo "Command succeeded"
else
    echo "Command failed with exit code $?"
fi

# Check if file exists before processing
if [ -f "input.txt" ]; then
    echo "Processing input.txt"
    # Process the file
else
    echo "Error: input.txt not found"
    exit 1
fi

# Check if directory is writable
if [ -w "/tmp" ]; then
    echo "Directory is writable"
else
    echo "Error: Cannot write to directory"
    exit 1
fi
```

### Error Trapping

```bash
#!/bin/bash

# Trap errors and exit
trap 'echo "Error occurred on line $LINENO"; exit 1' ERR

# Trap script exit
trap 'echo "Script completed"' EXIT

# Set strict error handling
set -e  # Exit on any error
set -u  # Exit on undefined variables

# Your script logic here
echo "Script is running"
# This will cause an error and exit
undefined_variable

echo "This line will not be reached"
```

## Advanced Features

### Arrays

```bash
#!/bin/bash

# Declare array
fruits=("apple" "banana" "orange")

# Access array elements
echo "First fruit: ${fruits[0]}"
echo "All fruits: ${fruits[@]}"

# Array length
echo "Number of fruits: ${#fruits[@]}"

# Add element to array
fruits+=("grape")

# Loop through array
for fruit in "${fruits[@]}"; do
    echo "Fruit: $fruit"
done

# Associative array (Bash 4+)
declare -A person
person["name"]="John"
person["age"]="25"
echo "Name: ${person["name"]}"
```

### Here Documents

```bash
#!/bin/bash

# Create file with here document
cat > config.txt << EOF
# Configuration file
HOST=localhost
PORT=8080
DEBUG=true
EOF

# Use here document for command input
grep "pattern" << EOF
line 1
line 2 with pattern
line 3
EOF
```

These examples demonstrate core shell concepts and best practices for effective shell scripting. 
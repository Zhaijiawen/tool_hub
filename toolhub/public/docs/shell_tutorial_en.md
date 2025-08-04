# Shell Usage Tutorial

This tutorial provides a comprehensive guide to getting started with shell scripting and command-line usage.

## Environment Setup

### Installing Shell

Most Unix-like systems come with a shell pre-installed:

**Linux**: Bash is typically the default shell
```bash
# Check current shell
echo $SHELL

# Install additional shells
sudo apt install zsh fish  # Ubuntu/Debian
sudo yum install zsh       # CentOS/RHEL
```

**macOS**: Bash and Zsh are pre-installed
```bash
# Switch to Zsh (default in newer macOS)
chsh -s /bin/zsh
```

**Windows**: Install WSL or use Git Bash
```bash
# Install WSL
wsl --install
```

### Terminal Setup

**Choose a Terminal Emulator**:
- **Linux**: GNOME Terminal, Konsole, xterm
- **macOS**: Terminal.app, iTerm2
- **Windows**: Windows Terminal, ConEmu

**Configure Your Shell**:
```bash
# Edit shell configuration
nano ~/.bashrc    # For Bash
nano ~/.zshrc     # For Zsh
```

## Basic Shell Commands

### Navigation Commands

```bash
# Change directory
cd /path/to/directory
cd ~              # Home directory
cd ..             # Parent directory
cd -              # Previous directory

# List files and directories
ls
ls -la           # All files with details
ls -lh           # Human-readable sizes
ls *.txt         # List specific file types

# Print working directory
pwd

# Create directories
mkdir new_directory
mkdir -p parent/child  # Create nested directories
```

### File Operations

```bash
# Copy files
cp source.txt destination.txt
cp -r directory/ destination/  # Copy directories

# Move/rename files
mv oldname.txt newname.txt
mv file.txt /path/to/directory/

# Remove files
rm file.txt
rm -rf directory/  # Remove directory and contents

# View file contents
cat file.txt
less file.txt      # Scrollable view
head -10 file.txt  # First 10 lines
tail -10 file.txt  # Last 10 lines
```

### Text Processing

```bash
# Search in files
grep "pattern" file.txt
grep -i "pattern" file.txt  # Case insensitive
grep -r "pattern" directory/  # Recursive search

# Replace text
sed 's/old/new/g' file.txt
sed -i 's/old/new/g' file.txt  # In-place editing

# Process text with awk
awk '{print $1}' file.txt  # Print first field
awk '/pattern/ {print $0}' file.txt  # Print matching lines

# Sort and filter
sort file.txt
sort -u file.txt  # Remove duplicates
uniq file.txt     # Remove consecutive duplicates
```

## Shell Scripting Basics

### Creating Scripts

```bash
#!/bin/bash
# This is a comment
echo "Hello, World!"
```

**Make script executable**:
```bash
chmod +x script.sh
./script.sh
```

### Variables

```bash
#!/bin/bash

# Variable assignment
name="John"
age=25

# Using variables
echo "Name: $name"
echo "Age: $age"

# Command substitution
current_date=$(date)
echo "Current date: $current_date"

# Read user input
read -p "Enter your name: " user_name
echo "Hello, $user_name!"
```

### Control Structures

**If Statements**:
```bash
#!/bin/bash

if [ $1 -gt 10 ]; then
    echo "Number is greater than 10"
elif [ $1 -eq 10 ]; then
    echo "Number is equal to 10"
else
    echo "Number is less than 10"
fi

# String comparison
if [ "$name" = "John" ]; then
    echo "Hello, John!"
fi
```

**Loops**:
```bash
#!/bin/bash

# For loop
for i in {1..5}; do
    echo "Number: $i"
done

# While loop
counter=0
while [ $counter -lt 5 ]; do
    echo "Counter: $counter"
    ((counter++))
done

# For loop with files
for file in *.txt; do
    echo "Processing: $file"
done
```

### Functions

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

# Function with return value
calculate_sum() {
    local a=$1
    local b=$2
    echo $((a + b))
}

result=$(calculate_sum 5 3)
echo "Sum: $result"
```

## Advanced Features

### I/O Redirection

```bash
# Redirect output to file
echo "Hello" > output.txt

# Append to file
echo "World" >> output.txt

# Redirect input from file
cat < input.txt

# Pipe output to another command
ls -la | grep "\.txt$"

# Redirect both output and errors
command > output.txt 2>&1
```

### Process Management

```bash
# Run command in background
sleep 10 &

# List background jobs
jobs

# Bring job to foreground
fg %1

# Send job to background
bg %1

# Kill process
kill 1234
killall process_name
```

### Environment Variables

```bash
# Set environment variable
export PATH="/usr/local/bin:$PATH"

# View all environment variables
env

# Use specific variables
echo "User: $USER"
echo "Home: $HOME"
echo "Path: $PATH"
```

## Error Handling

### Exit Codes

```bash
#!/bin/bash

# Check if command succeeded
if command; then
    echo "Command succeeded"
else
    echo "Command failed with exit code $?"
fi

# Exit script with specific code
exit 1
```

### Error Trapping

```bash
#!/bin/bash

# Trap errors
trap 'echo "Error occurred"; exit 1' ERR

# Set strict error handling
set -e  # Exit on any error
set -u  # Exit on undefined variables
```

## Best Practices

### Script Organization

```bash
#!/bin/bash

# Script header
# Author: Your Name
# Date: 2024-01-01
# Description: Brief description

# Configuration
CONFIG_FILE="/etc/config.conf"
LOG_FILE="/var/log/script.log"

# Functions
log_message() {
    echo "$(date): $1" >> "$LOG_FILE"
}

# Main script
main() {
    log_message "Script started"
    # Your script logic here
    log_message "Script completed"
}

# Call main function
main "$@"
```

### Input Validation

```bash
#!/bin/bash

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    echo "Usage: $0 <arg1> <arg2>"
    exit 1
fi

# Validate file existence
if [ ! -f "$1" ]; then
    echo "Error: File $1 does not exist"
    exit 1
fi

# Check if directory is writable
if [ ! -w "/tmp" ]; then
    echo "Error: Cannot write to /tmp"
    exit 1
fi
```

### Debugging

```bash
#!/bin/bash

# Enable debugging
set -x  # Print commands before execution

# Your script here

# Disable debugging
set +x
```

This tutorial covers essential shell concepts and practices. Continue exploring shell features to become proficient in command-line usage and scripting. 
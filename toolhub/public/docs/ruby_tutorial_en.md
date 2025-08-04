# Ruby Usage Tutorial

This tutorial provides a comprehensive guide to getting started with Ruby development.

## Environment Setup

### Installing Ruby

1. **Download Ruby** from the official website (ruby-lang.org)
2. **Install Ruby** for your operating system:
   - **Windows**: Use RubyInstaller or WSL
   - **macOS**: Use Homebrew: `brew install ruby`
   - **Linux**: Use package manager: `sudo apt install ruby`

3. **Verify Installation**:
   ```bash
   ruby -v
   ```

### Version Management

**Using rbenv**:
```bash
# Install rbenv
brew install rbenv

# Install Ruby
rbenv install 3.2.0
rbenv global 3.2.0
```

**Using RVM**:
```bash
# Install RVM
curl -sSL https://get.rvm.io | bash -s stable

# Install Ruby
rvm install 3.2.0
rvm use 3.2.0 --default
```

### IDE Setup
- **RubyMine**: Professional Ruby IDE
- **VS Code**: Lightweight with Ruby extensions
- **Sublime Text**: Fast text editor
- **Vim/Emacs**: Terminal-based editors

## Basic Ruby Syntax

### Hello World

```ruby
puts "Hello, World!"
```

### Variables and Data Types

```ruby
# Variables
name = "Ruby"
age = 25
height = 5.9
is_dynamic = true

# Arrays
fruits = ["apple", "banana", "orange"]
person = {
  "name" => "John",
  "age" => 25
}

# Symbols
status = :active

# Output
puts "Name: #{name}"
puts "Age: #{age}"
```

### Control Structures

```ruby
age = 18

# If-else statement
if age >= 18
  puts "Adult"
else
  puts "Minor"
end

# Unless statement
unless age < 18
  puts "Can vote"
end

# Case statement
case age
when 16
  puts "Can drive with supervision"
when 18
  puts "Can vote and drive"
else
  puts "Other age"
end

# Loops
5.times { |i| puts "Count: #{i}" }

fruits = ["apple", "banana", "orange"]
fruits.each { |fruit| puts fruit }

for i in 0..4
  puts "Loop: #{i}"
end
```

## Methods

### Basic Methods

```ruby
# Method definition
def greet(name)
  "Hello, #{name}!"
end

# Method call
puts greet("John")

# Method with default parameter
def greet_with_title(name, title = "Mr.")
  "Hello, #{title} #{name}!"
end

puts greet_with_title("John")
puts greet_with_title("Jane", "Dr.")
```

### Method with Blocks

```ruby
def repeat(times)
  times.times do |i|
    yield i if block_given?
  end
end

repeat(3) { |i| puts "Iteration #{i}" }
```

## Collections

### Arrays

```ruby
# Creating arrays
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]

# Array operations
fruits << "grape"
fruits.push("mango")
fruits.pop
fruits.shift

# Array methods
puts fruits.length
puts fruits.include?("apple")
puts fruits.first
puts fruits.last

# Array iteration
fruits.each { |fruit| puts fruit }
fruits.map { |fruit| fruit.upcase }
fruits.select { |fruit| fruit.length > 5 }
```

### Hashes

```ruby
# Creating hashes
person = {
  name: "John",
  age: 25,
  city: "New York"
}

# Hash operations
person[:email] = "john@example.com"
person.delete(:age)

# Hash iteration
person.each { |key, value| puts "#{key}: #{value}" }
person.each_key { |key| puts key }
person.each_value { |value| puts value }
```

## Object-Oriented Programming

### Classes and Objects

```ruby
class Person
  attr_accessor :name, :age
  
  def initialize(name, age)
    @name = name
    @age = age
  end
  
  def introduce
    "Hi, I'm #{@name} and I'm #{@age} years old."
  end
  
  def adult?
    @age >= 18
  end
end

# Creating objects
person = Person.new("John", 25)
puts person.introduce
puts person.adult?
```

### Inheritance

```ruby
class Student < Person
  attr_accessor :student_id
  
  def initialize(name, age, student_id)
    super(name, age)
    @student_id = student_id
  end
  
  def introduce
    super + " My student ID is #{@student_id}."
  end
end

student = Student.new("Jane", 20, "S12345")
puts student.introduce
```

### Modules

```ruby
module MathHelper
  def square(x)
    x * x
  end
  
  def cube(x)
    x * x * x
  end
end

class Calculator
  include MathHelper
end

calc = Calculator.new
puts calc.square(5)
puts calc.cube(3)
```

## File Handling

### Reading Files

```ruby
# Reading entire file
content = File.read("example.txt")
puts content

# Reading line by line
File.open("example.txt", "r") do |file|
  file.each_line do |line|
    puts line.chomp
  end
end

# Reading with encoding
File.open("example.txt", "r:UTF-8") do |file|
  content = file.read
end
```

### Writing Files

```ruby
# Writing to file
File.write("output.txt", "Hello, Ruby!")

# Appending to file
File.open("output.txt", "a") do |file|
  file.puts "New line"
end

# Writing with block
File.open("output.txt", "w") do |file|
  file.puts "Line 1"
  file.puts "Line 2"
end
```

## Error Handling

### Exception Handling

```ruby
begin
  result = 10 / 0
rescue ZeroDivisionError => e
  puts "Error: #{e.message}"
rescue => e
  puts "General error: #{e.message}"
ensure
  puts "This always runs"
end
```

### Custom Exceptions

```ruby
class CustomError < StandardError
  def initialize(message)
    super(message)
  end
end

def validate_age(age)
  if age < 0
    raise CustomError, "Age cannot be negative"
  end
  if age > 150
    raise CustomError, "Age seems unrealistic"
  end
  true
end

begin
  validate_age(-5)
rescue CustomError => e
  puts "Validation error: #{e.message}"
end
```

## Modern Ruby Features

### Keyword Arguments

```ruby
def create_user(name:, email:, age: 18)
  {
    name: name,
    email: email,
    age: age
  }
end

user = create_user(name: "John", email: "john@example.com")
puts user
```

### Pattern Matching

```ruby
# Ruby 2.7+ pattern matching
case {name: "John", age: 25}
in {name: name, age: age} if age >= 18
  puts "#{name} is an adult"
in {name: name, age: age}
  puts "#{name} is a minor"
end
```

### Safe Navigation Operator

```ruby
user = nil
name = user&.name || "Guest"
puts name
```

## Best Practices

### Code Style

```ruby
# Use snake_case for methods and variables
def calculate_total_price
  base_price = 100
  tax_rate = 0.08
  base_price * (1 + tax_rate)
end

# Use CamelCase for classes
class UserAccount
  # Class implementation
end

# Use SCREAMING_SNAKE_CASE for constants
MAX_RETRY_ATTEMPTS = 3
```

### Performance

```ruby
# Use appropriate data structures
large_array = (1..10000).to_a
set = large_array.to_set # Faster lookup

# Use symbols for hash keys when possible
person = {name: "John", age: 25} # Better than strings

# Use blocks for iteration
numbers = [1, 2, 3, 4, 5]
sum = numbers.inject(0) { |acc, n| acc + n }
```

### Testing

```ruby
# Using Minitest
require 'minitest/autorun'

class TestCalculator < Minitest::Test
  def test_addition
    assert_equal 4, 2 + 2
  end
  
  def test_multiplication
    assert_equal 6, 2 * 3
  end
end
```

This tutorial covers essential Ruby concepts and practices. Continue exploring Ruby features and frameworks to become proficient in Ruby development. 
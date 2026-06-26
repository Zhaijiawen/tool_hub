# Ruby — Using the Formatter

Paste Ruby code into the editor, hit format, and the result appears in place.

## Hello World

```ruby
puts "Hello, World!"
```

## Variables

```ruby
name = "Ruby"
age = 25
fruits = ["apple", "banana", "orange"]
person = { name: "John", age: 25 }
status = :active

puts "Name: #{name}"
```

## Control Flow

```ruby
age = 18

if age >= 18
  puts "Adult"
else
  puts "Minor"
end

# unless is Ruby's "if not"
unless age < 18
  puts "Can vote"
end

# Case/when (cleaner than if/elsif chains)
case grade
when "A" then puts "Excellent"
when "B" then puts "Good"
else puts "Needs improvement"
end

# Iteration — multiple ways
5.times { |i| puts "Count: #{i}" }
fruits.each { |fruit| puts fruit }
```

## Methods

```ruby
def greet(name, title = "Mr.")
  "Hello, #{title} #{name}!"
end

puts greet("John")
puts greet("Jane", "Dr.")

# Methods with blocks
def repeat(times)
  times.times { |i| yield i if block_given? }
end

repeat(3) { |i| puts "Iteration #{i}" }
```

## Collections

```ruby
fruits = ["apple", "banana", "orange"]
fruits << "grape"
fruits.push("mango")

# Iteration and transformation
fruits.each { |f| puts f }
fruits.map { |f| f.upcase }
fruits.select { |f| f.length > 5 }

# Hashes (symbol keys)
person = { name: "John", age: 25 }
person[:email] = "john@example.com"
person.each { |key, value| puts "#{key}: #{value}" }
```

## Classes

```ruby
class Person
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name
    @age = age
  end

  def introduce
    "Hi, I'm #{@name}, #{@age} years old."
  end

  def adult?
    @age >= 18
  end
end

person = Person.new("John", 25)
puts person.introduce
```

## Inheritance and Modules

```ruby
class Student < Person
  attr_accessor :student_id

  def initialize(name, age, student_id)
    super(name, age)
    @student_id = student_id
  end

  def introduce
    super + " Student ID: #{@student_id}."
  end
end

module Logging
  def log(msg)
    puts "[#{Time.now}] #{msg}"
  end
end

class Service
  include Logging
end
```

## Practical Tips

- Use `&.` (safe navigation) to avoid nil errors: `user&.profile&.name`
- Prefer symbols over strings for hash keys: `{name: "John"}` over `{"name" => "John"}`
- Blocks are idiomatic — use them instead of for-loops
- `RuboCop` is the community standard linter — run it on every save

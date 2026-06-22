# Ruby — Code Examples

## A Real Class

```ruby
class Person
  attr_accessor :name, :age, :email

  def initialize(name, age, email = nil)
    @name = name
    @age = age
    @email = email
  end

  def introduce
    "Hi, I'm #{@name} and I'm #{@age} years old."
  end

  def adult?
    @age >= 18
  end
end

person = Person.new("John", 25, "john@example.com")
puts person.introduce
puts person.adult?
```

## Inheritance

```ruby
class Student < Person
  attr_accessor :student_id, :major

  def initialize(name, age, student_id, major, email = nil)
    super(name, age, email)
    @student_id = student_id
    @major = major
  end

  def introduce
    super + " I'm studying #{@major}."
  end
end

student = Student.new("Alice", 20, "S12345", "Computer Science")
puts student.introduce
```

## Modules and Mixins

```ruby
module MathHelper
  def square(x) = x * x
  def cube(x) = x * x * x
  def factorial(n) = n <= 1 ? 1 : n * factorial(n - 1)
end

module StringHelper
  def palindrome?(str) = str.downcase == str.downcase.reverse
  def word_count(str) = str.split.length
end

class Calculator
  include MathHelper
  include StringHelper
end

calc = Calculator.new
puts calc.square(5)       # 25
puts calc.cube(3)         # 27
puts calc.factorial(5)    # 120
puts calc.palindrome?("racecar")  # true
```

## Collections

```ruby
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = numbers.select(&:even?)
squares = numbers.map { |n| n * n }
sum = numbers.reduce(:+)

# Hashes
person = { name: "John", age: 25, city: "New York" }
person[:phone] = "555-1234"
person.transform_values { |v| v.to_s.upcase }
```

## File Operations

```ruby
# Reading
content = File.read("example.txt")
File.open("example.txt", "r") { |f| f.each_line { |line| puts line.chomp } }

# Writing
File.write("output.txt", "Hello, Ruby!")
File.open("output.txt", "a") { |f| f.puts "New line" }
```

## Error Handling

```ruby
begin
  result = 10 / 0
rescue ZeroDivisionError => e
  puts "Error: #{e.message}"
ensure
  puts "This always runs"
end

# Custom exceptions
class ValidationError < StandardError; end

def validate_age(age)
  raise ValidationError, "Age cannot be negative" if age < 0
  raise ValidationError, "Age seems unrealistic" if age > 150
  true
end
```

## Pattern Matching (Ruby 2.7+)

```ruby
def process_user(user)
  case user
  in { name:, age: } if age >= 18
    "#{name} is an adult"
  in { name:, age: }
    "#{name} is a minor"
  end
end

puts process_user({ name: "John", age: 25 })
```

## Testing with Minitest

```ruby
require 'minitest/autorun'

class TestCalculator < Minitest::Test
  def setup
    @calc = Calculator.new
  end

  def test_square
    assert_equal 25, @calc.square(5)
  end

  def test_palindrome
    assert @calc.palindrome?("racecar")
    refute @calc.palindrome?("hello")
  end
end
```

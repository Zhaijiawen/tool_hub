# Ruby 代码示例

本文档提供了涵盖核心概念的实用Ruby代码示例。

## 基本语法示例

### Hello World 程序

```ruby
puts "Hello, World!"
```

### 变量和数据类型

```ruby
# 字符串变量
name = "Ruby"
language = "Programming"

# 数值变量
age = 25
price = 19.99
count = 100

# 布尔变量
is_active = true
is_completed = false

# 符号变量
status = :pending
action = :create

# 带插值的输出
puts "Name: #{name}"
puts "Age: #{age}"
puts "Status: #{status}"
```

### 控制结构

```ruby
# If-else语句
age = 18
if age >= 18
  puts "You are an adult"
else
  puts "You are a minor"
end

# Unless语句
unless age < 18
  puts "You can vote"
end

# Case语句
grade = "A"
case grade
when "A"
  puts "Excellent"
when "B"
  puts "Good"
when "C"
  puts "Average"
else
  puts "Needs improvement"
end

# 循环
5.times { |i| puts "Count: #{i}" }

fruits = ["apple", "banana", "orange"]
fruits.each { |fruit| puts fruit }

for i in 1..5
  puts "Number: #{i}"
end
```

## 面向对象编程

### 类定义

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
  
  def contact_info
    if @email
      "Email: #{@email}"
    else
      "No email provided"
    end
  end
end

# 创建对象
person1 = Person.new("John", 25, "john@example.com")
person2 = Person.new("Jane", 16)

puts person1.introduce
puts person1.adult?
puts person1.contact_info
puts person2.adult?
```

### 继承

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
  
  def student_info
    "Student ID: #{@student_id}, Major: #{@major}"
  end
end

student = Student.new("Alice", 20, "S12345", "Computer Science", "alice@university.edu")
puts student.introduce
puts student.student_info
```

### 模块和混入

```ruby
module MathHelper
  def square(x)
    x * x
  end
  
  def cube(x)
    x * x * x
  end
  
  def factorial(n)
    return 1 if n <= 1
    n * factorial(n - 1)
  end
end

module StringHelper
  def palindrome?(str)
    str.downcase == str.downcase.reverse
  end
  
  def word_count(str)
    str.split.length
  end
end

class Calculator
  include MathHelper
  include StringHelper
end

calc = Calculator.new
puts calc.square(5)      # 25
puts calc.cube(3)        # 27
puts calc.factorial(5)   # 120
puts calc.palindrome?("racecar")  # true
puts calc.word_count("Hello world")  # 2
```

## 集合

### 数组

```ruby
# 创建数组
numbers = [1, 2, 3, 4, 5]
fruits = ["apple", "banana", "orange"]
mixed = [1, "hello", :symbol, true]

# 数组操作
fruits << "grape"
fruits.push("mango")
fruits.unshift("kiwi")

# 数组方法
puts fruits.length
puts fruits.include?("apple")
puts fruits.first
puts fruits.last

# 数组迭代
fruits.each { |fruit| puts fruit }
uppercase_fruits = fruits.map { |fruit| fruit.upcase }
long_fruits = fruits.select { |fruit| fruit.length > 5 }

# 数组过滤和转换
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = numbers.select { |n| n.even? }
squared_numbers = numbers.map { |n| n * n }
sum = numbers.inject(0) { |acc, n| acc + n }
```

### 哈希

```ruby
# 创建哈希
person = {
  name: "John",
  age: 25,
  city: "New York",
  email: "john@example.com"
}

# 哈希操作
person[:phone] = "555-1234"
person.delete(:email)

# 哈希迭代
person.each { |key, value| puts "#{key}: #{value}" }
person.each_key { |key| puts key }
person.each_value { |value| puts value }

# 哈希转换
uppercase_values = person.transform_values { |value| value.to_s.upcase }
filtered_person = person.select { |key, value| value.is_a?(String) }
```

## 文件操作

### 读取文件

```ruby
# 读取整个文件
content = File.read("example.txt")
puts content

# 逐行读取
File.open("example.txt", "r") do |file|
  file.each_line do |line|
    puts line.chomp
  end
end

# 带错误处理的读取
begin
  content = File.read("example.txt")
  puts content
rescue Errno::ENOENT
  puts "File not found"
rescue => e
  puts "Error reading file: #{e.message}"
end
```

### 写入文件

```ruby
# 写入文件
File.write("output.txt", "Hello, Ruby!")

# 追加到文件
File.open("output.txt", "a") do |file|
  file.puts "New line"
  file.puts "Another line"
end

# 使用块写入
File.open("data.txt", "w") do |file|
  file.puts "Name,Age,City"
  file.puts "John,25,New York"
  file.puts "Jane,30,Los Angeles"
end
```

## 错误处理

### Try-Catch

```ruby
begin
  result = 10 / 0
rescue ZeroDivisionError => e
  puts "Division by zero error: #{e.message}"
rescue => e
  puts "General error: #{e.message}"
ensure
  puts "This always executes"
end
```

### 自定义异常

```ruby
class ValidationError < StandardError
  def initialize(message)
    super(message)
  end
end

def validate_age(age)
  if age < 0
    raise ValidationError, "Age cannot be negative"
  end
  if age > 150
    raise ValidationError, "Age seems unrealistic"
  end
  true
end

begin
  validate_age(-5)
rescue ValidationError => e
  puts "Validation error: #{e.message}"
end
```

## 现代Ruby特性

### 关键字参数

```ruby
def create_user(name:, email:, age: 18, city: "Unknown")
  {
    name: name,
    email: email,
    age: age,
    city: city
  }
end

user1 = create_user(name: "John", email: "john@example.com")
user2 = create_user(name: "Jane", email: "jane@example.com", age: 25, city: "New York")

puts user1
puts user2
```

### 模式匹配

```ruby
# Ruby 2.7+ 模式匹配
def process_user(user)
  case user
  in {name: name, age: age} if age >= 18
    "#{name} is an adult"
  in {name: name, age: age}
    "#{name} is a minor"
  else
    "Invalid user data"
  end
end

user1 = {name: "John", age: 25}
user2 = {name: "Jane", age: 16}

puts process_user(user1)
puts process_user(user2)
```

### 安全导航操作符

```ruby
class User
  attr_accessor :name, :profile
  
  def initialize(name)
    @name = name
    @profile = nil
  end
end

user = User.new("John")
puts user&.profile&.email || "No email"
```

## 测试示例

### Minitest

```ruby
require 'minitest/autorun'

class TestCalculator < Minitest::Test
  def setup
    @calc = Calculator.new
  end
  
  def test_addition
    assert_equal 4, 2 + 2
  end
  
  def test_square
    assert_equal 25, @calc.square(5)
  end
  
  def test_factorial
    assert_equal 120, @calc.factorial(5)
  end
  
  def test_palindrome
    assert @calc.palindrome?("racecar")
    refute @calc.palindrome?("hello")
  end
end
```

这些示例演示了核心Ruby概念和有效Ruby开发的最佳实践。 
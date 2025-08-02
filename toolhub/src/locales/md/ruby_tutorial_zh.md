# Ruby 使用教程

本教程提供了开始Ruby开发的综合指南。

## 环境搭建

### 安装Ruby

1. **下载Ruby**：从官方网站（ruby-lang.org）
2. **安装Ruby**：根据您的操作系统：
   - **Windows**：使用RubyInstaller或WSL
   - **macOS**：使用Homebrew：`brew install ruby`
   - **Linux**：使用包管理器：`sudo apt install ruby`

3. **验证安装**：
   ```bash
   ruby -v
   ```

### 版本管理

**使用rbenv**：
```bash
# 安装rbenv
brew install rbenv

# 安装Ruby
rbenv install 3.2.0
rbenv global 3.2.0
```

**使用RVM**：
```bash
# 安装RVM
curl -sSL https://get.rvm.io | bash -s stable

# 安装Ruby
rvm install 3.2.0
rvm use 3.2.0 --default
```

### IDE设置
- **RubyMine**：专业Ruby IDE
- **VS Code**：带有Ruby扩展的轻量级编辑器
- **Sublime Text**：快速文本编辑器
- **Vim/Emacs**：基于终端的编辑器

## 基本Ruby语法

### Hello World

```ruby
puts "Hello, World!"
```

### 变量和数据类型

```ruby
# 变量
name = "Ruby"
age = 25
height = 5.9
is_dynamic = true

# 数组
fruits = ["apple", "banana", "orange"]
person = {
  "name" => "John",
  "age" => 25
}

# 符号
status = :active

# 输出
puts "Name: #{name}"
puts "Age: #{age}"
```

### 控制结构

```ruby
age = 18

# If-else语句
if age >= 18
  puts "Adult"
else
  puts "Minor"
end

# Unless语句
unless age < 18
  puts "Can vote"
end

# Case语句
case age
when 16
  puts "Can drive with supervision"
when 18
  puts "Can vote and drive"
else
  puts "Other age"
end

# 循环
5.times { |i| puts "Count: #{i}" }

fruits = ["apple", "banana", "orange"]
fruits.each { |fruit| puts fruit }

for i in 0..4
  puts "Loop: #{i}"
end
```

## 方法

### 基本方法

```ruby
# 方法定义
def greet(name)
  "Hello, #{name}!"
end

# 方法调用
puts greet("John")

# 带默认参数的方法
def greet_with_title(name, title = "Mr.")
  "Hello, #{title} #{name}!"
end

puts greet_with_title("John")
puts greet_with_title("Jane", "Dr.")
```

### 带块的方法

```ruby
def repeat(times)
  times.times do |i|
    yield i if block_given?
  end
end

repeat(3) { |i| puts "Iteration #{i}" }
```

## 集合

### 数组

```ruby
# 创建数组
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]

# 数组操作
fruits << "grape"
fruits.push("mango")
fruits.pop
fruits.shift

# 数组方法
puts fruits.length
puts fruits.include?("apple")
puts fruits.first
puts fruits.last

# 数组迭代
fruits.each { |fruit| puts fruit }
fruits.map { |fruit| fruit.upcase }
fruits.select { |fruit| fruit.length > 5 }
```

### 哈希

```ruby
# 创建哈希
person = {
  name: "John",
  age: 25,
  city: "New York"
}

# 哈希操作
person[:email] = "john@example.com"
person.delete(:age)

# 哈希迭代
person.each { |key, value| puts "#{key}: #{value}" }
person.each_key { |key| puts key }
person.each_value { |value| puts value }
```

## 面向对象编程

### 类和对象

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

# 创建对象
person = Person.new("John", 25)
puts person.introduce
puts person.adult?
```

### 继承

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

### 模块

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

## 文件处理

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

# 带编码读取
File.open("example.txt", "r:UTF-8") do |file|
  content = file.read
end
```

### 写入文件

```ruby
# 写入文件
File.write("output.txt", "Hello, Ruby!")

# 追加到文件
File.open("output.txt", "a") do |file|
  file.puts "New line"
end

# 使用块写入
File.open("output.txt", "w") do |file|
  file.puts "Line 1"
  file.puts "Line 2"
end
```

## 错误处理

### 异常处理

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

### 自定义异常

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

## 现代Ruby特性

### 关键字参数

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

### 模式匹配

```ruby
# Ruby 2.7+ 模式匹配
case {name: "John", age: 25}
in {name: name, age: age} if age >= 18
  puts "#{name} is an adult"
in {name: name, age: age}
  puts "#{name} is a minor"
end
```

### 安全导航操作符

```ruby
user = nil
name = user&.name || "Guest"
puts name
```

## 最佳实践

### 代码风格

```ruby
# 使用snake_case命名方法和变量
def calculate_total_price
  base_price = 100
  tax_rate = 0.08
  base_price * (1 + tax_rate)
end

# 使用CamelCase命名类
class UserAccount
  # 类实现
end

# 使用SCREAMING_SNAKE_CASE命名常量
MAX_RETRY_ATTEMPTS = 3
```

### 性能

```ruby
# 使用适当的数据结构
large_array = (1..10000).to_a
set = large_array.to_set # 更快的查找

# 尽可能使用符号作为哈希键
person = {name: "John", age: 25} # 比字符串更好

# 使用块进行迭代
numbers = [1, 2, 3, 4, 5]
sum = numbers.inject(0) { |acc, n| acc + n }
```

### 测试

```ruby
# 使用Minitest
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

本教程涵盖了基本的Ruby概念和实践。继续探索Ruby特性和框架，以精通Ruby开发。 
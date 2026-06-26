# Ruby — 使用格式化工具

粘贴 Ruby 代码到编辑区，点格式化，结果原位输出。

## Hello World

```ruby
puts "Hello, World!"
```

## 变量

```ruby
name = "Ruby"
age = 25
fruits = ["apple", "banana", "orange"]
person = { name: "John", age: 25 }
status = :active

puts "Name: #{name}"
```

## 控制流

```ruby
age = 18

if age >= 18
  puts "Adult"
else
  puts "Minor"
end

# unless 就是 "if not"
unless age < 18
  puts "Can vote"
end

# case/when（比 if/elsif 链干净）
case grade
when "A" then puts "Excellent"
when "B" then puts "Good"
else puts "Needs improvement"
end

# 迭代 — 多种方式
5.times { |i| puts "Count: #{i}" }
fruits.each { |fruit| puts fruit }
```

## 方法

```ruby
def greet(name, title = "Mr.")
  "Hello, #{title} #{name}!"
end

puts greet("John")
puts greet("Jane", "Dr.")

# 带 block 的方法
def repeat(times)
  times.times { |i| yield i if block_given? }
end

repeat(3) { |i| puts "Iteration #{i}" }
```

## 集合

```ruby
fruits = ["apple", "banana", "orange"]
fruits << "grape"
fruits.push("mango")

# 迭代和转换
fruits.each { |f| puts f }
fruits.map { |f| f.upcase }
fruits.select { |f| f.length > 5 }

# 哈希（符号键）
person = { name: "John", age: 25 }
person[:email] = "john@example.com"
person.each { |key, value| puts "#{key}: #{value}" }
```

## 类

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

## 继承和模块

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

## 实用建议

- 用 `&.`（安全导航）避免 nil 报错：`user&.profile&.name`
- 哈希键优先用符号：`{name: "John"}` 优于 `{"name" => "John"}`
- Block 是惯用写法——别用 for 循环
- `RuboCop` 是社区标准 linter——每次保存自动跑

# Ruby — 幕后原理

Ruby 由松本行弘（Matz）在 1993 年创建，1995 年公开发布。Matz 想要比 Perl 更强大、比 Python 更面向对象、兼具 Smalltalk 优雅的语言。核心原则："优化程序员的幸福感"。

## 一切皆对象

Ruby 里，真的是"一切"皆对象。整数、字符串、`nil`，甚至类本身都是对象。`5.times { puts "hi" }` 能运行是因为 `5` 是一个 Integer 对象，上面有 `times` 方法。没有基本类型，没有装箱拆箱——从头到尾都是对象。

## Ruby 哲学

Ruby 拥抱 TIMTOWTDI——条条大路通罗马，和 Python "唯一明显的方法"正相反。想遍历？`each`、`map`、`for`、`while`、`times`、`upto`、`loop` 都行。这种灵活性究竟是 Ruby 最大的优点还是最令人抓狂的特性，看谁在用了。

**约定优于配置**这个理念来自 Rails，但渗透了整个 Ruby 文化。合理的默认值意味着少写样板代码。

## 语法要点

```ruby
# 一切都有返回值 — 通常不需要单独的 return
def greet(name)
  "Hello, #{name}!"  # #{} 做字符串插值
end

# Block 无处不在
[1, 2, 3].map { |n| n * 2 }          # 花括号写单行
[1, 2, 3].each do |n|                 # do..end 写多行
  puts n
end

# attr_accessor 自动生成 getter 和 setter
class Person
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name        # @ 开头是实例变量
    @age = age
  end
end
```

## Rails 效应

Ruby 的流行随着 Rails（2004 年）爆发。Rails 是建立在 MVC 上的全栈 Web 框架，ActiveRecord 做 ORM。约定优于配置让你几分钟就能搭出一个能跑的应用。GitHub、Shopify、GitLab、Airbnb 都曾是 Rails 起家。

## Gems 和 Bundler

Ruby 的包管理是 RubyGems。`Gemfile` 声明依赖，`Bundler` 锁定版本并加载正确的 gem。核心 gem：RSpec（测试）、Devise（身份认证）、Sidekiq（后台任务）、RuboCop（代码检查）、Pry（调试）。

## Ruby 3.0+

Ruby 3.0（2020 年）目标是"3x3"——比 Ruby 2.0 快三倍。引入了 Ractors 支持并行执行（CPU 密集型任务突破 GIL 瓶颈），Fiber scheduler 做异步 I/O，还有 JIT 编译器。模式匹配在 Ruby 2.7 加入，让复杂条件判断干净很多。

## 需要注意

**性能。** Ruby 比 Go、Rust、Java 慢。CPU 密集型任务丢给后台任务或原生扩展。Web 应用大部分时间在等 I/O，Ruby 的速度很少是瓶颈。

**内存。** Ruby 进程内存占用可能很大。Unicorn/Puma worker 内存膨胀是老问题。生产环境用 jemalloc 并调 GC 参数。

**元编程的双刃剑。** Ruby 允许运行时重新定义方法、打开任意类、动态生成代码。强大是真强大，但很容易搞出无法调试的意大利面条。克制使用。

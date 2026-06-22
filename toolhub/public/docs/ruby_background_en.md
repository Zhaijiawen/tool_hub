# Ruby — What's Going On Under the Hood

Ruby was created by Yukihiro "Matz" Matsumoto in 1993 and publicly released in 1995. Matz wanted something more powerful than Perl and more object-oriented than Python, with the elegance of Smalltalk. The guiding principle: "optimize for programmer happiness."

## Everything Is an Object

In Ruby, literally everything is an object. Integers, strings, `nil`, even classes themselves. `5.times { puts "hi" }` works because `5` is an Integer object with a `times` method. No primitives, no boxing/unboxing — just objects all the way down.

## The Ruby Philosophy

Ruby embraces TIMTOWTDI (There Is More Than One Way To Do It), the opposite of Python's "one obvious way." Want to iterate? Use `each`, `map`, `for`, `while`, `times`, `upto`, or `loop` — all valid. This flexibility is either Ruby's greatest strength or most frustrating quality, depending on who you ask.

**Convention over Configuration** came from Rails but permeates Ruby culture. Sensible defaults mean less boilerplate.

## Syntax Highlights

```ruby
# Everything returns a value — no separate `return` needed usually
def greet(name)
  "Hello, #{name}!"  # String interpolation with #{} 
end

# Blocks are everywhere
[1, 2, 3].map { |n| n * 2 }          # Curly braces for one-liners
[1, 2, 3].each do |n|                 # do..end for multi-line
  puts n
end

# Classes with attr_accessor (generates getters and setters)
class Person
  attr_accessor :name, :age

  def initialize(name, age)
    @name = name        # @ = instance variable
    @age = age
  end
end
```

## The Rails Factor

Ruby's popularity exploded with Rails (2004). Rails is an opinionated web framework built on MVC, with ActiveRecord as the ORM. Convention over Configuration meant you could scaffold a working app in minutes. GitHub, Shopify, GitLab, and Airbnb were all built on Rails.

## Gems and Bundler

Ruby's package manager is RubyGems. `Gemfile` declares dependencies, `Bundler` locks versions and loads the right ones. Key gems: RSpec (testing), Devise (auth), Sidekiq (background jobs), RuboCop (linting), Pry (debugging).

## Ruby 3.0+

Ruby 3.0 (2020) aimed for "3x3" — 3x faster than Ruby 2.0. It introduced Ractors for parallel execution (no more GIL bottleneck for CPU-bound work), fiber scheduler for async I/O, and a JIT compiler. Pattern matching came in Ruby 2.7, making complex conditionals much cleaner.

## Things to Watch

**Performance.** Ruby is slower than Go, Rust, or Java. For CPU-heavy work, offload to background jobs or native extensions. For web apps, most time is spent waiting on I/O, so Ruby's speed is rarely the bottleneck.

**Memory.** Ruby processes can grow large. Unicorn/Puma worker memory bloat is a known issue. Use jemalloc and tune GC settings for production.

**Metaprogramming dangers.** Ruby lets you redefine methods at runtime, open any class, and dynamically generate code. Powerful but easy to create un-debuggable spaghetti. Use with restraint.

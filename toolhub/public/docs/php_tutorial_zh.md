# PHP — 使用格式化工具

粘贴 PHP 代码到编辑区，点格式化，结果原位输出。

## Hello World

```php
<?php
echo "Hello, World!";
```

或者用 PHP 内置服务器跑起来：

```bash
php -S localhost:8000
```

## 变量和数组

```php
<?php
// 变量以 $ 开头
$name = "John";
$age = 25;
$isStudent = true;

// 索引数组
$fruits = ["apple", "banana", "orange"];

// 关联数组
$person = [
    "name" => "John",
    "age" => 25,
    "city" => "New York"
];

echo "Name: " . $person["name"];
```

## 控制流

```php
<?php
if ($age >= 18) {
    echo "Adult";
} else {
    echo "Minor";
}

// Match 表达式（PHP 8+）— 比 switch 干净
$result = match ($status) {
    'active' => 'User is active',
    'inactive' => 'User is inactive',
    default => 'Unknown status',
};

for ($i = 0; $i < 5; $i++) {
    echo "Count: $i\n";
}

foreach ($fruits as $fruit) {
    echo "$fruit\n";
}
```

## 函数

```php
<?php
function greet(string $name, string $title = "Mr."): string {
    return "Hello, $title $name!";
}

echo greet("John");
echo greet("Jane", "Dr.");
```

## 类

```php
<?php
class Person {
    private string $name;
    private int $age;

    public function __construct(string $name, int $age) {
        $this->name = $name;
        $this->age = $age;
    }

    public function introduce(): string {
        return "Hi, I'm $this->name, $this->age years old.";
    }
}

$person = new Person("John", 25);
echo $person->introduce();
```

## 继承

```php
<?php
class Student extends Person {
    private string $studentId;

    public function __construct(string $name, int $age, string $studentId) {
        parent::__construct($name, $age);
        $this->studentId = $studentId;
    }

    public function introduce(): string {
        return parent::introduce() . " Student ID: $this->studentId";
    }
}
```

## 数据库（PDO）

永远用 PDO + 预处理语句：

```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=test", "user", "pass");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE age > ?");
    $stmt->execute([18]);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['name'] . "\n";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
```

## 现代 PHP 特性

```php
<?php
// 空合并运算符（PHP 7+）
$name = $_GET['name'] ?? 'Guest';

// 箭头函数（PHP 7.4+）
$doubled = array_map(fn($n) => $n * 2, [1, 2, 3]);

// 命名参数（PHP 8+）
function createUser(string $name, string $email, int $age = 18) { ... }
createUser(email: "john@example.com", name: "John");

// 构造函数属性提升（PHP 8+）
class Point {
    public function __construct(
        private int $x,
        private int $y
    ) {}
}
```

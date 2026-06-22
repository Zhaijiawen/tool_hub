# PHP — 代码示例

## 一个实际的类

```php
<?php
class Person {
    private string $name;
    private int $age;
    private ?string $email;

    public function __construct(string $name, int $age, ?string $email = null) {
        $this->name = $name;
        $this->age = $age;
        $this->email = $email;
    }

    public function getName(): string { return $this->name; }
    public function getAge(): int { return $this->age; }

    public function introduce(): string {
        return "Hi, I'm $this->name, $this->age years old.";
    }

    public function isAdult(): bool { return $this->age >= 18; }
}

$person = new Person("John", 25, "john@example.com");
echo $person->introduce();
```

## 继承

```php
<?php
class Student extends Person {
    private string $studentId;

    public function __construct(string $name, int $age, string $studentId, ?string $email = null) {
        parent::__construct($name, $age, $email);
        $this->studentId = $studentId;
    }

    public function getStudentId(): string { return $this->studentId; }

    public function introduce(): string {
        return parent::introduce() . " Student ID: $this->studentId";
    }
}

$student = new Student("Alice", 20, "S12345", "alice@university.edu");
echo $student->introduce();
```

## 接口和 Trait

```php
<?php
interface Logger {
    public function log(string $message): void;
}

trait Timestamp {
    public function getTimestamp(): string {
        return date('Y-m-d H:i:s');
    }
}

class FileLogger implements Logger {
    use Timestamp;

    public function __construct(private string $filename) {}

    public function log(string $message): void {
        $ts = $this->getTimestamp();
        file_put_contents($this->filename, "[$ts] $message\n", FILE_APPEND);
    }
}

$logger = new FileLogger("app.log");
$logger->log("Application started");
```

## 数组操作

```php
<?php
$numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 过滤
$even = array_filter($numbers, fn($n) => $n % 2 === 0);

// 映射
$squared = array_map(fn($n) => $n * $n, $numbers);

// 归约
$sum = array_sum($numbers);

// 关联数组
$config = [
    "database" => [
        "host" => "localhost",
        "name" => "myapp",
        "user" => "root"
    ]
];
echo $config["database"]["name"];
```

## PDO 数据库操作

```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=test", "user", "pass");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 查询
    $stmt = $pdo->prepare("SELECT * FROM users WHERE age > ?");
    $stmt->execute([18]);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['name'] . " - " . $row['age'] . "\n";
    }

    // 插入
    $stmt = $pdo->prepare("INSERT INTO users (name, email, age) VALUES (?, ?, ?)");
    $stmt->execute(["John", "john@example.com", 25]);

    // 更新
    $stmt = $pdo->prepare("UPDATE users SET age = ? WHERE id = ?");
    $stmt->execute([26, 1]);

} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
```

## 表单处理

```php
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $errors = [];

    if (empty($username)) {
        $errors[] = "Username is required";
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }

    if (empty($errors)) {
        echo "Welcome, " . htmlspecialchars($username) . "!";
    } else {
        foreach ($errors as $error) {
            echo "Error: $error\n";
        }
    }
}
?>

<form method="POST">
    <input type="text" name="username" placeholder="Username"
           value="<?= htmlspecialchars($_POST['username'] ?? '') ?>">
    <input type="email" name="email" placeholder="Email"
           value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
    <button type="submit">Submit</button>
</form>
```

## 现代 PHP（8.x）

```php
<?php
// 命名参数
createUser(email: "john@example.com", name: "John");

// 构造函数属性提升
class Point {
    public function __construct(
        private int $x = 0,
        private int $y = 0,
    ) {}
}

// Match 表达式
$message = match ($code) {
    200, 201 => 'Success',
    400 => 'Bad Request',
    404 => 'Not Found',
    500 => 'Server Error',
    default => 'Unknown',
};

// Nullsafe 操作符（PHP 8+）
$country = $user?->getAddress()?->getCountry();
```

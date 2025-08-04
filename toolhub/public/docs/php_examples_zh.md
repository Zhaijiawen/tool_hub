# PHP 代码示例

本文档提供了涵盖核心概念的实用PHP代码示例。

## 基本语法示例

### Hello World 程序

```php
<?php
echo "Hello, World!";
?>
```

### 变量和数据类型

```php
<?php
// 字符串变量
$name = "PHP";
$language = "Programming";

// 数值变量
$age = 25;
$price = 19.99;
$count = 100;

// 布尔变量
$isActive = true;
$isCompleted = false;

// 数组变量
$fruits = ["apple", "banana", "orange"];
$person = [
    "name" => "John",
    "age" => 25
];

// 输出和连接
echo "Name: " . $name;
echo "Age: " . $age;
echo "Is Active: " . ($isActive ? "Yes" : "No");
?>
```

### 控制结构

```php
<?php
$age = 18;

// If-else语句
if ($age >= 18) {
    echo "You are an adult";
} else {
    echo "You are a minor";
}

// Switch语句
$grade = "A";
switch ($grade) {
    case "A":
        echo "Excellent";
        break;
    case "B":
        echo "Good";
        break;
    case "C":
        echo "Average";
        break;
    default:
        echo "Needs improvement";
}

// 循环
for ($i = 0; $i < 5; $i++) {
    echo "Count: " . $i . "<br>";
}

$fruits = ["apple", "banana", "orange"];
foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}
?>
```

## 面向对象编程

### 类定义

```php
<?php
class Person {
    private $name;
    private $age;
    private $email;
    
    public function __construct($name, $age, $email = null) {
        $this->name = $name;
        $this->age = $age;
        $this->email = $email;
    }
    
    public function getName() {
        return $this->name;
    }
    
    public function getAge() {
        return $this->age;
    }
    
    public function getEmail() {
        return $this->email;
    }
    
    public function introduce() {
        return "Hi, I'm " . $this->name . " and I'm " . $this->age . " years old.";
    }
    
    public function isAdult() {
        return $this->age >= 18;
    }
}

// 创建对象
$person1 = new Person("John", 25, "john@example.com");
$person2 = new Person("Jane", 16);

echo $person1->introduce() . "<br>";
echo $person1->isAdult() ? "Adult" : "Minor" . "<br>";
echo $person2->isAdult() ? "Adult" : "Minor" . "<br>";
?>
```

### 继承

```php
<?php
class Student extends Person {
    private $studentId;
    private $major;
    
    public function __construct($name, $age, $studentId, $major, $email = null) {
        parent::__construct($name, $age, $email);
        $this->studentId = $studentId;
        $this->major = $major;
    }
    
    public function getStudentId() {
        return $this->studentId;
    }
    
    public function getMajor() {
        return $this->major;
    }
    
    public function introduce() {
        return parent::introduce() . " I'm studying " . $this->major . ".";
    }
}

$student = new Student("Alice", 20, "S12345", "Computer Science", "alice@university.edu");
echo $student->introduce() . "<br>";
echo "Student ID: " . $student->getStudentId() . "<br>";
?>
```

### 接口和特征

```php
<?php
interface Logger {
    public function log($message);
}

trait Timestamp {
    public function getTimestamp() {
        return date('Y-m-d H:i:s');
    }
}

class FileLogger implements Logger {
    use Timestamp;
    
    private $filename;
    
    public function __construct($filename) {
        $this->filename = $filename;
    }
    
    public function log($message) {
        $timestamp = $this->getTimestamp();
        $logEntry = "[$timestamp] $message\n";
        file_put_contents($this->filename, $logEntry, FILE_APPEND);
    }
}

$logger = new FileLogger("app.log");
$logger->log("Application started");
?>
```

## 数组和集合

### 数组操作

```php
<?php
// 创建数组
$fruits = ["apple", "banana", "orange"];
$numbers = [1, 2, 3, 4, 5];
$person = [
    "name" => "John",
    "age" => 25,
    "city" => "New York"
];

// 数组操作
$fruits[] = "grape";
array_push($fruits, "mango");
array_unshift($fruits, "kiwi");

// 数组函数
echo "Count: " . count($fruits) . "<br>";
echo "Contains apple: " . (in_array("apple", $fruits) ? "Yes" : "No") . "<br>";
echo "First: " . reset($fruits) . "<br>";
echo "Last: " . end($fruits) . "<br>";

// 数组迭代
foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}

foreach ($person as $key => $value) {
    echo "$key: $value<br>";
}

// 数组过滤和转换
$numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
$evenNumbers = array_filter($numbers, function($n) {
    return $n % 2 == 0;
});

$squaredNumbers = array_map(function($n) {
    return $n * $n;
}, $numbers);

$sum = array_sum($numbers);
?>
```

### 关联数组

```php
<?php
// 创建关联数组
$config = [
    "database" => [
        "host" => "localhost",
        "name" => "myapp",
        "user" => "root",
        "pass" => ""
    ],
    "app" => [
        "name" => "My Application",
        "version" => "1.0.0"
    ]
];

// 访问嵌套数组
echo "Database: " . $config["database"]["name"] . "<br>";
echo "App: " . $config["app"]["name"] . "<br>";

// 数组操作
$config["database"]["port"] = 3306;
unset($config["database"]["pass"]);

// 检查数组键
if (array_key_exists("database", $config)) {
    echo "Database config exists<br>";
}

// 合并数组
$defaults = ["timeout" => 30, "retries" => 3];
$settings = array_merge($defaults, ["timeout" => 60]);
?>
```

## 文件操作

### 读取文件

```php
<?php
// 读取整个文件
$content = file_get_contents("example.txt");
echo $content;

// 逐行读取
$file = fopen("example.txt", "r");
while (!feof($file)) {
    $line = fgets($file);
    echo $line;
}
fclose($file);

// 带错误处理的读取
try {
    $content = file_get_contents("example.txt");
    if ($content === false) {
        throw new Exception("Failed to read file");
    }
    echo $content;
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

### 写入文件

```php
<?php
// 写入文件
$content = "Hello, PHP!";
file_put_contents("output.txt", $content);

// 追加到文件
file_put_contents("output.txt", "\nNew line", FILE_APPEND);

// 使用文件句柄写入
$file = fopen("data.txt", "w");
fwrite($file, "Name,Age,City\n");
fwrite($file, "John,25,New York\n");
fwrite($file, "Jane,30,Los Angeles\n");
fclose($file);

// 写入CSV数据
$data = [
    ["Name", "Age", "City"],
    ["John", 25, "New York"],
    ["Jane", 30, "Los Angeles"]
];

$file = fopen("users.csv", "w");
foreach ($data as $row) {
    fputcsv($file, $row);
}
fclose($file);
?>
```

## 数据库操作

### PDO数据库连接

```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=test", "username", "password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 预处理语句
    $stmt = $pdo->prepare("SELECT * FROM users WHERE age > ?");
    $stmt->execute([18]);
    
    // 获取结果
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['name'] . " - " . $row['age'] . "<br>";
    }
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
```

### 插入和更新操作

```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=test", "username", "password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 插入用户
    $stmt = $pdo->prepare("INSERT INTO users (name, email, age) VALUES (?, ?, ?)");
    $stmt->execute(["John Doe", "john@example.com", 25]);
    
    // 更新用户
    $stmt = $pdo->prepare("UPDATE users SET age = ? WHERE id = ?");
    $stmt->execute([26, 1]);
    
    // 删除用户
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([1]);
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
```

## 错误处理

### 带自定义异常的Try-Catch

```php
<?php
class ValidationException extends Exception {
    public function __construct($message, $code = 0) {
        parent::__construct($message, $code);
    }
}

function validateEmail($email) {
    if (empty($email)) {
        throw new ValidationException("Email cannot be empty");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new ValidationException("Invalid email format");
    }
    return true;
}

function validateAge($age) {
    if (!is_numeric($age)) {
        throw new ValidationException("Age must be a number");
    }
    if ($age < 0 || $age > 150) {
        throw new ValidationException("Age must be between 0 and 150");
    }
    return true;
}

try {
    validateEmail("invalid-email");
} catch (ValidationException $e) {
    echo "Validation error: " . $e->getMessage() . "<br>";
}

try {
    validateAge(-5);
} catch (ValidationException $e) {
    echo "Validation error: " . $e->getMessage() . "<br>";
}
?>
```

## 现代PHP特性

### 类型声明和返回类型

```php
<?php
// PHP 7+ 类型声明
function calculateArea(float $width, float $height): float {
    return $width * $height;
}

function getFullName(string $firstName, string $lastName): string {
    return $firstName . " " . $lastName;
}

function processUser(array $userData): array {
    $userData['processed'] = true;
    $userData['timestamp'] = time();
    return $userData;
}

// 使用函数
$area = calculateArea(10.5, 5.2);
$fullName = getFullName("John", "Doe");
$user = processUser(["name" => "John", "email" => "john@example.com"]);

echo "Area: $area<br>";
echo "Full Name: $fullName<br>";
echo "Processed User: " . json_encode($user) . "<br>";
?>
```

### 空合并和太空船操作符

```php
<?php
// 空合并操作符 (PHP 7+)
$name = $_GET['name'] ?? 'Guest';
$email = $_POST['email'] ?? null;
$age = $user['age'] ?? 18;

// 太空船操作符 (PHP 7+)
$numbers = [3, 1, 4, 1, 5, 9, 2, 6];
usort($numbers, function($a, $b) {
    return $a <=> $b;
});

// 数组解构 (PHP 7.1+)
$person = ["John", "Doe", 25];
[$firstName, $lastName, $age] = $person;

echo "Name: $firstName $lastName, Age: $age<br>";
?>
```

## Web开发示例

### 表单处理

```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $age = (int)($_POST["age"] ?? 0);
    
    $errors = [];
    
    // 验证
    if (empty($username)) {
        $errors[] = "Username is required";
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Valid email is required";
    }
    
    if ($age < 0 || $age > 150) {
        $errors[] = "Age must be between 0 and 150";
    }
    
    if (empty($errors)) {
        // 处理有效数据
        echo "Form submitted successfully!<br>";
        echo "Username: " . htmlspecialchars($username) . "<br>";
        echo "Email: " . htmlspecialchars($email) . "<br>";
        echo "Age: $age<br>";
    } else {
        foreach ($errors as $error) {
            echo "Error: $error<br>";
        }
    }
}
?>

<form method="POST">
    <input type="text" name="username" placeholder="Username" value="<?= htmlspecialchars($_POST['username'] ?? '') ?>"><br>
    <input type="email" name="email" placeholder="Email" value="<?= htmlspecialchars($_POST['email'] ?? '') ?>"><br>
    <input type="number" name="age" placeholder="Age" value="<?= htmlspecialchars($_POST['age'] ?? '') ?>"><br>
    <button type="submit">Submit</button>
</form>
```

这些示例演示了核心PHP概念和有效PHP开发的最佳实践。 
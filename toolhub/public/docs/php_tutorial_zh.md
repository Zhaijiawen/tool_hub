# PHP 使用教程

本教程提供了开始PHP开发的综合指南。

## 环境搭建

### 安装PHP

1. **下载PHP**：从官方网站（php.net）
2. **安装PHP**：根据您的操作系统：
   - **Windows**：使用XAMPP、WAMP或从php.net下载
   - **macOS**：使用Homebrew：`brew install php`
   - **Linux**：使用包管理器：`sudo apt install php`

3. **验证安装**：
   ```bash
   php -v
   ```

### Web服务器设置

**选项1：内置服务器**
```bash
php -S localhost:8000
```

**选项2：Apache/Nginx**
- 安装Apache或Nginx
- 配置PHP模块
- 设置文档根目录

### IDE设置
- **PhpStorm**：专业PHP IDE
- **VS Code**：带有PHP扩展的轻量级编辑器
- **Sublime Text**：快速文本编辑器
- **NetBeans**：支持PHP的免费IDE

## 基本PHP语法

### Hello World

```php
<?php
echo "Hello, World!";
?>
```

### 变量和数据类型

```php
<?php
// 变量以$开头
$name = "John";
$age = 25;
$height = 5.9;
$isStudent = true;

// 数组
$fruits = ["apple", "banana", "orange"];
$person = [
    "name" => "John",
    "age" => 25
];

// 输出
echo "Name: " . $name;
echo "Age: " . $age;
?>
```

### 控制结构

```php
<?php
$age = 18;

// If-else语句
if ($age >= 18) {
    echo "Adult";
} else {
    echo "Minor";
}

// Switch语句
switch ($age) {
    case 16:
        echo "Can drive with supervision";
        break;
    case 18:
        echo "Can vote and drive";
        break;
    default:
        echo "Other age";
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

## 函数

### 基本函数

```php
<?php
// 函数定义
function greet($name) {
    return "Hello, " . $name;
}

// 函数调用
echo greet("John");

// 带默认参数的函数
function greetWithTitle($name, $title = "Mr.") {
    return "Hello, " . $title . " " . $name;
}

echo greetWithTitle("John");
echo greetWithTitle("Jane", "Dr.");
?>
```

### 带类型声明的函数

```php
<?php
// 类型声明（PHP 7+）
function calculateArea(float $width, float $height): float {
    return $width * $height;
}

$area = calculateArea(10.5, 5.2);
echo "Area: " . $area;
?>
```

## 数组

### 数组类型

```php
<?php
// 索引数组
$fruits = ["apple", "banana", "orange"];

// 关联数组
$person = [
    "name" => "John",
    "age" => 25,
    "city" => "New York"
];

// 多维数组
$students = [
    ["name" => "John", "grade" => "A"],
    ["name" => "Jane", "grade" => "B"]
];

// 数组函数
echo count($fruits); // 3
echo in_array("apple", $fruits); // true
?>
```

### 数组操作

```php
<?php
$fruits = ["apple", "banana", "orange"];

// 添加元素
$fruits[] = "grape";
array_push($fruits, "mango");

// 删除元素
unset($fruits[1]);

// 排序
sort($fruits);
rsort($fruits);

// 过滤
$filtered = array_filter($fruits, function($fruit) {
    return strlen($fruit) > 5;
});
?>
```

## 面向对象编程

### 类和对象

```php
<?php
class Person {
    // 属性
    private $name;
    private $age;
    
    // 构造函数
    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
    
    // 方法
    public function getName() {
        return $this->name;
    }
    
    public function getAge() {
        return $this->age;
    }
    
    public function introduce() {
        return "Hi, I'm " . $this->name . " and I'm " . $this->age . " years old.";
    }
}

// 创建对象
$person = new Person("John", 25);
echo $person->introduce();
?>
```

### 继承

```php
<?php
class Student extends Person {
    private $studentId;
    
    public function __construct($name, $age, $studentId) {
        parent::__construct($name, $age);
        $this->studentId = $studentId;
    }
    
    public function getStudentId() {
        return $this->studentId;
    }
    
    public function introduce() {
        return parent::introduce() . " My student ID is " . $this->studentId;
    }
}

$student = new Student("Jane", 20, "S12345");
echo $student->introduce();
?>
```

## 文件处理

### 读取文件

```php
<?php
// 读取文件
$content = file_get_contents("example.txt");
echo $content;

// 逐行读取
$file = fopen("example.txt", "r");
while (!feof($file)) {
    $line = fgets($file);
    echo $line;
}
fclose($file);
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

// 使用文件句柄
$file = fopen("output.txt", "w");
fwrite($file, "Hello, World!");
fclose($file);
?>
```

## 数据库操作

### 使用PDO的MySQL

```php
<?php
try {
    // 数据库连接
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
    echo "Error: " . $e->getMessage();
}
?>
```

### 使用mysqli的MySQL

```php
<?php
// 数据库连接
$mysqli = new mysqli("localhost", "username", "password", "database");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// 查询
$result = $mysqli->query("SELECT * FROM users");

// 获取结果
while ($row = $result->fetch_assoc()) {
    echo $row['name'] . " - " . $row['email'] . "<br>";
}

$mysqli->close();
?>
```

## Web开发

### 表单处理

```php
<?php
// HTML表单
?>
<form method="POST" action="">
    <input type="text" name="username" placeholder="Username">
    <input type="email" name="email" placeholder="Email">
    <button type="submit">Submit</button>
</form>

<?php
// 处理表单数据
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $email = $_POST["email"];
    
    // 验证输入
    if (empty($username) || empty($email)) {
        echo "All fields are required";
    } else {
        echo "Username: " . htmlspecialchars($username) . "<br>";
        echo "Email: " . htmlspecialchars($email) . "<br>";
    }
}
?>
```

### 会话管理

```php
<?php
// 启动会话
session_start();

// 设置会话变量
$_SESSION["user_id"] = 123;
$_SESSION["username"] = "john_doe";

// 访问会话变量
echo "User ID: " . $_SESSION["user_id"];

// 销毁会话
session_destroy();
?>
```

### Cookie处理

```php
<?php
// 设置cookie
setcookie("user_preference", "dark_theme", time() + 3600);

// 读取cookie
if (isset($_COOKIE["user_preference"])) {
    echo "Theme: " . $_COOKIE["user_preference"];
}

// 删除cookie
setcookie("user_preference", "", time() - 3600);
?>
```

## 错误处理

### Try-Catch

```php
<?php
try {
    // 可能抛出异常的代码
    $result = 10 / 0;
} catch (DivisionByZeroError $e) {
    echo "Error: " . $e->getMessage();
} catch (Exception $e) {
    echo "General error: " . $e->getMessage();
}
?>
```

### 自定义异常

```php
<?php
class CustomException extends Exception {
    public function __construct($message, $code = 0) {
        parent::__construct($message, $code);
    }
}

function validateAge($age) {
    if ($age < 0) {
        throw new CustomException("Age cannot be negative");
    }
    if ($age > 150) {
        throw new CustomException("Age seems unrealistic");
    }
    return true;
}

try {
    validateAge(-5);
} catch (CustomException $e) {
    echo "Validation error: " . $e->getMessage();
}
?>
```

## 现代PHP特性

### 空合并运算符

```php
<?php
// PHP 7+ 空合并运算符
$name = $_GET['name'] ?? 'Guest';
echo "Hello, " . $name;

// 传统方式
$name = isset($_GET['name']) ? $_GET['name'] : 'Guest';
?>
```

### 箭头函数

```php
<?php
// PHP 7.4+ 箭头函数
$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(fn($n) => $n * 2, $numbers);

// 传统方式
$doubled = array_map(function($n) {
    return $n * 2;
}, $numbers);
?>
```

## 最佳实践

### 安全

```php
<?php
// 始终验证和清理输入
$userInput = $_POST['user_input'];
$sanitized = htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// 对数据库查询使用预处理语句
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$userId]);

// 对敏感数据使用HTTPS
if (!isset($_SERVER['HTTPS'])) {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
?>
```

### 性能

```php
<?php
// 使用适当的数据结构
$largeArray = range(1, 10000);
$set = array_flip($largeArray); // 更快的查找

// 最小化数据库查询
$stmt = $pdo->prepare("SELECT * FROM users WHERE id IN (" . str_repeat('?,', count($ids) - 1) . "?)");
$stmt->execute($ids);

// 使用缓存
$cache = new APCu();
$data = $cache->get('key') ?: $cache->set('key', expensiveOperation());
?>
```

本教程涵盖了基本的PHP概念和实践。继续探索PHP特性和框架，以精通PHP开发。 
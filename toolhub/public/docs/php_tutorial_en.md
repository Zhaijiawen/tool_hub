# PHP Usage Tutorial

This tutorial provides a comprehensive guide to getting started with PHP development.

## Environment Setup

### Installing PHP

1. **Download PHP** from the official website (php.net)
2. **Install PHP** for your operating system:
   - **Windows**: Use XAMPP, WAMP, or download from php.net
   - **macOS**: Use Homebrew: `brew install php`
   - **Linux**: Use package manager: `sudo apt install php`

3. **Verify Installation**:
   ```bash
   php -v
   ```

### Web Server Setup

**Option 1: Built-in Server**
```bash
php -S localhost:8000
```

**Option 2: Apache/Nginx**
- Install Apache or Nginx
- Configure PHP module
- Set document root

### IDE Setup
- **PhpStorm**: Professional PHP IDE
- **VS Code**: Lightweight with PHP extensions
- **Sublime Text**: Fast text editor
- **NetBeans**: Free IDE with PHP support

## Basic PHP Syntax

### Hello World

```php
<?php
echo "Hello, World!";
?>
```

### Variables and Data Types

```php
<?php
// Variables start with $
$name = "John";
$age = 25;
$height = 5.9;
$isStudent = true;

// Arrays
$fruits = ["apple", "banana", "orange"];
$person = [
    "name" => "John",
    "age" => 25
];

// Output
echo "Name: " . $name;
echo "Age: " . $age;
?>
```

### Control Structures

```php
<?php
$age = 18;

// If-else statement
if ($age >= 18) {
    echo "Adult";
} else {
    echo "Minor";
}

// Switch statement
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

// Loops
for ($i = 0; $i < 5; $i++) {
    echo "Count: " . $i . "<br>";
}

$fruits = ["apple", "banana", "orange"];
foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}
?>
```

## Functions

### Basic Functions

```php
<?php
// Function definition
function greet($name) {
    return "Hello, " . $name;
}

// Function call
echo greet("John");

// Function with default parameter
function greetWithTitle($name, $title = "Mr.") {
    return "Hello, " . $title . " " . $name;
}

echo greetWithTitle("John");
echo greetWithTitle("Jane", "Dr.");
?>
```

### Function with Type Declarations

```php
<?php
// Type declarations (PHP 7+)
function calculateArea(float $width, float $height): float {
    return $width * $height;
}

$area = calculateArea(10.5, 5.2);
echo "Area: " . $area;
?>
```

## Arrays

### Array Types

```php
<?php
// Indexed array
$fruits = ["apple", "banana", "orange"];

// Associative array
$person = [
    "name" => "John",
    "age" => 25,
    "city" => "New York"
];

// Multidimensional array
$students = [
    ["name" => "John", "grade" => "A"],
    ["name" => "Jane", "grade" => "B"]
];

// Array functions
echo count($fruits); // 3
echo in_array("apple", $fruits); // true
?>
```

### Array Operations

```php
<?php
$fruits = ["apple", "banana", "orange"];

// Adding elements
$fruits[] = "grape";
array_push($fruits, "mango");

// Removing elements
unset($fruits[1]);

// Sorting
sort($fruits);
rsort($fruits);

// Filtering
$filtered = array_filter($fruits, function($fruit) {
    return strlen($fruit) > 5;
});
?>
```

## Object-Oriented Programming

### Classes and Objects

```php
<?php
class Person {
    // Properties
    private $name;
    private $age;
    
    // Constructor
    public function __construct($name, $age) {
        $this->name = $name;
        $this->age = $age;
    }
    
    // Methods
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

// Creating objects
$person = new Person("John", 25);
echo $person->introduce();
?>
```

### Inheritance

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

## File Handling

### Reading Files

```php
<?php
// Reading a file
$content = file_get_contents("example.txt");
echo $content;

// Reading line by line
$file = fopen("example.txt", "r");
while (!feof($file)) {
    $line = fgets($file);
    echo $line;
}
fclose($file);
?>
```

### Writing Files

```php
<?php
// Writing to a file
$content = "Hello, PHP!";
file_put_contents("output.txt", $content);

// Appending to a file
file_put_contents("output.txt", "\nNew line", FILE_APPEND);

// Using file handle
$file = fopen("output.txt", "w");
fwrite($file, "Hello, World!");
fclose($file);
?>
```

## Database Operations

### MySQL with PDO

```php
<?php
try {
    // Database connection
    $pdo = new PDO("mysql:host=localhost;dbname=test", "username", "password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Prepared statement
    $stmt = $pdo->prepare("SELECT * FROM users WHERE age > ?");
    $stmt->execute([18]);
    
    // Fetch results
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['name'] . " - " . $row['age'] . "<br>";
    }
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

### MySQL with mysqli

```php
<?php
// Database connection
$mysqli = new mysqli("localhost", "username", "password", "database");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Query
$result = $mysqli->query("SELECT * FROM users");

// Fetch results
while ($row = $result->fetch_assoc()) {
    echo $row['name'] . " - " . $row['email'] . "<br>";
}

$mysqli->close();
?>
```

## Web Development

### Form Processing

```php
<?php
// HTML form
?>
<form method="POST" action="">
    <input type="text" name="username" placeholder="Username">
    <input type="email" name="email" placeholder="Email">
    <button type="submit">Submit</button>
</form>

<?php
// Processing form data
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $email = $_POST["email"];
    
    // Validate input
    if (empty($username) || empty($email)) {
        echo "All fields are required";
    } else {
        echo "Username: " . htmlspecialchars($username) . "<br>";
        echo "Email: " . htmlspecialchars($email) . "<br>";
    }
}
?>
```

### Session Management

```php
<?php
// Start session
session_start();

// Set session variables
$_SESSION["user_id"] = 123;
$_SESSION["username"] = "john_doe";

// Access session variables
echo "User ID: " . $_SESSION["user_id"];

// Destroy session
session_destroy();
?>
```

### Cookie Handling

```php
<?php
// Set cookie
setcookie("user_preference", "dark_theme", time() + 3600);

// Read cookie
if (isset($_COOKIE["user_preference"])) {
    echo "Theme: " . $_COOKIE["user_preference"];
}

// Delete cookie
setcookie("user_preference", "", time() - 3600);
?>
```

## Error Handling

### Try-Catch

```php
<?php
try {
    // Code that might throw an exception
    $result = 10 / 0;
} catch (DivisionByZeroError $e) {
    echo "Error: " . $e->getMessage();
} catch (Exception $e) {
    echo "General error: " . $e->getMessage();
}
?>
```

### Custom Exceptions

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

## Modern PHP Features

### Null Coalescing Operator

```php
<?php
// PHP 7+ null coalescing operator
$name = $_GET['name'] ?? 'Guest';
echo "Hello, " . $name;

// Traditional way
$name = isset($_GET['name']) ? $_GET['name'] : 'Guest';
?>
```

### Arrow Functions

```php
<?php
// PHP 7.4+ arrow functions
$numbers = [1, 2, 3, 4, 5];
$doubled = array_map(fn($n) => $n * 2, $numbers);

// Traditional way
$doubled = array_map(function($n) {
    return $n * 2;
}, $numbers);
?>
```

## Best Practices

### Security

```php
<?php
// Always validate and sanitize input
$userInput = $_POST['user_input'];
$sanitized = htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');

// Use prepared statements for database queries
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$userId]);

// Use HTTPS for sensitive data
if (!isset($_SERVER['HTTPS'])) {
    header("Location: https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
    exit();
}
?>
```

### Performance

```php
<?php
// Use appropriate data structures
$largeArray = range(1, 10000);
$set = array_flip($largeArray); // Faster lookup

// Minimize database queries
$stmt = $pdo->prepare("SELECT * FROM users WHERE id IN (" . str_repeat('?,', count($ids) - 1) . "?)");
$stmt->execute($ids);

// Use caching
$cache = new APCu();
$data = $cache->get('key') ?: $cache->set('key', expensiveOperation());
?>
```

This tutorial covers essential PHP concepts and practices. Continue exploring PHP features and frameworks to become proficient in PHP development. 
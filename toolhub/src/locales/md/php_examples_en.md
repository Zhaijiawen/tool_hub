# PHP Code Examples

This document provides practical PHP code examples covering core concepts.

## Basic Syntax Examples

### Hello World Program

```php
<?php
echo "Hello, World!";
?>
```

### Variables and Data Types

```php
<?php
// String variables
$name = "PHP";
$language = "Programming";

// Numeric variables
$age = 25;
$price = 19.99;
$count = 100;

// Boolean variables
$isActive = true;
$isCompleted = false;

// Array variables
$fruits = ["apple", "banana", "orange"];
$person = [
    "name" => "John",
    "age" => 25
];

// Output with concatenation
echo "Name: " . $name;
echo "Age: " . $age;
echo "Is Active: " . ($isActive ? "Yes" : "No");
?>
```

### Control Structures

```php
<?php
$age = 18;

// If-else statement
if ($age >= 18) {
    echo "You are an adult";
} else {
    echo "You are a minor";
}

// Switch statement
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

## Object-Oriented Programming

### Class Definition

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

// Creating objects
$person1 = new Person("John", 25, "john@example.com");
$person2 = new Person("Jane", 16);

echo $person1->introduce() . "<br>";
echo $person1->isAdult() ? "Adult" : "Minor" . "<br>";
echo $person2->isAdult() ? "Adult" : "Minor" . "<br>";
?>
```

### Inheritance

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

### Interfaces and Traits

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

## Arrays and Collections

### Array Operations

```php
<?php
// Creating arrays
$fruits = ["apple", "banana", "orange"];
$numbers = [1, 2, 3, 4, 5];
$person = [
    "name" => "John",
    "age" => 25,
    "city" => "New York"
];

// Array operations
$fruits[] = "grape";
array_push($fruits, "mango");
array_unshift($fruits, "kiwi");

// Array functions
echo "Count: " . count($fruits) . "<br>";
echo "Contains apple: " . (in_array("apple", $fruits) ? "Yes" : "No") . "<br>";
echo "First: " . reset($fruits) . "<br>";
echo "Last: " . end($fruits) . "<br>";

// Array iteration
foreach ($fruits as $fruit) {
    echo $fruit . "<br>";
}

foreach ($person as $key => $value) {
    echo "$key: $value<br>";
}

// Array filtering and transformation
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

### Associative Arrays

```php
<?php
// Creating associative arrays
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

// Accessing nested arrays
echo "Database: " . $config["database"]["name"] . "<br>";
echo "App: " . $config["app"]["name"] . "<br>";

// Array manipulation
$config["database"]["port"] = 3306;
unset($config["database"]["pass"]);

// Checking array keys
if (array_key_exists("database", $config)) {
    echo "Database config exists<br>";
}

// Merging arrays
$defaults = ["timeout" => 30, "retries" => 3];
$settings = array_merge($defaults, ["timeout" => 60]);
?>
```

## File Operations

### Reading Files

```php
<?php
// Reading entire file
$content = file_get_contents("example.txt");
echo $content;

// Reading line by line
$file = fopen("example.txt", "r");
while (!feof($file)) {
    $line = fgets($file);
    echo $line;
}
fclose($file);

// Reading with error handling
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

### Writing Files

```php
<?php
// Writing to file
$content = "Hello, PHP!";
file_put_contents("output.txt", $content);

// Appending to file
file_put_contents("output.txt", "\nNew line", FILE_APPEND);

// Writing with file handle
$file = fopen("data.txt", "w");
fwrite($file, "Name,Age,City\n");
fwrite($file, "John,25,New York\n");
fwrite($file, "Jane,30,Los Angeles\n");
fclose($file);

// Writing CSV data
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

## Database Operations

### PDO Database Connection

```php
<?php
try {
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
    echo "Database error: " . $e->getMessage();
}
?>
```

### Insert and Update Operations

```php
<?php
try {
    $pdo = new PDO("mysql:host=localhost;dbname=test", "username", "password");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Insert user
    $stmt = $pdo->prepare("INSERT INTO users (name, email, age) VALUES (?, ?, ?)");
    $stmt->execute(["John Doe", "john@example.com", 25]);
    
    // Update user
    $stmt = $pdo->prepare("UPDATE users SET age = ? WHERE id = ?");
    $stmt->execute([26, 1]);
    
    // Delete user
    $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([1]);
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage();
}
?>
```

## Error Handling

### Try-Catch with Custom Exceptions

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

## Modern PHP Features

### Type Declarations and Return Types

```php
<?php
// PHP 7+ type declarations
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

// Using the functions
$area = calculateArea(10.5, 5.2);
$fullName = getFullName("John", "Doe");
$user = processUser(["name" => "John", "email" => "john@example.com"]);

echo "Area: $area<br>";
echo "Full Name: $fullName<br>";
echo "Processed User: " . json_encode($user) . "<br>";
?>
```

### Null Coalescing and Spaceship Operators

```php
<?php
// Null coalescing operator (PHP 7+)
$name = $_GET['name'] ?? 'Guest';
$email = $_POST['email'] ?? null;
$age = $user['age'] ?? 18;

// Spaceship operator (PHP 7+)
$numbers = [3, 1, 4, 1, 5, 9, 2, 6];
usort($numbers, function($a, $b) {
    return $a <=> $b;
});

// Array destructuring (PHP 7.1+)
$person = ["John", "Doe", 25];
[$firstName, $lastName, $age] = $person;

echo "Name: $firstName $lastName, Age: $age<br>";
?>
```

## Web Development Examples

### Form Processing

```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = trim($_POST["username"] ?? "");
    $email = trim($_POST["email"] ?? "");
    $age = (int)($_POST["age"] ?? 0);
    
    $errors = [];
    
    // Validation
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
        // Process valid data
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

These examples demonstrate core PHP concepts and best practices for effective PHP development. 
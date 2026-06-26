# PHP — Using the Formatter

Paste your PHP code into the editor, hit format, and get consistently indented, readable output.

## Hello World

```php
<?php
echo "Hello, World!";
```

Or run it with PHP's built-in server:

```bash
php -S localhost:8000
```

## Variables and Arrays

```php
<?php
// Variables start with $
$name = "John";
$age = 25;
$isStudent = true;

// Indexed array
$fruits = ["apple", "banana", "orange"];

// Associative array
$person = [
    "name" => "John",
    "age" => 25,
    "city" => "New York"
];

echo "Name: " . $person["name"];
```

## Control Flow

```php
<?php
if ($age >= 18) {
    echo "Adult";
} else {
    echo "Minor";
}

// Match expression (PHP 8+) — cleaner than switch
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

## Functions

```php
<?php
function greet(string $name, string $title = "Mr."): string {
    return "Hello, $title $name!";
}

echo greet("John");
echo greet("Jane", "Dr.");
```

## Classes

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

## Inheritance

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

## Database (PDO)

Always use PDO with prepared statements:

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

## Modern PHP Features

```php
<?php
// Null coalescing (PHP 7+)
$name = $_GET['name'] ?? 'Guest';

// Arrow functions (PHP 7.4+)
$doubled = array_map(fn($n) => $n * 2, [1, 2, 3]);

// Named arguments (PHP 8+)
function createUser(string $name, string $email, int $age = 18) { ... }
createUser(email: "john@example.com", name: "John");

// Constructor property promotion (PHP 8+)
class Point {
    public function __construct(
        private int $x,
        private int $y
    ) {}
}
```

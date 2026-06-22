# Java — Code Examples

## A Real Class

```java
public class Person {
    // Instance variables (fields)
    private String name;
    private int age;

    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Getters
    public String getName() { return name; }
    public int getAge() { return age; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setAge(int age) { this.age = age; }

    // Instance method
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age);
    }

    // Static method
    public static void sayHello() {
        System.out.println("Hello from Person class!");
    }
}
```

## Inheritance

```java
public class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {
        super(name, age); // Call parent constructor
        this.studentId = studentId;
    }

    public String getStudentId() { return studentId; }

    @Override
    public void introduce() {
        super.introduce(); // Call parent method
        System.out.println("My student ID is " + studentId);
    }
}
```

## Interface Implementation

```java
public interface Drawable {
    void draw();
    double getArea();
}

public class Circle implements Drawable {
    private double radius;

    public Circle(double radius) { this.radius = radius; }

    @Override
    public void draw() {
        System.out.println("Drawing a circle with radius " + radius);
    }

    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}

public class Rectangle implements Drawable {
    private double width, height;

    public Rectangle(double width, double height) {
        this.width = width;
        this.height = height;
    }

    @Override
    public void draw() {
        System.out.println("Drawing a rectangle " + width + "x" + height);
    }

    @Override
    public double getArea() {
        return width * height;
    }
}
```

## Stream API

```java
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<String> names = List.of("Alice", "Bob", "Charlie", "David");

        // Filter and collect
        List<String> longNames = names.stream()
            .filter(name -> name.length() > 4)
            .collect(Collectors.toList());
        System.out.println("Long names: " + longNames);

        // Map to lengths
        List<Integer> lengths = names.stream()
            .map(String::length)
            .collect(Collectors.toList());
        System.out.println("Name lengths: " + lengths);

        // Reduce — sum of all name lengths
        int totalLength = names.stream()
            .mapToInt(String::length)
            .sum();
        System.out.println("Total length: " + totalLength);
    }
}
```

## Exception Handling

```java
public class ExceptionDemo {
    public static void main(String[] args) {
        try {
            int result = 10 / 0; // Throws ArithmeticException
        } catch (ArithmeticException e) {
            System.out.println("Division by zero: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
        } finally {
            System.out.println("Cleanup always runs");
        }
    }
}
```

### Custom Exception

```java
public class ValidationException extends Exception {
    public ValidationException(String message) {
        super(message);
    }
}

public class Validator {
    public static void validateAge(int age) throws ValidationException {
        if (age < 0) throw new ValidationException("Age cannot be negative");
        if (age > 150) throw new ValidationException("Age seems unrealistic");
        System.out.println("Age is valid: " + age);
    }

    public static void main(String[] args) {
        try {
            validateAge(25);
            validateAge(-5); // This will throw
        } catch (ValidationException e) {
            System.out.println("Validation error: " + e.getMessage());
        }
    }
}
```

## Try-With-Resources

```java
import java.io.*;

public class FileIOExample {
    public static void main(String[] args) {
        // Reading
        try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"))) {
            reader.lines().forEach(System.out::println);
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }

        // Writing
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
            writer.write("Hello, Java!");
            writer.newLine();
            writer.write("This is a test file.");
        } catch (IOException e) {
            System.err.println("Error writing file: " + e.getMessage());
        }
    }
}
```

## JUnit 5 Tests

```java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class Calculator {
    public int add(int a, int b) { return a + b; }

    public double divide(int a, int b) {
        if (b == 0) throw new ArithmeticException("Division by zero");
        return (double) a / b;
    }
}

class CalculatorTest {
    private final Calculator calc = new Calculator();

    @Test
    void testAddition() {
        assertEquals(4, calc.add(2, 2));
        assertEquals(0, calc.add(-1, 1));
        assertEquals(-2, calc.add(-1, -1));
    }

    @Test
    void testDivision() {
        assertEquals(2.5, calc.divide(5, 2), 0.001);
        assertEquals(0.0, calc.divide(0, 5), 0.001);
    }

    @Test
    void testDivisionByZero() {
        assertThrows(ArithmeticException.class, () -> calc.divide(5, 0));
    }
}
```

## Map Operations with Streams

```java
import java.util.Map;
import java.util.HashMap;

Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);

// Find max score
scores.entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .ifPresent(e -> System.out.println(e.getKey() + " has the highest score: " + e.getValue()));

// Filter scores above 90
scores.entrySet().stream()
    .filter(e -> e.getValue() > 90)
    .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));
```

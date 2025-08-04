# Java Code Examples

This document provides practical Java code examples covering essential concepts.

## Basic Syntax Examples

### Hello World Program

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### Variable Declaration and Data Types

```java
public class DataTypesExample {
    public static void main(String[] args) {
        // Primitive data types
        int number = 42;
        double decimal = 3.14;
        boolean flag = true;
        char letter = 'A';
        
        // Reference types
        String text = "Hello Java";
        Integer wrapper = 100;
        
        System.out.println("Number: " + number);
        System.out.println("Decimal: " + decimal);
        System.out.println("Flag: " + flag);
        System.out.println("Letter: " + letter);
        System.out.println("Text: " + text);
        System.out.println("Wrapper: " + wrapper);
    }
}
```

### Control Structures

```java
public class ControlStructuresExample {
    public static void main(String[] args) {
        int age = 25;
        
        // If-else statement
        if (age >= 18) {
            System.out.println("Adult");
        } else {
            System.out.println("Minor");
        }
        
        // Switch statement
        switch (age) {
            case 16:
                System.out.println("Can drive with supervision");
                break;
            case 18:
                System.out.println("Can vote and drive");
                break;
            default:
                System.out.println("Other age");
        }
        
        // For loop
        for (int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
        
        // While loop
        int count = 0;
        while (count < 3) {
            System.out.println("While count: " + count);
            count++;
        }
    }
}
```

### Arrays

```java
public class ArraysExample {
    public static void main(String[] args) {
        // Array declaration and initialization
        int[] numbers = {1, 2, 3, 4, 5};
        String[] names = new String[3];
        names[0] = "Alice";
        names[1] = "Bob";
        names[2] = "Charlie";
        
        // Accessing array elements
        System.out.println("First number: " + numbers[0]);
        System.out.println("Array length: " + numbers.length);
        
        // Iterating through array
        for (int i = 0; i < numbers.length; i++) {
            System.out.println("Number " + i + ": " + numbers[i]);
        }
        
        // Enhanced for loop
        for (String name : names) {
            System.out.println("Name: " + name);
        }
    }
}
```

## Object-Oriented Programming

### Class Definition

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
    
    // Getter methods
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    // Setter methods
    public void setName(String name) {
        this.name = name;
    }
    
    public void setAge(int age) {
        this.age = age;
    }
    
    // Instance method
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
    }
    
    // Static method
    public static void sayHello() {
        System.out.println("Hello from Person class!");
    }
}
```

### Inheritance

```java
public class Student extends Person {
    private String studentId;
    
    public Student(String name, int age, String studentId) {
        super(name, age); // Call parent constructor
        this.studentId = studentId;
    }
    
    public String getStudentId() {
        return studentId;
    }
    
    @Override
    public void introduce() {
        super.introduce(); // Call parent method
        System.out.println("My student ID is " + studentId);
    }
}
```

### Interface Implementation

```java
public interface Drawable {
    void draw();
    double getArea();
}

public class Circle implements Drawable {
    private double radius;
    
    public Circle(double radius) {
        this.radius = radius;
    }
    
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
    private double width;
    private double height;
    
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

## Collections Framework

### List Operations

```java
import java.util.ArrayList;
import java.util.List;

public class ListExample {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();
        
        // Adding elements
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");
        
        // Accessing elements
        System.out.println("First name: " + names.get(0));
        System.out.println("List size: " + names.size());
        
        // Iterating through list
        for (String name : names) {
            System.out.println("Name: " + name);
        }
        
        // Using lambda expressions (Java 8+)
        names.forEach(name -> System.out.println("Hello, " + name));
        
        // Removing elements
        names.remove("Bob");
        System.out.println("After removal: " + names);
    }
}
```

### Map Operations

```java
import java.util.HashMap;
import java.util.Map;

public class MapExample {
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();
        
        // Adding key-value pairs
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        scores.put("Charlie", 92);
        
        // Accessing values
        int aliceScore = scores.get("Alice");
        System.out.println("Alice's score: " + aliceScore);
        
        // Checking if key exists
        if (scores.containsKey("Bob")) {
            System.out.println("Bob's score: " + scores.get("Bob"));
        }
        
        // Iterating through map
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        
        // Using lambda expressions
        scores.forEach((name, score) -> 
            System.out.println(name + " scored " + score));
    }
}
```

## Exception Handling

### Try-Catch Example

```java
public class ExceptionHandlingExample {
    public static void main(String[] args) {
        try {
            // Code that might throw an exception
            int result = 10 / 0;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            // Handle arithmetic exception
            System.out.println("Division by zero: " + e.getMessage());
        } catch (Exception e) {
            // Handle other exceptions
            System.out.println("An error occurred: " + e.getMessage());
        } finally {
            // Code that always executes
            System.out.println("Cleanup code executed");
        }
    }
}
```

### Custom Exception

```java
public class CustomException extends Exception {
    public CustomException(String message) {
        super(message);
    }
}

public class ValidationExample {
    public static void validateAge(int age) throws CustomException {
        if (age < 0) {
            throw new CustomException("Age cannot be negative");
        }
        if (age > 150) {
            throw new CustomException("Age seems unrealistic");
        }
        System.out.println("Age is valid: " + age);
    }
    
    public static void main(String[] args) {
        try {
            validateAge(25);
            validateAge(-5);
        } catch (CustomException e) {
            System.out.println("Validation error: " + e.getMessage());
        }
    }
}
```

## File I/O

### Reading Files

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileReadingExample {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println("Read: " + line);
            }
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }
    }
}
```

### Writing Files

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class FileWritingExample {
    public static void main(String[] args) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
            writer.write("Hello, Java!");
            writer.newLine();
            writer.write("This is a test file.");
            writer.newLine();
            writer.write("Writing from Java program.");
        } catch (IOException e) {
            System.err.println("Error writing file: " + e.getMessage());
        }
    }
}
```

## Modern Java Features (Java 8+)

### Lambda Expressions

```java
import java.util.Arrays;
import java.util.List;

public class LambdaExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");
        
        // Traditional for loop
        for (String name : names) {
            System.out.println("Hello, " + name);
        }
        
        // Lambda expression
        names.forEach(name -> System.out.println("Hello, " + name));
        
        // Method reference
        names.forEach(System.out::println);
    }
}
```

### Stream API

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David", "Eve");
        
        // Filtering
        List<String> longNames = names.stream()
            .filter(name -> name.length() > 4)
            .collect(Collectors.toList());
        System.out.println("Long names: " + longNames);
        
        // Mapping
        List<Integer> nameLengths = names.stream()
            .map(String::length)
            .collect(Collectors.toList());
        System.out.println("Name lengths: " + nameLengths);
        
        // Reducing
        int totalLength = names.stream()
            .mapToInt(String::length)
            .sum();
        System.out.println("Total length: " + totalLength);
    }
}
```

### Optional Class

```java
import java.util.Optional;

public class OptionalExample {
    public static void main(String[] args) {
        // Creating Optional
        Optional<String> optional = Optional.of("Hello");
        Optional<String> empty = Optional.empty();
        
        // Using Optional
        optional.ifPresent(System.out::println);
        
        String result = empty.orElse("Default value");
        System.out.println("Result: " + result);
        
        // Chaining operations
        Optional<String> result2 = optional
            .map(String::toUpperCase)
            .filter(s -> s.length() > 3);
        result2.ifPresent(System.out::println);
    }
}
```

## Testing with JUnit

```java
import org.junit.Test;
import static org.junit.Assert.*;

public class CalculatorTest {
    
    @Test
    public void testAddition() {
        Calculator calc = new Calculator();
        assertEquals(4, calc.add(2, 2));
        assertEquals(0, calc.add(-1, 1));
        assertEquals(-2, calc.add(-1, -1));
    }
    
    @Test
    public void testDivision() {
        Calculator calc = new Calculator();
        assertEquals(2.5, calc.divide(5, 2), 0.001);
        assertEquals(0, calc.divide(0, 5), 0.001);
    }
    
    @Test(expected = ArithmeticException.class)
    public void testDivisionByZero() {
        Calculator calc = new Calculator();
        calc.divide(5, 0);
    }
}

class Calculator {
    public int add(int a, int b) {
        return a + b;
    }
    
    public double divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Division by zero");
        }
        return (double) a / b;
    }
}
```

These examples demonstrate essential Java programming concepts and patterns. Practice with these examples to improve your Java programming skills. 
# Java Usage Tutorial

This tutorial provides a comprehensive guide to getting started with Java development.

## Environment Setup

### Installing Java Development Kit (JDK)

1. **Download JDK** from Oracle's website or use OpenJDK
2. **Install JDK** for your operating system
3. **Set Environment Variables**:
   - JAVA_HOME: Points to JDK installation directory
   - PATH: Add JDK bin directory to system PATH
4. **Verify Installation**:
   ```bash
   java -version
   javac -version
   ```

### Choosing an IDE
- **IntelliJ IDEA**: Professional IDE with excellent Java support
- **Eclipse**: Free, feature-rich IDE
- **VS Code**: Lightweight with Java extensions
- **NetBeans**: Oracle's official IDE

## Basic Java Syntax

### Hello World Program

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### Compilation and Execution

```bash
javac HelloWorld.java
java HelloWorld
```

## Core Language Concepts

### Variables and Data Types

```java
// Primitive data types
int number = 42;
double decimal = 3.14;
boolean flag = true;
char letter = 'A';

// Reference types
String text = "Hello Java";
Integer wrapper = 100;
```

### Control Structures

```java
// If-else statement
if (condition) {
    // code block
} else {
    // code block
}

// Switch statement
switch (variable) {
    case value1:
        // code block
        break;
    default:
        // default code block
}

// Loops
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

while (condition) {
    // code block
}
```

### Arrays

```java
// Array declaration and initialization
int[] numbers = {1, 2, 3, 4, 5};
String[] names = new String[3];

// Accessing array elements
int firstNumber = numbers[0];
names[0] = "John";
```

## Object-Oriented Programming

### Creating Classes

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
    
    // Methods
    public String getName() {
        return name;
    }
    
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
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
    
    @Override
    public void introduce() {
        super.introduce(); // Call parent method
        System.out.println("My student ID is " + studentId);
    }
}
```

### Interfaces

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
        System.out.println("Drawing a circle");
    }
    
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }
}
```

## Collections Framework

### Lists

```java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

// Iterating through a list
for (String name : names) {
    System.out.println(name);
}

// Using lambda expressions (Java 8+)
names.forEach(name -> System.out.println(name));
```

### Maps

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);

// Accessing map values
int aliceScore = scores.get("Alice");

// Iterating through a map
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

## Exception Handling

### Try-Catch Blocks

```java
try {
    // Code that might throw an exception
    int result = 10 / 0;
} catch (ArithmeticException e) {
    // Handle the exception
    System.out.println("Division by zero: " + e.getMessage());
} catch (Exception e) {
    // Handle other exceptions
    System.out.println("An error occurred: " + e.getMessage());
} finally {
    // Code that always executes
    System.out.println("Cleanup code");
}
```

### Custom Exceptions

```java
public class CustomException extends Exception {
    public CustomException(String message) {
        super(message);
    }
}

// Using custom exceptions
public void validateAge(int age) throws CustomException {
    if (age < 0) {
        throw new CustomException("Age cannot be negative");
    }
}
```

## File I/O

### Reading Files

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.err.println("Error reading file: " + e.getMessage());
}
```

### Writing Files

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

try (BufferedWriter writer = new BufferedWriter(new FileWriter("output.txt"))) {
    writer.write("Hello, Java!");
    writer.newLine();
    writer.write("This is a test file.");
} catch (IOException e) {
    System.err.println("Error writing file: " + e.getMessage());
}
```

## Modern Java Features (Java 8+)

### Lambda Expressions

```java
// Before Java 8
Runnable runnable = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello from thread");
    }
};

// With lambda expressions
Runnable runnable = () -> System.out.println("Hello from thread");

// Lambda with parameters
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(name -> System.out.println("Hello, " + name));
```

### Stream API

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// Filtering
List<String> longNames = names.stream()
    .filter(name -> name.length() > 4)
    .collect(Collectors.toList());

// Mapping
List<Integer> nameLengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());

// Reducing
int totalLength = names.stream()
    .mapToInt(String::length)
    .sum();
```

### Optional Class

```java
import java.util.Optional;

Optional<String> optional = Optional.of("Hello");
optional.ifPresent(System.out::println);

Optional<String> empty = Optional.empty();
String result = empty.orElse("Default value");
```

## Build Tools

### Maven

**pom.xml example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>my-app</artifactId>
    <version>1.0-SNAPSHOT</version>
    
    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.13.2</version>
            <scope>test</scope>
        </dependency>
    </dependencies>
</project>
```

### Gradle

**build.gradle example:**
```gradle
plugins {
    id 'java'
}

repositories {
    mavenCentral()
}

dependencies {
    testImplementation 'junit:junit:4.13.2'
}

java {
    sourceCompatibility = JavaVersion.VERSION_11
    targetCompatibility = JavaVersion.VERSION_11
}
```

## Testing

### JUnit Testing

```java
import org.junit.Test;
import static org.junit.Assert.*;

public class CalculatorTest {
    
    @Test
    public void testAddition() {
        Calculator calc = new Calculator();
        assertEquals(4, calc.add(2, 2));
    }
    
    @Test
    public void testDivision() {
        Calculator calc = new Calculator();
        assertEquals(2.5, calc.divide(5, 2), 0.001);
    }
}
```

## Best Practices

### Code Organization

1. **Package Structure**
   ```
   com.company.project/
   ├── model/
   ├── service/
   ├── controller/
   └── util/
   ```

2. **Naming Conventions**
   - Classes: PascalCase (e.g., `UserAccount`)
   - Methods/Variables: camelCase (e.g., `getUserName`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_SIZE`)
   - Packages: lowercase (e.g., `com.example.app`)

3. **Documentation**
   ```java
   /**
    * Calculates the area of a circle.
    * @param radius the radius of the circle
    * @return the area of the circle
    */
   public double calculateArea(double radius) {
       return Math.PI * radius * radius;
   }
   ```

### Performance Tips

1. **Use StringBuilder for String Concatenation**
   ```java
   StringBuilder sb = new StringBuilder();
   for (int i = 0; i < 1000; i++) {
       sb.append("item ").append(i).append(", ");
   }
   String result = sb.toString();
   ```

2. **Prefer Interface Types**
   ```java
   // Good
   List<String> names = new ArrayList<>();
   
   // Avoid
   ArrayList<String> names = new ArrayList<>();
   ```

3. **Use Try-With-Resources**
   ```java
   try (FileInputStream fis = new FileInputStream("file.txt")) {
       // Use the resource
   } catch (IOException e) {
       // Handle exception
   }
   ```

## Debugging and Troubleshooting

### Common Issues

1. **NullPointerException**
   - Always check for null before using objects
   - Use Optional for nullable values

2. **ClassNotFoundException**
   - Check classpath configuration
   - Verify package declarations

3. **OutOfMemoryError**
   - Increase heap size: `-Xmx2g`
   - Check for memory leaks
   - Use profiling tools

### Debugging Tools

1. **IDE Debugger**: Set breakpoints and inspect variables
2. **JConsole**: Monitor JVM performance
3. **VisualVM**: Advanced profiling and monitoring
4. **Logging**: Use SLF4J or Log4j for application logging

This tutorial covers the essential concepts and practices for Java development. Continue exploring the language features and ecosystem to become proficient in Java programming. 
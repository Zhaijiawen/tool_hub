# Java — 代码示例

## 一个实际的类

```java
public class Person {
    // 实例变量（字段）
    private String name;
    private int age;

    // 构造函数
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Getter
    public String getName() { return name; }
    public int getAge() { return age; }

    // Setter
    public void setName(String name) { this.name = name; }
    public void setAge(int age) { this.age = age; }

    // 实例方法
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age);
    }

    // 静态方法
    public static void sayHello() {
        System.out.println("Hello from Person class!");
    }
}
```

## 继承

```java
public class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {
        super(name, age); // 调用父类构造函数
        this.studentId = studentId;
    }

    public String getStudentId() { return studentId; }

    @Override
    public void introduce() {
        super.introduce(); // 调用父类方法
        System.out.println("My student ID is " + studentId);
    }
}
```

## 接口实现

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

        // 过滤并收集
        List<String> longNames = names.stream()
            .filter(name -> name.length() > 4)
            .collect(Collectors.toList());
        System.out.println("Long names: " + longNames);

        // 映射为长度
        List<Integer> lengths = names.stream()
            .map(String::length)
            .collect(Collectors.toList());
        System.out.println("Name lengths: " + lengths);

        // 归约 — 所有名字长度之和
        int totalLength = names.stream()
            .mapToInt(String::length)
            .sum();
        System.out.println("Total length: " + totalLength);
    }
}
```

## 异常处理

```java
public class ExceptionDemo {
    public static void main(String[] args) {
        try {
            int result = 10 / 0; // 抛出 ArithmeticException
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

### 自定义异常

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
            validateAge(-5); // 这里会抛异常
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
        // 读文件
        try (BufferedReader reader = new BufferedReader(new FileReader("input.txt"))) {
            reader.lines().forEach(System.out::println);
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
        }

        // 写文件
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

## JUnit 5 测试

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

## Map 结合 Stream 操作

```java
import java.util.Map;
import java.util.HashMap;

Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);

// 找出最高分
scores.entrySet().stream()
    .max(Map.Entry.comparingByValue())
    .ifPresent(e -> System.out.println(e.getKey() + " 最高分: " + e.getValue()));

// 筛选 90 分以上
scores.entrySet().stream()
    .filter(e -> e.getValue() > 90)
    .forEach(e -> System.out.println(e.getKey() + ": " + e.getValue()));
```

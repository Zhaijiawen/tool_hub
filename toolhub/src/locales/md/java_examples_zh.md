# Java 代码示例

本文档提供了涵盖核心概念的实用 Java 代码示例。

## 基础语法示例

### Hello World 程序

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 变量声明与数据类型

```java
public class DataTypesExample {
    public static void main(String[] args) {
        // 基本数据类型
        int number = 42;
        double decimal = 3.14;
        boolean flag = true;
        char letter = 'A';

        // 引用类型
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

### 控制结构

```java
public class ControlStructuresExample {
    public static void main(String[] args) {
        int age = 25;

        // if-else 语句
        if (age >= 18) {
            System.out.println("Adult");
        } else {
            System.out.println("Minor");
        }

        // for 循环
        for (int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }

        // while 循环
        int count = 0;
        while (count < 3) {
            System.out.println("While count: " + count);
            count++;
        }
    }
}
```

## 面向对象编程

### 类定义

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

    // Getter 方法
    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    // Setter 方法
    public void setName(String name) {
        this.name = name;
    }

    public void setAge(int age) {
        this.age = age;
    }

    // 实例方法
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
    }

    // 静态方法
    public static void sayHello() {
        System.out.println("Hello from Person class!");
    }
}
```

### 继承

```java
public class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {
        super(name, age); // 调用父类构造函数
        this.studentId = studentId;
    }

    public String getStudentId() {
        return studentId;
    }

    @Override
    public void introduce() {
        super.introduce(); // 调用父类方法
        System.out.println("My student ID is " + studentId);
    }
}
```

### 接口实现

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

## 集合框架

### List 操作

```java
import java.util.ArrayList;
import java.util.List;

public class ListExample {
    public static void main(String[] args) {
        List<String> names = new ArrayList<>();

        // 添加元素
        names.add("Alice");
        names.add("Bob");
        names.add("Charlie");

        // 访问元素
        System.out.println("First name: " + names.get(0));
        System.out.println("List size: " + names.size());

        // 遍历列表
        for (String name : names) {
            System.out.println("Name: " + name);
        }

        // 使用 lambda 表达式（Java 8+）
        names.forEach(name -> System.out.println("Hello, " + name));

        // 移除元素
        names.remove("Bob");
        System.out.println("After removal: " + names);
    }
}
```

### Map 操作

```java
import java.util.HashMap;
import java.util.Map;

public class MapExample {
    public static void main(String[] args) {
        Map<String, Integer> scores = new HashMap<>();

        // 添加键值对
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        scores.put("Charlie", 92);

        // 访问值
        int aliceScore = scores.get("Alice");
        System.out.println("Alice's score: " + aliceScore);

        // 判断键是否存在
        if (scores.containsKey("Bob")) {
            System.out.println("Bob's score: " + scores.get("Bob"));
        }

        // 遍历 Map
        for (Map.Entry<String, Integer> entry : scores.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }

        // 使用 lambda 表达式
        scores.forEach((name, score) ->
            System.out.println(name + " scored " + score));
    }
}
```

## 异常处理

### Try-Catch 示例

```java
public class ExceptionHandlingExample {
    public static void main(String[] args) {
        try {
            // 可能抛出异常的代码
            int result = 10 / 0;
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            // 处理算术异常
            System.out.println("Division by zero: " + e.getMessage());
        } catch (Exception e) {
            // 处理其他异常
            System.out.println("An error occurred: " + e.getMessage());
        } finally {
            // 总是执行的代码
            System.out.println("Cleanup code executed");
        }
    }
}
```

### 自定义异常

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

## 文件 I/O

### 读取文件

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

### 写入文件

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

## 现代 Java 特性（Java 8+）

### Lambda 表达式

```java
import java.util.Arrays;
import java.util.List;

public class LambdaExample {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

        // 传统 for 循环
        for (String name : names) {
            System.out.println("Hello, " + name);
        }

        // Lambda 表达式
        names.forEach(name -> System.out.println("Hello, " + name));

        // 方法引用
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

        // 过滤
        List<String> longNames = names.stream()
            .filter(name -> name.length() > 4)
            .collect(Collectors.toList());
        System.out.println("Long names: " + longNames);

        // 映射
        List<Integer> nameLengths = names.stream()
            .map(String::length)
            .collect(Collectors.toList());
        System.out.println("Name lengths: " + nameLengths);

        // 归约
        int totalLength = names.stream()
            .mapToInt(String::length)
            .sum();
        System.out.println("Total length: " + totalLength);
    }
}
```

### Optional 类

```java
import java.util.Optional;

public class OptionalExample {
    public static void main(String[] args) {
        // 创建 Optional
        Optional<String> optional = Optional.of("Hello");
        Optional<String> empty = Optional.empty();

        // 使用 Optional
        optional.ifPresent(System.out::println);

        String result = empty.orElse("Default value");
        System.out.println("Result: " + result);

        // 链式操作
        Optional<String> result2 = optional
            .map(String::toUpperCase)
            .filter(s -> s.length() > 3);
        result2.ifPresent(System.out::println);
    }
}
```

## JUnit 测试

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

这些示例演示了 Java 编程的核心概念和常见模式。建议结合这些示例进行练习以提升编程能力。
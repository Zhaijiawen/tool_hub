# Java 使用教程

本教程提供了Java开发的综合指南。

## 环境搭建

### 安装Java开发工具包（JDK）

1. **下载JDK** 从Oracle官网或使用OpenJDK
2. **安装JDK** 为您的操作系统安装
3. **设置环境变量**：
   - JAVA_HOME：指向JDK安装目录
   - PATH：将JDK bin目录添加到系统PATH
4. **验证安装**：
   ```bash
   java -version
   javac -version
   ```

### 选择IDE
- **IntelliJ IDEA**：专业的Java IDE
- **Eclipse**：免费、功能丰富的IDE
- **VS Code**：轻量级，带有Java扩展
- **NetBeans**：Oracle官方IDE

## 基本Java语法

### Hello World程序

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

### 编译和执行

```bash
javac HelloWorld.java
java HelloWorld
```

## 核心语言概念

### 变量和数据类型

```java
// 基本数据类型
int number = 42;
double decimal = 3.14;
boolean flag = true;
char letter = 'A';

// 引用类型
String text = "Hello Java";
Integer wrapper = 100;
```

### 控制结构

```java
// If-else语句
if (condition) {
    // 代码块
} else {
    // 代码块
}

// Switch语句
switch (variable) {
    case value1:
        // 代码块
        break;
    default:
        // 默认代码块
}

// 循环
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

while (condition) {
    // 代码块
}
```

### 数组

```java
// 数组声明和初始化
int[] numbers = {1, 2, 3, 4, 5};
String[] names = new String[3];

// 访问数组元素
int firstNumber = numbers[0];
names[0] = "John";
```

## 面向对象编程

### 创建类

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
    
    // 方法
    public String getName() {
        return name;
    }
    
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
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
    
    @Override
    public void introduce() {
        super.introduce(); // 调用父类方法
        System.out.println("My student ID is " + studentId);
    }
}
```

### 接口

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

## 集合框架

### 列表

```java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

// 遍历列表
for (String name : names) {
    System.out.println(name);
}

// 使用lambda表达式（Java 8+）
names.forEach(name -> System.out.println(name));
```

### 映射

```java
import java.util.HashMap;
import java.util.Map;

Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.put("Charlie", 92);

// 访问映射值
int aliceScore = scores.get("Alice");

// 遍历映射
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

## 异常处理

### Try-Catch块

```java
try {
    // 可能抛出异常的代码
    int result = 10 / 0;
} catch (ArithmeticException e) {
    // 处理异常
    System.out.println("Division by zero: " + e.getMessage());
} catch (Exception e) {
    // 处理其他异常
    System.out.println("An error occurred: " + e.getMessage());
} finally {
    // 总是执行的代码
    System.out.println("Cleanup code");
}
```

### 自定义异常

```java
public class CustomException extends Exception {
    public CustomException(String message) {
        super(message);
    }
}

// 使用自定义异常
public void validateAge(int age) throws CustomException {
    if (age < 0) {
        throw new CustomException("Age cannot be negative");
    }
}
```

## 文件I/O

### 读取文件

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

### 写入文件

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

## 现代Java功能（Java 8+）

### Lambda表达式

```java
// Java 8之前
Runnable runnable = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello from thread");
    }
};

// 使用lambda表达式
Runnable runnable = () -> System.out.println("Hello from thread");

// 带参数的lambda
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");
names.forEach(name -> System.out.println("Hello, " + name));
```

### Stream API

```java
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// 过滤
List<String> longNames = names.stream()
    .filter(name -> name.length() > 4)
    .collect(Collectors.toList());

// 映射
List<Integer> nameLengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());

// 归约
int totalLength = names.stream()
    .mapToInt(String::length)
    .sum();
```

### Optional类

```java
import java.util.Optional;

Optional<String> optional = Optional.of("Hello");
optional.ifPresent(System.out::println);

Optional<String> empty = Optional.empty();
String result = empty.orElse("Default value");
```

## 构建工具

### Maven

**pom.xml示例：**
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

**build.gradle示例：**
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

## 测试

### JUnit测试

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

## 最佳实践

### 代码组织

1. **包结构**
   ```
   com.company.project/
   ├── model/
   ├── service/
   ├── controller/
   └── util/
   ```

2. **命名约定**
   - 类：PascalCase（如`UserAccount`）
   - 方法/变量：camelCase（如`getUserName`）
   - 常量：UPPER_SNAKE_CASE（如`MAX_SIZE`）
   - 包：小写（如`com.example.app`）

3. **文档**
   ```java
   /**
    * 计算圆的面积。
    * @param radius 圆的半径
    * @return 圆的面积
    */
   public double calculateArea(double radius) {
       return Math.PI * radius * radius;
   }
   ```

### 性能技巧

1. **使用StringBuilder进行字符串连接**
   ```java
   StringBuilder sb = new StringBuilder();
   for (int i = 0; i < 1000; i++) {
       sb.append("item ").append(i).append(", ");
   }
   String result = sb.toString();
   ```

2. **优先使用接口类型**
   ```java
   // 好
   List<String> names = new ArrayList<>();
   
   // 避免
   ArrayList<String> names = new ArrayList<>();
   ```

3. **使用Try-With-Resources**
   ```java
   try (FileInputStream fis = new FileInputStream("file.txt")) {
       // 使用资源
   } catch (IOException e) {
       // 处理异常
   }
   ```

## 调试和故障排除

### 常见问题

1. **NullPointerException**
   - 在使用对象之前始终检查null
   - 对可空值使用Optional

2. **ClassNotFoundException**
   - 检查类路径配置
   - 验证包声明

3. **OutOfMemoryError**
   - 增加堆大小：`-Xmx2g`
   - 检查内存泄漏
   - 使用性能分析工具

### 调试工具

1. **IDE调试器**：设置断点和检查变量
2. **JConsole**：监控JVM性能
3. **VisualVM**：高级性能分析和监控
4. **日志记录**：使用SLF4J或Log4j进行应用程序日志记录

本教程涵盖了Java开发的基本概念和实践。继续探索语言功能和生态系统，以精通Java编程。 
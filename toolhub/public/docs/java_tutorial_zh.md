# Java — 使用格式化工具

Java 格式化工具把缩进混乱的代码整理得干净规范。粘贴到编辑区，点格式化，结果原位输出。

## Hello World

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

编译运行：

```bash
javac HelloWorld.java
java HelloWorld
```

## 变量和类型

```java
// 基本类型
int number = 42;
double price = 3.14;
boolean flag = true;
char letter = 'A';

// 引用类型
String text = "Hello Java";
Integer wrapper = 100;
```

## 控制流

```java
// If-else
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}

// Switch（Java 14+ 的 switch 表达式更干净）
switch (variable) {
    case V1 -> System.out.println("Case 1");
    case V2 -> System.out.println("Case 2");
    default -> System.out.println("Default");
}

// 循环
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

while (condition) {
    doSomething();
}
```

## 类

```java
public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }

    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age);
    }
}
```

## 继承和接口

```java
public class Student extends Person {
    private String studentId;

    public Student(String name, int age, String studentId) {
        super(name, age);
        this.studentId = studentId;
    }

    @Override
    public void introduce() {
        super.introduce();
        System.out.println("My student ID is " + studentId);
    }
}

public interface Drawable {
    void draw();
    double getArea();
}

public class Circle implements Drawable {
    private double radius;

    public Circle(double radius) { this.radius = radius; }

    @Override
    public void draw() { System.out.println("Drawing a circle"); }

    @Override
    public double getArea() { return Math.PI * radius * radius; }
}
```

## 集合

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.forEach(System.out::println);

Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 87);
scores.forEach((name, score) -> System.out.println(name + ": " + score));
```

## 现代 Java（Java 8+）

Lambda 表达式替代了匿名内部类：

```java
// Java 8 之前
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};

// 用 lambda
Runnable r = () -> System.out.println("Hello");
```

Stream API 链式过滤/映射/归约：

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

List<String> longNames = names.stream()
    .filter(name -> name.length() > 4)
    .collect(Collectors.toList());
```

## Try-With-Resources

实现了 `AutoCloseable` 的资源会被自动关闭：

```java
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line;
    while ((line = reader.readLine()) != null) {
        System.out.println(line);
    }
} catch (IOException e) {
    System.err.println("Error: " + e.getMessage());
}
```

不用再写 `finally` 块手动关流了——JVM 帮你搞定。

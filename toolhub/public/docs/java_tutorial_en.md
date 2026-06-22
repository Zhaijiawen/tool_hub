# Java — Using the Formatter

The Java formatter takes messy, inconsistently indented code and produces clean, idiomatic Java. Paste your code on the left, formatted output on the right.

## Hello World

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

Compile and run:

```bash
javac HelloWorld.java
java HelloWorld
```

## Variables and Types

```java
// Primitives
int number = 42;
double price = 3.14;
boolean flag = true;
char letter = 'A';

// Reference types
String text = "Hello Java";
Integer wrapper = 100;
```

## Control Flow

```java
// If-else
if (age >= 18) {
    System.out.println("Adult");
} else {
    System.out.println("Minor");
}

// Switch (Java 14+ switch expressions are even cleaner)
switch (variable) {
    case V1 -> System.out.println("Case 1");
    case V2 -> System.out.println("Case 2");
    default -> System.out.println("Default");
}

// Loops
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

while (condition) {
    doSomething();
}
```

## Classes

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

## Inheritance and Interfaces

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

## Collections

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

## Modern Java (Java 8+)

Lambda expressions replaced anonymous inner classes:

```java
// Before Java 8
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello");
    }
};

// With lambda
Runnable r = () -> System.out.println("Hello");
```

The Stream API chains filter/map/reduce:

```java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

List<String> longNames = names.stream()
    .filter(name -> name.length() > 4)
    .collect(Collectors.toList());
```

## Try-With-Resources

Resources that implement `AutoCloseable` get auto-closed:

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

No `finally` block needed just to close the reader — the JVM handles it.

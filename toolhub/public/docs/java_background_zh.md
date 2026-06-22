# Java — 幕后原理

Java 诞生于 1995 年的 Sun Microsystems。James Gosling 团队最初管它叫 "Oak"，瞄准的是互动电视，但互联网爆炸了，Java 火速转向。"一次编写，到处运行"不是营销口号——编译成字节码，有 JVM 就能跑，二十多年过去了还是这么运作。

## JVM 是真正的秘密武器

Java 编译产出的是 `.class` 文件，里面是字节码，不是原生机器码。JVM 加载字节码，验证合法性（没有缓冲区溢出、没有野指针），然后要么解释执行、要么即时编译（JIT）成原生代码。这意味着 Windows 上编译的 Java 程序拿到 Linux 或 macOS 上直接跑，不用改一行代码。

JVM 还管内存。没有 `malloc`/`free`，没有指针运算。垃圾回收器跟踪哪些对象还"活"着，回收剩下的。可以用 JVM 参数切换 GC 算法（G1、ZGC、Shenandoah），但大多数应用默认的就够了。

## 类型系统

Java 是静态类型的——每个变量都声明了类型，编译器在代码运行前就把类型错误揪出来。八个基本类型（`int`、`long`、`double`、`float`、`boolean`、`char`、`byte`、`short`），其余全是引用类型。

这几年 Java 的类型系统灵活了不少。Java 5 加了泛型（类型安全的集合）。Java 8 加了 lambda 和 Stream API——曾经纯 OOP 的语言现在也能写函数式风格。Java 17 的 sealed class 能控制哪些类可以继承你定义的类。

## 生态

- **Spring Boot** 驱动了世界上大多数企业后端。约定优于配置，嵌入式 Tomcat，自动装配。上手快，但内存占用不小。
- **Maven / Gradle** 管依赖和构建。Maven 的 `pom.xml` 啰嗦但可预测；Gradle 更简洁。
- **JUnit 5** 是标准测试框架。Mockito 做 mock，AssertJ 做流式断言。
- **IntelliJ IDEA**（JetBrains 出品）是事实上的标准 IDE。Eclipse 和 VS Code + 插件也能用。

## Java 做对了什么

**向后兼容。** Java 1.0 的代码基本还能在 Java 21 上编译运行。这是双刃剑——旧代码一直能跑（好），但一些过时的 API 设计也被永久固化了（坏）。

**强大的并发支持。** `java.util.concurrent` 里有久经考验的线程池、锁、原子变量、并发集合实现。虚拟线程（Project Loom，Java 21 稳定版）让百万级轻量级线程成为现实。

**标准库够大。** 文件 I/O、网络、加密、XML/JSON 解析、日期时间（Java 8 后的 java.time 包设计得非常好）、集合、Stream——全在标准库里。

## 需要注意的地方

**受检异常。** Java 强制你声明或捕获某些异常类型。这个设计让很多开发者头疼，尤其只是为了满足编译器要求而包装异常的时候。

**啰嗦。** Java 比 Python 或 JavaScript 需要更多仪式感。Lombok 可以在编译期生成 getter/setter/builder，`var`（Java 10+）能简化局部变量声明：`var user = new User("Alice")` 替代 `User user = new User("Alice")`。

**内存。** JVM 自身消耗不可忽视。一个最简单的 Spring Boot 应用可能用掉 200MB+ 堆内存。微服务场景可以考虑 Quarkus 或 Micronaut，编译成 GraalVM 原生镜像，启动快、内存小。

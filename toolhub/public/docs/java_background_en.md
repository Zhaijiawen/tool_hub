# Java — What's Going On Under the Hood

Java was born at Sun Microsystems in 1995. James Gosling and his team originally called it "Oak" and aimed it at interactive TV, but the web exploded and Java pivoted hard. The "Write Once, Run Anywhere" pitch wasn't marketing fluff — compile to bytecode, run it on any machine with a JVM installed. Twenty-five years later, that's still how it works.

## The JVM Is the Secret Sauce

Java compiles to `.class` files containing bytecode, not native machine code. The JVM loads those, verifies them (no buffer overflows, no wild pointer arithmetic), and either interprets them or compiles them to native code on the fly (JIT — Just-In-Time compilation). This means a Java program compiled on Windows runs unchanged on Linux or macOS.

The JVM also manages memory for you. No `malloc`/`free`, no pointer arithmetic. The garbage collector tracks which objects are still reachable and reclaims the rest. You can tune which GC algorithm to use (G1, ZGC, Shenandoah) with JVM flags, but for most apps the defaults work fine.

## The Type System

Java is statically typed — every variable has a declared type, and the compiler catches type mismatches before your code ever runs. Eight primitive types (`int`, `long`, `double`, `float`, `boolean`, `char`, `byte`, `short`) and everything else is a reference type.

Java's type system has gotten more flexible over the years. Java 5 added generics (type-safe collections). Java 8 added lambdas and the Stream API — you can now write functional-style code in what was once a strictly OOP language. Java 17 sealed classes let you control which classes can extend a given class.

## The Ecosystem

- **Spring Boot** runs most of the world's enterprise backend code. Convention over configuration, embedded Tomcat, auto-wiring.
- **Maven / Gradle** handle dependencies and builds. Maven's `pom.xml` is verbose but predictable; Gradle's `build.gradle` is more concise.
- **JUnit 5** is the standard test framework. Mockito for mocking, AssertJ for fluent assertions.
- **IntelliJ IDEA** by JetBrains is the de facto IDE. Eclipse and VS Code with extensions work too.

## What Java Gets Right

**Backwards compatibility.** Code written for Java 1.0 generally still compiles and runs on Java 21. This is both a blessing (your old code keeps working) and a curse (some legacy API design is fossilized).

**Strong concurrency support.** `java.util.concurrent` has battle-tested implementations of thread pools, locks, atomic variables, concurrent collections. Virtual threads (Project Loom, stable in Java 21) make it practical to spin up millions of lightweight threads.

**The standard library is enormous.** File I/O, networking, cryptography, XML/JSON parsing, date/time (java.time is excellent since Java 8), collections, streams — all in the box.

## Things to Watch Out For

**Checked exceptions.** Java forces you to declare or catch certain exception types. It's a design choice that annoys many developers, especially when wrapping checked exceptions in unchecked ones just to satisfy the compiler.

**Verbosity.** Java requires more ceremony than Python or JavaScript. Lombok can generate getters/setters/builders at compile time, and `var` (Java 10+) helps with local variable declarations: `var user = new User("Alice")` instead of `User user = new User("Alice")`.

**Memory.** The JVM itself consumes significant memory. A minimal Spring Boot app can use 200+ MB of heap. For microservices, consider Quarkus or Micronaut which compile to native images (GraalVM).

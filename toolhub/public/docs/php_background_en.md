# PHP — What's Going On Under the Hood

PHP started in 1994 as Rasmus Lerdorf's collection of Perl scripts for tracking visits to his online resume. "Personal Home Page" grew into a full language, and today PHP powers roughly 75% of the web (WordPress alone drives over 40% of all websites).

## How PHP Executes

PHP is server-side — the web server hands requests to the PHP interpreter, which produces HTML/JSON/XML and sends it back. With Apache, `mod_php` runs PHP inline. With Nginx, PHP-FPM (FastCGI Process Manager) acts as a separate process pool. Either way, each request gets a fresh execution context — no shared state between requests unless you deliberately use sessions or caches.

PHP 7+ (the Zend Engine 3) was a huge leap. Performance roughly doubled compared to PHP 5. OPcache stores precompiled bytecode in memory so the interpreter skips parsing on repeated requests.

## Type System

PHP is dynamically typed with optional type declarations since PHP 7:

```php
function greet(string $name, int $age): string {
    return "Hello, $name. You are $age.";
}
```

Scalar types: `int`, `float`, `string`, `bool`. Compound: `array`, `object`, `callable`. The `mixed` type (PHP 8) means "anything." `never` (PHP 8.1) means "this function won't return."

Arrays in PHP are actually ordered hash maps — they serve as both arrays and dictionaries. This is incredibly flexible but also a frequent source of bugs when you expect indexed behavior and get associative.

## The Ecosystem

- **Laravel** dominates. Eloquent ORM, Blade templates, Artisan CLI, built-in queue workers. Modern PHP is essentially Laravel-first.
- **Symfony** components underpin Laravel and many other projects. Doctrine ORM.
- **WordPress** powers the CMS world. Plugin ecosystem with 60,000+ plugins.
- **Composer** handles dependencies. `composer.json` + `composer.lock` = reproducible builds. Packagist is the package registry.
- **PHPUnit** for testing, **Xdebug** for debugging, **PHPStan** (or Psalm) for static analysis.

## What to Watch Out For

**`==` vs `===`.** PHP's loose comparison is famously weird: `0 == "foo"` is `true`. Always use strict comparison (`===`) unless you explicitly want type coercion.

**PDO for database access.** Never use `mysql_*` functions (removed in PHP 7). Never use raw `mysqli_*` without prepared statements. PDO + prepared statements = immune to SQL injection.

**Include/require paths.** PHP resolves relative paths from the PHP process's working directory, not the file doing the include. Use `__DIR__ . '/file.php'` for reliable includes.

**Error reporting.** Production: `display_errors = Off`, `log_errors = On`. Development: `error_reporting = E_ALL`. PHP 8 made many warnings into TypeErrors, so code that worked on PHP 7 might throw on PHP 8.

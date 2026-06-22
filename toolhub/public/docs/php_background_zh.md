# PHP — 幕后原理

PHP 始于 1994 年 Rasmus Lerdorf 写的一套 Perl 脚本，用来追踪他的在线简历访问量。"Personal Home Page" 慢慢长成了一门完整的语言。今天 PHP 撑起了大约 75% 的 Web（仅 WordPress 就驱动了超过 40% 的网站）。

## PHP 怎么执行

PHP 是服务器端语言——Web 服务器把请求交给 PHP 解释器，解释器产出 HTML/JSON/XML 返回。Apache 用 `mod_php` 内联执行；Nginx 用 PHP-FPM（FastCGI 进程管理器）作为独立进程池。不管哪种方式，每个请求都获得全新的执行上下文——请求之间不共享状态，除非你主动用了 session 或缓存。

PHP 7+（Zend Engine 3）是一场性能飞跃。比 PHP 5 快了差不多一倍。OPcache 把预编译的字节码存内存里，重复请求跳过解析步骤。

## 类型系统

PHP 是动态类型语言，自 PHP 7 起支持可选的类型声明：

```php
function greet(string $name, int $age): string {
    return "Hello, $name. You are $age.";
}
```

标量类型：`int`、`float`、`string`、`bool`。复合类型：`array`、`object`、`callable`。`mixed`（PHP 8）表示「任意类型」。`never`（PHP 8.1）表示「这个函数绝不会返回」。

PHP 的数组实际上是哈希映射——同时扮演索引数组和字典的角色。灵活是真灵活，但当你期望索引行为却得到关联行为时，也是 bug 的高发地。

## 生态

- **Laravel** 统治了现代 PHP。Eloquent ORM、Blade 模板、Artisan 命令行、内置队列系统。如今 PHP 开发基本以 Laravel 为中心。
- **Symfony** 组件是 Laravel 和很多其他项目的底层。Doctrine ORM。
- **WordPress** 统治 CMS 领域。六万多个插件的生态。
- **Composer** 管依赖。`composer.json` + `composer.lock` = 可复现的构建。Packagist 是包注册中心。
- **PHPUnit** 做测试，**Xdebug** 做调试，**PHPStan**（或 Psalm）做静态分析。

## 需要注意的地方

**`==` 和 `===`。** PHP 的松散比较出了名的诡异：`0 == "foo"` 是 `true`。永远用严格比较（`===`），除非你明确需要类型自动转换。

**PDO 做数据库访问。** 绝对不要用 `mysql_*` 函数（PHP 7 已移除）。不要用裸的 `mysqli_*` 而不用预处理语句。PDO + 预处理语句 = 免疫 SQL 注入。

**Include/require 路径。** PHP 用进程的工作目录而非当前文件所在目录来解析相对路径。用 `__DIR__ . '/file.php'` 保证引用可靠。

**错误报告。** 生产环境：`display_errors = Off`，`log_errors = On`。开发环境：`error_reporting = E_ALL`。PHP 8 把很多 Warning 升级成了 TypeError，PHP 7 上能跑的代码到 PHP 8 可能直接抛异常。

# YAML — 幕后原理

YAML 诞生于 2001 年，就是冲着 XML 的啰嗦去的。Clark Evans 想要一种不用解析器也能直接读懂的格式。名字从 "Yet Another Markup Language" 改成了 "YAML Ain't Markup Language"，就是要说清楚：这是给数据用的，不是给文档用的。

## YAML 为什么统治了配置文件

跟 JSON 比，最大的好处？能写注释。你可以在配置值旁边解释*为什么*设成这个值。而且没有括号噪音——缩进本身就承载了结构。盯了几年花括号再看清爽的 YAML，跟摘下墨镜进室内差不多。

跟 XML 比，YAML 简洁得离谱。200 行的 XML 配置，换成 YAML 可能 20 行就够了。半夜两三点 debug CI 管道的时候，少翻几屏真的救命。

## 60 秒速通语法

```yaml
# 井号开头是注释
key: value                    # 简单标量
nested:
  child: value                # 缩进（2 个空格）创建层级
list:
  - item1                     # 序列用短横线
  - item2
  - name: John                # 列表项可以是对象
    age: 30
```

## 数据类型

```yaml
string: "hello"               # 没有特殊字符时引号可省略
number: 42
float: 3.14
boolean: true                 # 或 false
null_value: null              # 也可以用 ~
multiline: |                  # | 保留换行符
  line one
  line two
folded: >                     # > 把换行折叠成空格
  this becomes
  one line
```

## 那些没人告诉你的坑

**缩进必须是空格，不能是制表符。** 混用的话 YAML 解析器报错的行号可能对不上。在编辑器里打开空白字符显示，一眼就能看到问题。

**挪威问题。** 不带引号的 `no`、`yes`、`on`、`off` 被当成布尔值。所以 `country: no` 的意思是 `country: false`。挪威（Norway 里带 no）字面意义上能把 YAML 配置搞崩。老老实实加引号：`country: "no"`。

**值里有 `:`。** `url: http://example.com` 报语法错误，因为解析器把第一个 `:` 当成键值分隔符了。加引号就行：`url: "http://example.com"`。

**锚点和别名** 用来消除重复块：

```yaml
defaults: &defaults
  timeout: 30
  retries: 3

dev:
  <<: *defaults
  host: localhost

prod:
  <<: *defaults
  host: prod.example.com
```

`&` 定义锚点，`*` 引用，`<<:` 合并键。

**多文档文件** 用 `---` 做分隔符，`...` 做结束符：

```yaml
---
doc1: value
---
doc2: value
```

## YAML 1.1 还是 1.2

YAML 1.2（2009 年）清理了大量类型歧义。`Yes`/`No`/`On`/`Off` 只有在 1.1 里算布尔值——1.2 要求小写。大多数现代解析器用 1.2，但有些（比如 PyYAML）默认还是 1.1。值得确认你的工具用的是哪个规范。

## 在哪些地方会碰到 YAML

- **Kubernetes** — 每个 manifest 都是 YAML
- **Docker Compose** — 服务定义
- **GitHub Actions / GitLab CI** — 工作流定义
- **Ansible** — 剧本和清单
- **Helm** — Kubernetes 包管理器模板
- **各种 CI/CD 管道** — 几乎清一色 YAML

## 安全提醒

YAML 解析器能执行的东西天差地别。PyYAML 的 `load()` 如果输入里包含 `!!python/object` 标签，可以直接跑任意 Python 代码。处理不受信任的输入一定用 `safe_load()` 或等价方法。每个语言的 YAML 库都有安全模式——除非有明确理由，否则默认用安全模式。

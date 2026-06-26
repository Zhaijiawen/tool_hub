# YAML — 使用格式化工具

粘贴 YAML 到编辑区，点格式化，结果原位输出。工具自动统一缩进、规范键值间距。

## 格式化流程

把缩进不一致的：

```yaml
database:
    host: localhost
    port: 5432
    name: myapp
    user: admin
server:
    port: 8080
    host: 0.0.0.0
    timeout: 30
```

点格式化，变成：

```yaml
database:
  host: localhost
  port: 5432
  name: myapp
  user: admin

server:
  port: 8080
  host: 0.0.0.0
  timeout: 30
```

工具统一缩进为 2 空格，让层级关系一目了然。

## 常见写法要点

**缩进不对：**

```yaml
# 有问题 — 键后面没缩进
key:
nested: value

# 修正后
key:
  nested: value
```

**没加引号的特殊值：**

```yaml
# 有问题 — URL 里的冒号被当成新键
url: http://example.com

# 修正后
url: "http://example.com"
```

**yes/no/on/off 没加引号：**

```yaml
# 有问题 — 被解析成布尔值，不是字符串
country: no

# 修正后
country: "no"
```

这些坑格式化帮不了你——它是排版工具，不做语义检查。但格式化的缩进和间距能让你在提交前看清文档结构，更容易发现这类问题。

## 多行字符串

```yaml
# 字面量块 — 保留换行
description: |
  第一行。
  第二行。
  第三行。

# 折叠块 — 换行变成空格
summary: >
  这段很长的文本在输出中
  会被折叠成一行。
```

保留格式用 `|`（脚本、证书、markdown），只想源码好看、输出无所谓用 `>`。

## 锚点和别名

重复的配置块定义一次，到处引用：

```yaml
defaults: &defaults
  timeout: 30
  retries: 3

development:
  <<: *defaults
  host: localhost
  debug: true

production:
  <<: *defaults
  host: prod.example.com
  debug: false
```

`&defaults` 设置锚点，`*defaults` 引用，`<<:` 把所有键合并进来。

## 多文档流

一个文件里塞多个 YAML 文档，用 `---` 分隔：

```yaml
---
name: doc1
value: 123
---
name: doc2
value: 456
```

Kubernetes 就是这么用的：一个文件里的每个资源定义都是独立文档。

## 实用建议

- 坚持 2 个空格缩进。这已经是事实标准，所有工具都认。
- 编辑器里打开空白字符显示。制表符混进 YAML 是神秘报错的第一大来源。
- 以 `{`、`[`、`!`、`%`、`&`、`*` 开头，或者包含 `:`（非键值分隔）的值，记得加引号。
- `#` 注释大胆用——这是选 YAML 不选 JSON 的主要理由。

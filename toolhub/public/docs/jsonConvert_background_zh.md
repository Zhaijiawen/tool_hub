# JSON 多格式互转 - 技术背景

## 数据序列化格式概览

在现代软件开发中，存在多种数据序列化格式，各有其优缺点和适用场景。本工具支持五种最常用格式的互相转换。

## JSON（JavaScript Object Notation）

JSON 是目前最广泛使用的数据交换格式。

**特点：**
- 语法简洁，人类可读
- 语言无关，几乎所有编程语言都支持
- 支持嵌套结构、数组、字符串、数字、布尔值、null
- 不支持注释
- 不支持日期类型（需序列化为字符串）

```json
{
  "name": "ToolHub",
  "version": "1.0",
  "features": ["format", "encrypt", "convert"],
  "active": true
}
```

## YAML（YAML Ain't Markup Language）

YAML 是 JSON 的超集，专注于人类可读性，常用于配置文件。

**特点：**
- 缩进表示层级关系，无需括号
- 支持注释（以 `#` 开头）
- 支持多行字符串
- 语法更简洁，适合配置文件
- 大小写敏感

```yaml
name: ToolHub
version: "1.0"
features:
  - format
  - encrypt
  - convert
active: true
```

## CSV（Comma-Separated Values）

CSV 是表格数据的标准格式，适合平铺的二维数据。

**特点：**
- 结构简单，第一行通常为表头
- 适合电子表格软件（Excel、Google Sheets）
- 只支持一维对象数组，不支持嵌套
- 支持逗号、制表符等多种分隔符

```csv
id,name,age,city
1,张三,25,北京
2,李四,30,上海
3,王五,28,广州
```

## TOML（Tom's Obvious Minimal Language）

TOML 是专为配置文件设计的格式，语法简洁且类型明确。

**特点：**
- 明确的类型系统（整数、浮点、布尔、日期时间）
- 支持注释
- 语法直观，不易出错
- 常用于 Rust（Cargo.toml）、Python（pyproject.toml）等项目配置

```toml
[project]
name = "ToolHub"
version = "1.0"
active = true

[project.features]
list = ["format", "encrypt", "convert"]
```

## XML（eXtensible Markup Language）

XML 是一种标记语言，适合需要语义丰富结构的场景。

**特点：**
- 支持属性和元素，表达能力最强
- 支持命名空间
- 支持 DTD/Schema 验证
- 语法冗长，体积较大
- 广泛用于 SOAP、Android 配置、Maven、RSS 等

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>ToolHub</name>
  <version>1.0</version>
  <features>
    <item>format</item>
    <item>encrypt</item>
    <item>convert</item>
  </features>
  <active>true</active>
</root>
```

## 格式对比

| 特性 | JSON | YAML | CSV | TOML | XML |
|------|------|------|-----|------|-----|
| 人类可读性 | 中 | 高 | 高 | 高 | 低 |
| 嵌套支持 | ✅ | ✅ | ❌ | ✅ | ✅ |
| 注释支持 | ❌ | ✅ | ❌ | ✅ | ✅ |
| 类型系统 | 基础 | 基础 | 无 | 丰富 | 无 |
| 文件体积 | 小 | 小 | 最小 | 小 | 大 |
| 适用场景 | API/存储 | 配置 | 表格 | 配置 | 企业级 |

## 转换注意事项

### JSON ↔ YAML
- YAML 是 JSON 超集，转换基本无损
- YAML 的锚点（`&`）和别名（`*`）在转 JSON 后会展开

### JSON ↔ CSV
- JSON 必须是对象数组（`[{...}, {...}]`）才能转 CSV
- 嵌套对象会被展平或丢失
- CSV 转 JSON 时所有值默认为字符串类型

### JSON ↔ TOML
- TOML 有更丰富的类型，如日期时间，转 JSON 后变为字符串
- JSON 的 null 在 TOML 中没有直接对应类型

### JSON ↔ XML
- XML 的属性和文本节点需要约定转换规则
- 数组在 XML 中通常用重复同名标签表示


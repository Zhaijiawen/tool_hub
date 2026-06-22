# JSON 多格式互转 - 技术背景

数据在不同系统间流转，格式五花八门。API 返回 JSON，配置文件用 YAML 或 TOML，Excel 导出是 CSV，遗留系统还在说 XML。这个工具在五种格式之间做翻译。

## 五种格式快速对比

### JSON
API 和数据交换的默认选择。简洁、所有语言原生支持、没有注释、没有日期类型。如果一个系统对外暴露数据但没说明格式，多半就是 JSON。

```json
{
  "name": "ToolHub",
  "version": "1.0",
  "features": ["format", "encrypt", "convert"],
  "active": true
}
```

### YAML
JSON 的更可读版本，严格来说是 JSON 的超集。用缩进代替括号，对人友好但对机器更娇气（空白字符敏感）。支持 `#` 注释。CI/CD 配置、Docker Compose、Kubernetes 清单、Ansible playbook 都默认用它。

```yaml
name: ToolHub
version: "1.0"
features:
  - format
  - encrypt
  - convert
active: true
```

### CSV
最简单 -- 行和列。不支持嵌套、没有类型、逗号分隔。为电子表格而生，特征很明显。第一行按惯例是表头。只能处理平面表格数据，嵌套 JSON 对象转 CSV 会丢失结构。

```csv
id,name,age,city
1,张三,25,北京
2,李四,30,上海
```

### TOML
专为配置文件设计。有完整的类型系统（整数、浮点、布尔、日期时间、数组），支持注释，用 `[section]` 语法分组。写过 Rust（`Cargo.toml`）或 Python（`pyproject.toml`）的都不会陌生。

```toml
[project]
name = "ToolHub"
version = "1.0"
active = true

[project.features]
list = ["format", "encrypt", "convert"]
```

### XML
啰嗦的老兵。属性、元素、命名空间、schema -- XML 什么都有，通常比需要的多。企业场景还在大量使用（SOAP、SAML、RSS、Android 布局）。转 JSON 时会丢失一些语义，因为 XML 的属性和文本节点没法干净地映射到 JSON 的键值模型。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <name>ToolHub</name>
  <version>1.0</version>
  <features>
    <item>format</item>
    <item>encrypt</item>
  </features>
</root>
```

## 速览

| 特性 | JSON | YAML | CSV | TOML | XML |
|------|------|------|-----|------|-----|
| 嵌套 | 支持 | 支持 | 不支持 | 支持 | 支持 |
| 注释 | 不支持 | 支持 | 不支持 | 支持 | 支持 |
| 类型 | 基础 | 基础 | 无 | 丰富 | 无 |
| 体积 | 小 | 小 | 最小 | 小 | 大 |
| 主要用途 | API/存储 | 配置 | 表格 | 配置 | 企业级 |

## 转换中会丢失什么

**JSON 到 CSV：** 只能转平面对象数组。深层嵌套结构会被拍平或丢弃。CSV 转 JSON 时所有值都变成字符串 -- 数字和布尔需要手动类型转换。

**YAML 到 JSON：** YAML 注释会消失（JSON 没有注释语法）。YAML 的锚点（`&`）和别名（`*`）会被展开为完整值。

**JSON 到 TOML：** TOML 的丰富类型（比如日期时间）到了 JSON 变成字符串。JSON 的 `null` 在 TOML 中没有直接的对应。

**XML 到 JSON：** XML 属性需要约定规则 -- 通常变成 `@attr` 形式或合并到子元素中。数组通过重复的同名标签表示，需要协商一致的规则。

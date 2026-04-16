# JSON 多格式互转 - 使用教程

## 快速开始

JSON 多格式互转工具支持 JSON、YAML、CSV、TOML、XML 五种格式之间的任意互相转换，操作简单，无需安装任何软件。

## 基本使用流程

### 步骤 1：粘贴源数据

在左侧输入区粘贴你的源数据。工具会自动尝试检测输入的格式类型，也可以手动在下拉框中选择正确的输入格式。

### 步骤 2：选择目标格式

在右侧的格式下拉框中选择你希望转换到的目标格式（与输入格式不同即可）。

### 步骤 3：点击转换

点击 **"转换"** 按钮执行转换，右侧输出区将显示转换后的内容。

### 步骤 4：复制或下载

- 点击 **"复制"** 将结果复制到剪贴板
- 点击 **"下载"** 保存为对应格式的文件

## 各格式转换详解

### JSON → YAML

**输入（JSON）：**
```json
{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "mydb"
  },
  "features": ["auth", "cache"]
}
```

**输出（YAML）：**
```yaml
database:
  host: localhost
  port: 5432
  name: mydb
features:
  - auth
  - cache
```

### YAML → JSON

**输入（YAML）：**
```yaml
# 服务器配置
server:
  host: 0.0.0.0
  port: 8080
  debug: false
```

**输出（JSON）：**
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 8080,
    "debug": false
  }
}
```
> 注意：YAML 中的注释在转换到 JSON 时会被去掉。

### JSON → CSV

**输入（JSON，必须是对象数组）：**
```json
[
  {"id": 1, "name": "张三", "age": 25, "city": "北京"},
  {"id": 2, "name": "李四", "age": 30, "city": "上海"},
  {"id": 3, "name": "王五", "age": 28, "city": "广州"}
]
```

**输出（CSV）：**
```csv
id,name,age,city
1,张三,25,北京
2,李四,30,上海
3,王五,28,广州
```

### CSV → JSON

**输入（CSV）：**
```csv
name,price,in_stock
苹果,3.5,true
香蕉,1.2,true
榴莲,25.0,false
```

**输出（JSON）：**
```json
[
  {"name": "苹果", "price": "3.5", "in_stock": "true"},
  {"name": "香蕉", "price": "1.2", "in_stock": "true"},
  {"name": "榴莲", "price": "25.0", "in_stock": "false"}
]
```
> 注意：CSV 转 JSON 时，所有值均为字符串类型，如需数字类型请手动处理。

### JSON → XML

**输入（JSON）：**
```json
{
  "person": {
    "name": "张三",
    "age": 25,
    "hobbies": ["读书", "运动"]
  }
}
```

**输出（XML）：**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<root>
  <person>
    <name>张三</name>
    <age>25</age>
    <hobbies>读书</hobbies>
    <hobbies>运动</hobbies>
  </person>
</root>
```

## 互换功能

点击中间的 **"互换"** 按钮，可以将左侧输出内容移到右侧、左右格式对换，方便进行反向转换验证。

## 常见问题

**Q：为什么 JSON 转 CSV 报错？**

A：JSON 转 CSV 要求输入必须是对象数组（`[{...}, {...}]`），不能是普通对象或基本类型。

**Q：YAML 转换后注释消失了？**

A：JSON 不支持注释，YAML 中的注释在转 JSON 时会被丢弃，这是正常行为。

**Q：XML 转 JSON 后结构很奇怪？**

A：XML 中的属性（`<tag attr="val">`）和文本节点会按照约定规则映射到 JSON，可能需要根据实际需求手动调整结果。

## 最佳实践

1. **转换前先验证格式**：确保源数据本身是合法的格式，否则转换会失败
2. **CSV 数据整理**：确保 CSV 第一行是有意义的字段名，且每行列数一致
3. **大文件处理**：超过 1MB 的数据可能导致浏览器卡顿，建议分批处理
4. **下载保存**：重要的转换结果建议使用下载功能保存到本地


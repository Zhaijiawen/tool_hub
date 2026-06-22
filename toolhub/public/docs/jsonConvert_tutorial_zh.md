# JSON 多格式互转 - 使用教程

在 JSON、YAML、CSV、TOML、XML 五种格式之间互转。贴数据、选格式、点转换、复制走人。

## 操作流程

### 1. 贴源数据

把数据贴到左边输入区。工具会尝试自动识别格式，识别错了的话手动从下拉框选正确的。

### 2. 选目标格式

右边选你要转成的格式。不能和输入格式一样 -- JSON 转 JSON 没意义。

### 3. 点转换

点按钮，右边出结果。

### 4. 复制或下载

复制按钮最快。需要文件的话点下载保存为目标格式的文件。

## 各种转换示例

### JSON 转 YAML -- API 配置转 CI 文件

输入：
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

输出：
```yaml
database:
  host: localhost
  port: 5432
  name: mydb
features:
  - auth
  - cache
```

### YAML 转 JSON -- 反着来

输入：
```yaml
# 服务器配置
server:
  host: 0.0.0.0
  port: 8080
  debug: false
```

输出（注释没了，JSON 不支持注释）：
```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 8080,
    "debug": false
  }
}
```

### JSON 转 CSV -- 必须是对象数组

输入：
```json
[
  {"id": 1, "name": "张三", "age": 25, "city": "北京"},
  {"id": 2, "name": "李四", "age": 30, "city": "上海"},
  {"id": 3, "name": "王五", "age": 28, "city": "广州"}
]
```

输出：
```csv
id,name,age,city
1,张三,25,北京
2,李四,30,上海
3,王五,28,广州
```

### CSV 转 JSON -- 所有值都变字符串

输入：
```csv
name,price,in_stock
苹果,3.5,true
香蕉,1.2,true
```

输出（注意数字和布尔也被引号包着）：
```json
[
  {"name": "苹果", "price": "3.5", "in_stock": "true"},
  {"name": "香蕉", "price": "1.2", "in_stock": "true"}
]
```

`price` 想要数字、`in_stock` 想要布尔？转换后自己 `parseFloat` / `map` 处理一下。

### JSON 转 XML

输入：
```json
{
  "person": {
    "name": "张三",
    "age": 25,
    "hobbies": ["读书", "运动"]
  }
}
```

输出（数组变成重复标签）：
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

## 互换按钮

中间那个按钮交换输入输出内容和格式 -- 反向转换验证数据有没有被改坏的好办法。

## 常见坑

**JSON 转 CSV 失败？** 数据多半不是平面对象数组。嵌套对象没法转 CSV，结构一定会丢。

**YAML 注释没了？** 正常。JSON 不支持注释，转换时直接丢弃。

**XML 转 JSON 结构奇怪？** XML 属性和文本节点没法 1:1 映射到 JSON。转换器按标准约定处理，但具体 schema 的特殊需求可能需要手动调整。

**数据量大？** 超过 1MB 浏览器可能会卡。分批处理，或者用 `yq`、`dasel` 这种命令行工具处理大文件。

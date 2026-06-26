# XML — 使用格式化工具

粘贴 XML 到编辑区，点格式化，缩进和标签嵌套自动整理。

格式化前：

```xml
<bookstore><book category="fiction"><title lang="en">The Great Gatsby</title><author>Fitzgerald</author><year>1925</year><price currency="USD">10.99</price></book></bookstore>
```

格式化后：

```xml
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>Fitzgerald</author>
    <year>1925</year>
    <price currency="USD">10.99</price>
  </book>
</bookstore>
```

## 结构规则

每个 XML 文档必须格式良好：
- 有且只有一个根元素，包含所有其他元素
- 每个开标签必须有对应的闭标签（或自闭合：`<br/>`）
- 元素必须正确嵌套——不能交叉重叠
- 属性值必须用引号包围
- 特殊字符（`<`、`>`、`&`、`"`、`'`）必须转义

## 命名空间

```xml
<root xmlns:bk="http://example.com/books"
      xmlns:auth="http://example.com/authors">
  <bk:book>
    <bk:title>XML Guide</bk:title>
    <auth:name>John Doe</auth:name>
  </bk:book>
</root>
```

## 属性 vs 元素

元数据用属性（ID、类型、引用），内容用元素：

```xml
<!-- 好的做法 -->
<book isbn="978-0-123-45678-9">
  <title>伟大的小说</title>
  <author>李四</author>
</book>

<!-- 别把内容塞属性里 -->
<book title="伟大的小说" author="李四" isbn="978-0-123-45678-9" />
```

## 常见写法要点

**未闭合的标签** — `<book>` 缺 `</book>` 会导致解析失败，格式化后嵌套一目了然便于排查。

**大小写不匹配** — `<Book>` 和 `</book>` 被视为不同的标签，XML 是大小写敏感的。

**属性值缺引号** — `<book category=fiction>` 无效，必须是 `<book category="fiction">`。

**未转义的 and 符号** — 内容里的 `&` 必须写成 `&amp;`。URL 里最容易踩坑：`http://example.com?a=1&b=2` 是无效 XML，应该用 `&amp;`。

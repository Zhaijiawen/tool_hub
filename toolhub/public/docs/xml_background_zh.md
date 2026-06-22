# XML — 幕后原理

XML 由 W3C 在 1998 年标准化，是 SGML 的简化子集。核心卖点：结构化的、自描述的数据，人和机器都能读。大概十年间，XML 是通用数据交换格式——SOAP、RSS、XHTML、SVG、Office 文档全用它。

## 结构

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price currency="USD">10.99</price>
  </book>
</bookstore>
```

元素形成树结构。属性挂在元素上。所有标签必须正确嵌套和闭合。XML 对格式规范性极其严格——一个标签没闭合，解析器直接拒绝整个文档。这种严格性是设计决策：你永远知道自己在什么状态。

## XML vs JSON

JSON 基本取代了 XML 做 API 数据交换，因为它更轻，直接映射到 JavaScript 对象。但 XML 在以下场景仍然不可替代：

- **Schema 验证（XSD）** — 强制精确的结构和数据类型
- **命名空间** — 混合多个词汇表而不冲突
- **XPath/XSLT** — 查询和转换文档
- **混合内容** — 文本中穿插标记（想想 HTML 的 XML 形式）
- **文档格式** — DOCX、ODS、SVG 底层全是 XML

## XML 工具链

- **DTD / XSD** — 定义和验证文档结构
- **XPath** — 节点查询语言：`//book[@category='fiction']/title`
- **XSLT** — 把 XML 转成 HTML、PDF 或其他 XML
- **XQuery** — 完整查询语言（XML 版的 SQL）
- **DOM / SAX** — 解析 API；DOM 加载整棵树，SAX 流式处理事件

## 常见痛点

**啰嗦。** XML 很占字符。每个开标签都要闭标签，标签名写两遍。数据密集型载荷比等效 JSON 多一倍字节。

**属性 vs 元素。** 千古争论：元数据该用属性（`<book category="fiction">`）还是子元素（`<category>fiction</category>`）？属性不能包含结构化数据，不能重复，顺序无意义。元素更灵活。

**解析开销。** DOM 解析把整棵树加载到内存。大文件（几 GB 的 XML dump）需要 SAX/StAX 流式解析器。

## XML 还在哪些地方称王

- **Office 文档** — DOCX、XLSX、PPTX 是 ZIP 包，里面是 XML
- **SVG** — 矢量图形
- **RSS/Atom** — Web 订阅
- **Android 布局** — 视图层级
- **SOAP** — 企业 Web 服务（银行、保险、政府还在用）
- **Maven POM** — Java 构建配置

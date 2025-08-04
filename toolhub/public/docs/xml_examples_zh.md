# XML 代码示例

## 基本 XML 结构示例

### 简单元素

```xml
<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>张三</name>
  <age>25</age>
  <occupation>软件开发者</occupation>
</person>
```

### 带属性的元素

```xml
<?xml version="1.0" encoding="UTF-8"?>
<person id="123" type="employee">
  <name>李四</name>
  <email>lisi@example.com</email>
  <department>工程部</department>
</person>
```

### 嵌套元素

```xml
<?xml version="1.0" encoding="UTF-8"?>
<company>
  <name>科技公司</name>
  <employees>
    <employee id="1">
      <name>张三</name>
      <position>高级开发者</position>
      <department>工程部</department>
    </employee>
    <employee id="2">
      <name>李四</name>
      <position>产品经理</position>
      <department>产品部</department>
    </employee>
  </employees>
</company>
```

## 配置文件示例

### 应用程序配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <database>
    <host>localhost</host>
    <port>5432</port>
    <name>myapp_db</name>
    <user>admin</user>
    <password>secret</password>
  </database>
  
  <server>
    <port>8080</port>
    <host>0.0.0.0</host>
    <timeout>30</timeout>
  </server>
  
  <logging>
    <level>INFO</level>
    <file>logs/app.log</file>
    <maxSize>10MB</maxSize>
  </logging>
</configuration>
```

### Web 应用程序配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
         http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">
  
  <display-name>我的 Web 应用程序</display-name>
  
  <servlet>
    <servlet-name>MyServlet</servlet-name>
    <servlet-class>com.example.MyServlet</servlet-class>
    <init-param>
      <param-name>configFile</param-name>
      <param-value>/WEB-INF/config.properties</param-value>
    </init-param>
  </servlet>
  
  <servlet-mapping>
    <servlet-name>MyServlet</servlet-name>
    <url-pattern>/api/*</url-pattern>
  </servlet-mapping>
</web-app>
```

## 数据交换示例

### 产品目录

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <product id="P001" category="electronics">
    <name>无线耳机</name>
    <description>具有降噪功能的高质量无线耳机</description>
    <price currency="CNY">199.99</price>
    <specifications>
      <batteryLife>20小时</batteryLife>
      <connectivity>蓝牙5.0</connectivity>
      <weight>250g</weight>
    </specifications>
    <availability>in-stock</availability>
  </product>
  
  <product id="P002" category="accessories">
    <name>USB-C 数据线</name>
    <description>高速 USB-C 充电数据线</description>
    <price currency="CNY">19.99</price>
    <specifications>
      <length>2m</length>
      <power>100W</power>
      <data>10Gbps</data>
    </specifications>
    <availability>in-stock</availability>
  </product>
</catalog>
```

### API 响应

```xml
<?xml version="1.0" encoding="UTF-8"?>
<response>
  <status>success</status>
  <timestamp>2024-01-15T10:30:00Z</timestamp>
  <data>
    <user id="123">
      <name>张三</name>
      <email>zhangsan@example.com</email>
      <profile>
        <avatar>https://example.com/avatar.jpg</avatar>
        <bio>热爱干净代码的软件开发者</bio>
      </profile>
      <preferences>
        <theme>dark</theme>
        <language>zh</language>
        <notifications>true</notifications>
      </preferences>
    </user>
  </data>
  <metadata>
    <requestId>req_123456</requestId>
    <processingTime>45ms</processingTime>
  </metadata>
</response>
```

## Web 服务示例

### SOAP 请求

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Header>
    <auth:Authentication xmlns:auth="http://example.com/auth">
      <auth:Username>zhangsan</auth:Username>
      <auth:Password>secret123</auth:Password>
    </auth:Authentication>
  </soap:Header>
  
  <soap:Body>
    <GetUserDetails xmlns="http://example.com/user">
      <userId>123</userId>
      <includeProfile>true</includeProfile>
    </GetUserDetails>
  </soap:Body>
</soap:Envelope>
```

### SOAP 响应

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <GetUserDetailsResponse xmlns="http://example.com/user">
      <user>
        <id>123</id>
        <name>张三</name>
        <email>zhangsan@example.com</email>
        <profile>
          <avatar>https://example.com/avatar.jpg</avatar>
          <bio>软件开发者</bio>
        </profile>
      </user>
    </GetUserDetailsResponse>
  </soap:Body>
</soap:Envelope>
```

## RSS 订阅示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>技术博客</title>
    <link>https://example.com/blog</link>
    <description>最新技术新闻和教程</description>
    <language>zh-cn</language>
    <lastBuildDate>Mon, 15 Jan 2024 10:30:00 GMT</lastBuildDate>
    <atom:link href="https://example.com/blog/rss" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>XML 入门</title>
      <link>https://example.com/blog/xml-intro</link>
      <description>学习 XML 的基础知识及其在现代 Web 开发中的应用。</description>
      <pubDate>Mon, 15 Jan 2024 09:00:00 GMT</pubDate>
      <guid>https://example.com/blog/xml-intro</guid>
    </item>
    
    <item>
      <title>JSON vs XML</title>
      <link>https://example.com/blog/json-vs-xml</link>
      <description>比较 JSON 和 XML 在 Web 应用程序中的数据交换。</description>
      <pubDate>Sun, 14 Jan 2024 14:30:00 GMT</pubDate>
      <guid>https://example.com/blog/json-vs-xml</guid>
    </item>
  </channel>
</rss>
```

## XHTML 示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="zh">
<head>
  <title>示例 XHTML 文档</title>
  <meta name="description" content="一个示例 XHTML 文档"/>
  <meta name="keywords" content="XHTML, XML, HTML"/>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <div id="header">
    <h1>欢迎访问我们的网站</h1>
    <p>这是一个正确格式化的 XHTML 文档。</p>
  </div>
  
  <div id="content">
    <h2>关于 XML</h2>
    <p>XML 是一种设计用于存储和传输数据的标记语言。</p>
    
    <ul>
      <li>自描述性</li>
      <li>可扩展性</li>
      <li>平台无关性</li>
    </ul>
  </div>
  
  <div id="footer">
    <p>&copy; 2024 示例公司。保留所有权利。</p>
  </div>
</body>
</html>
```

## JavaScript 处理示例

### 解析 XML

```js
// 从字符串解析 XML
const xmlString = `
<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>张三</name>
  <age>30</age>
</person>
`

const parser = new DOMParser()
const xmlDoc = parser.parseFromString(xmlString, "text/xml")

// 提取数据
const name = xmlDoc.querySelector("name").textContent
const age = xmlDoc.querySelector("age").textContent

console.log(`姓名: ${name}, 年龄: ${age}`)

// 处理解析错误
try {
  const invalidXml = '<person><name>张三</name><age>30</age>'
  const result = parser.parseFromString(invalidXml, "text/xml")
  
  if (result.getElementsByTagName("parsererror").length > 0) {
    console.error("XML 解析错误")
  }
} catch (error) {
  console.error("XML 解析错误:", error.message)
}
```

### 创建 XML

```js
// 创建 XML 文档
const doc = document.implementation.createDocument(null, "root", null)
const root = doc.documentElement

// 添加元素
const person = doc.createElement("person")
const name = doc.createElement("name")
name.textContent = "张三"
person.appendChild(name)

const age = doc.createElement("age")
age.textContent = "30"
person.appendChild(age)

root.appendChild(person)

// 序列化为字符串
const serializer = new XMLSerializer()
const xmlString = serializer.serializeToString(doc)
console.log(xmlString)
```

### 处理 XML 命名空间

```js
// 解析带命名空间的 XML
const xmlWithNS = `
<?xml version="1.0" encoding="UTF-8"?>
<root xmlns:user="http://example.com/user">
  <user:person>
    <user:name>张三</user:name>
    <user:email>zhangsan@example.com</user:email>
  </user:person>
</root>
`

const parser = new DOMParser()
const doc = parser.parseFromString(xmlWithNS, "text/xml")

// 使用命名空间查询
const names = doc.getElementsByTagNameNS("http://example.com/user", "name")
console.log(names[0].textContent) // "张三"
```

## 错误处理示例

### 验证错误响应

```xml
<?xml version="1.0" encoding="UTF-8"?>
<errors>
  <error>
    <code>VALIDATION_ERROR</code>
    <message>无效的 XML 结构</message>
    <details>
      <field>email</field>
      <issue>邮箱格式无效</issue>
      <value>invalid-email</value>
    </details>
    <line>15</line>
    <column>23</column>
  </error>
  
  <error>
    <code>REQUIRED_FIELD_MISSING</code>
    <message>缺少必需字段</message>
    <details>
      <field>name</field>
      <issue>姓名字段是必需的</issue>
    </details>
    <line>8</line>
    <column>12</column>
  </error>
  
  <timestamp>2024-01-15T10:30:00Z</timestamp>
  <requestId>req_123456</requestId>
</errors>
```

### 系统错误响应

```xml
<?xml version="1.0" encoding="UTF-8"?>
<error>
  <code>INTERNAL_SERVER_ERROR</code>
  <message>发生意外错误</message>
  <details>数据库连接失败</details>
  <timestamp>2024-01-15T10:30:00Z</timestamp>
  <requestId>req_123456</requestId>
  <stack>Error: Connection timeout...</stack>
</error>
```

## 高级示例

### 复杂嵌套结构

```xml
<?xml version="1.0" encoding="UTF-8"?>
<organization>
  <id>org_001</id>
  <name>科技公司</name>
  <departments>
    <department id="dept_001">
      <name>工程部</name>
      <manager>
        <id>emp_001</id>
        <name>张经理</name>
        <email>zhang.manager@techcorp.com</email>
      </manager>
      <employees>
        <employee id="emp_002">
          <name>李工程师</name>
          <position>高级开发者</position>
          <skills>
            <skill>JavaScript</skill>
            <skill>Python</skill>
            <skill>React</skill>
          </skills>
          <projects>
            <project id="proj_001">
              <name>电商平台</name>
              <status>进行中</status>
              <progress>75</progress>
            </project>
          </projects>
        </employee>
      </employees>
    </department>
  </departments>
  
  <settings>
    <timezone>UTC+8</timezone>
    <workingHours>
      <start>09:00</start>
      <end>18:00</end>
    </workingHours>
    <holidays>
      <holiday>2024-01-01</holiday>
      <holiday>2024-02-10</holiday>
      <holiday>2024-10-01</holiday>
    </holidays>
  </settings>
</organization>
```

### XML Schema 示例

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="person">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="name" type="xs:string"/>
        <xs:element name="age" type="xs:integer"/>
        <xs:element name="email" type="xs:string"/>
      </xs:sequence>
      <xs:attribute name="id" type="xs:integer" use="required"/>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

这些示例演示了在 Web 开发、数据交换和文档管理中常见的各种 XML 模式和用例。 
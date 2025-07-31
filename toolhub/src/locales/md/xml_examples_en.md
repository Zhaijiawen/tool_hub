# XML Code Examples

## Basic XML Structure Examples

### Simple Element

```xml
<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>John Doe</name>
  <age>25</age>
  <occupation>Software Developer</occupation>
</person>
```

### Element with Attributes

```xml
<?xml version="1.0" encoding="UTF-8"?>
<person id="123" type="employee">
  <name>Jane Smith</name>
  <email>jane.smith@example.com</email>
  <department>Engineering</department>
</person>
```

### Nested Elements

```xml
<?xml version="1.0" encoding="UTF-8"?>
<company>
  <name>TechCorp</name>
  <employees>
    <employee id="1">
      <name>John Doe</name>
      <position>Senior Developer</position>
      <department>Engineering</department>
    </employee>
    <employee id="2">
      <name>Jane Smith</name>
      <position>Product Manager</position>
      <department>Product</department>
    </employee>
  </employees>
</company>
```

## Configuration File Examples

### Application Configuration

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

### Web Application Configuration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://java.sun.com/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://java.sun.com/xml/ns/javaee
         http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
         version="3.0">
  
  <display-name>My Web Application</display-name>
  
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

## Data Exchange Examples

### Product Catalog

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <product id="P001" category="electronics">
    <name>Wireless Headphones</name>
    <description>High-quality wireless headphones with noise cancellation</description>
    <price currency="USD">199.99</price>
    <specifications>
      <batteryLife>20 hours</batteryLife>
      <connectivity>Bluetooth 5.0</connectivity>
      <weight>250g</weight>
    </specifications>
    <availability>in-stock</availability>
  </product>
  
  <product id="P002" category="accessories">
    <name>USB-C Cable</name>
    <description>High-speed USB-C charging cable</description>
    <price currency="USD">19.99</price>
    <specifications>
      <length>2m</length>
      <power>100W</power>
      <data>10Gbps</data>
    </specifications>
    <availability>in-stock</availability>
  </product>
</catalog>
```

### API Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<response>
  <status>success</status>
  <timestamp>2024-01-15T10:30:00Z</timestamp>
  <data>
    <user id="123">
      <name>John Doe</name>
      <email>john@example.com</email>
      <profile>
        <avatar>https://example.com/avatar.jpg</avatar>
        <bio>Software developer passionate about clean code</bio>
      </profile>
      <preferences>
        <theme>dark</theme>
        <language>en</language>
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

## Web Services Examples

### SOAP Request

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Header>
    <auth:Authentication xmlns:auth="http://example.com/auth">
      <auth:Username>john_doe</auth:Username>
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

### SOAP Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <soap:Body>
    <GetUserDetailsResponse xmlns="http://example.com/user">
      <user>
        <id>123</id>
        <name>John Doe</name>
        <email>john@example.com</email>
        <profile>
          <avatar>https://example.com/avatar.jpg</avatar>
          <bio>Software developer</bio>
        </profile>
      </user>
    </GetUserDetailsResponse>
  </soap:Body>
</soap:Envelope>
```

## RSS Feed Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Tech Blog</title>
    <link>https://example.com/blog</link>
    <description>Latest technology news and tutorials</description>
    <language>en-us</language>
    <lastBuildDate>Mon, 15 Jan 2024 10:30:00 GMT</lastBuildDate>
    <atom:link href="https://example.com/blog/rss" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>Introduction to XML</title>
      <link>https://example.com/blog/xml-intro</link>
      <description>Learn the basics of XML and its applications in modern web development.</description>
      <pubDate>Mon, 15 Jan 2024 09:00:00 GMT</pubDate>
      <guid>https://example.com/blog/xml-intro</guid>
    </item>
    
    <item>
      <title>JSON vs XML</title>
      <link>https://example.com/blog/json-vs-xml</link>
      <description>Comparing JSON and XML for data exchange in web applications.</description>
      <pubDate>Sun, 14 Jan 2024 14:30:00 GMT</pubDate>
      <guid>https://example.com/blog/json-vs-xml</guid>
    </item>
  </channel>
</rss>
```

## XHTML Example

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <title>Sample XHTML Document</title>
  <meta name="description" content="A sample XHTML document"/>
  <meta name="keywords" content="XHTML, XML, HTML"/>
  <link rel="stylesheet" type="text/css" href="styles.css"/>
</head>
<body>
  <div id="header">
    <h1>Welcome to Our Website</h1>
    <p>This is a properly formatted XHTML document.</p>
  </div>
  
  <div id="content">
    <h2>About XML</h2>
    <p>XML is a markup language designed to store and transport data.</p>
    
    <ul>
      <li>Self-describing</li>
      <li>Extensible</li>
      <li>Platform independent</li>
    </ul>
  </div>
  
  <div id="footer">
    <p>&copy; 2024 Example Company. All rights reserved.</p>
  </div>
</body>
</html>
```

## JavaScript Processing Examples

### Parsing XML

```js
// Parse XML from string
const xmlString = `
<?xml version="1.0" encoding="UTF-8"?>
<person>
  <name>John Doe</name>
  <age>30</age>
</person>
`

const parser = new DOMParser()
const xmlDoc = parser.parseFromString(xmlString, "text/xml")

// Extract data
const name = xmlDoc.querySelector("name").textContent
const age = xmlDoc.querySelector("age").textContent

console.log(`Name: ${name}, Age: ${age}`)

// Handle parsing errors
try {
  const invalidXml = '<person><name>John</name><age>30</age>'
  const result = parser.parseFromString(invalidXml, "text/xml")
  
  if (result.getElementsByTagName("parsererror").length > 0) {
    console.error("XML parsing error")
  }
} catch (error) {
  console.error("XML parsing error:", error.message)
}
```

### Creating XML

```js
// Create XML document
const doc = document.implementation.createDocument(null, "root", null)
const root = doc.documentElement

// Add elements
const person = doc.createElement("person")
const name = doc.createElement("name")
name.textContent = "John Doe"
person.appendChild(name)

const age = doc.createElement("age")
age.textContent = "30"
person.appendChild(age)

root.appendChild(person)

// Serialize to string
const serializer = new XMLSerializer()
const xmlString = serializer.serializeToString(doc)
console.log(xmlString)
```

### Working with XML Namespaces

```js
// Parse XML with namespaces
const xmlWithNS = `
<?xml version="1.0" encoding="UTF-8"?>
<root xmlns:user="http://example.com/user">
  <user:person>
    <user:name>John Doe</user:name>
    <user:email>john@example.com</user:email>
  </user:person>
</root>
`

const parser = new DOMParser()
const doc = parser.parseFromString(xmlWithNS, "text/xml")

// Query with namespace
const names = doc.getElementsByTagNameNS("http://example.com/user", "name")
console.log(names[0].textContent) // "John Doe"
```

## Error Handling Examples

### Validation Error Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<errors>
  <error>
    <code>VALIDATION_ERROR</code>
    <message>Invalid XML structure</message>
    <details>
      <field>email</field>
      <issue>Invalid email format</issue>
      <value>invalid-email</value>
    </details>
    <line>15</line>
    <column>23</column>
  </error>
  
  <error>
    <code>REQUIRED_FIELD_MISSING</code>
    <message>Required field is missing</message>
    <details>
      <field>name</field>
      <issue>Name field is required</issue>
    </details>
    <line>8</line>
    <column>12</column>
  </error>
  
  <timestamp>2024-01-15T10:30:00Z</timestamp>
  <requestId>req_123456</requestId>
</errors>
```

### System Error Response

```xml
<?xml version="1.0" encoding="UTF-8"?>
<error>
  <code>INTERNAL_SERVER_ERROR</code>
  <message>An unexpected error occurred</message>
  <details>Database connection failed</details>
  <timestamp>2024-01-15T10:30:00Z</timestamp>
  <requestId>req_123456</requestId>
  <stack>Error: Connection timeout...</stack>
</error>
```

## Advanced Examples

### Complex Nested Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<organization>
  <id>org_001</id>
  <name>TechCorp</name>
  <departments>
    <department id="dept_001">
      <name>Engineering</name>
      <manager>
        <id>emp_001</id>
        <name>Sarah Johnson</name>
        <email>sarah.johnson@techcorp.com</email>
      </manager>
      <employees>
        <employee id="emp_002">
          <name>Mike Chen</name>
          <position>Senior Developer</position>
          <skills>
            <skill>JavaScript</skill>
            <skill>Python</skill>
            <skill>React</skill>
          </skills>
          <projects>
            <project id="proj_001">
              <name>E-commerce Platform</name>
              <status>in-progress</status>
              <progress>75</progress>
            </project>
          </projects>
        </employee>
      </employees>
    </department>
  </departments>
  
  <settings>
    <timezone>UTC-5</timezone>
    <workingHours>
      <start>09:00</start>
      <end>17:00</end>
    </workingHours>
    <holidays>
      <holiday>2024-01-01</holiday>
      <holiday>2024-07-04</holiday>
      <holiday>2024-12-25</holiday>
    </holidays>
  </settings>
</organization>
```

### XML Schema Example

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

These examples demonstrate various XML patterns and use cases commonly encountered in web development, data exchange, and document management. 
# XML — Code Examples

## Simple Document

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bookstore>
  <book category="fiction">
    <title lang="en">The Great Gatsby</title>
    <author>F. Scott Fitzgerald</author>
    <year>1925</year>
    <price currency="USD">10.99</price>
  </book>
  <book category="non-fiction">
    <title lang="en">Sapiens</title>
    <author>Yuval Noah Harari</author>
    <year>2011</year>
    <price currency="USD">15.99</price>
  </book>
</bookstore>
```

## With Namespaces

```xml
<?xml version="1.0" encoding="UTF-8"?>
<catalog xmlns="http://example.com/catalog"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://example.com/catalog catalog.xsd">
  <product id="P001">
    <name>Widget</name>
    <price currency="USD">19.99</price>
    <inventory>
      <quantity>42</quantity>
      <warehouse location="US-EAST"/>
    </inventory>
  </product>
</catalog>
```

## Configuration File

```xml
<?xml version="1.0" encoding="UTF-8"?>
<application>
  <database>
    <host>localhost</host>
    <port>5432</port>
    <name>myapp</name>
    <credentials>
      <username>admin</username>
      <password encrypted="true">base64encryptedstring</password>
    </credentials>
    <pool>
      <min>5</min>
      <max>20</max>
      <timeout unit="seconds">30</timeout>
    </pool>
  </database>

  <server>
    <port>8080</port>
    <host>0.0.0.0</host>
    <cors>
      <enabled>true</enabled>
      <origins>
        <origin>http://localhost:3000</origin>
        <origin>https://myapp.com</origin>
      </origins>
    </cors>
  </server>

  <logging>
    <level>INFO</level>
    <file>logs/app.log</file>
    <rotation>
      <maxSize>10MB</maxSize>
      <maxFiles>5</maxFiles>
    </rotation>
  </logging>
</application>
```

## RSS Feed

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <link>https://example.com</link>
    <description>Tech and programming articles</description>

    <item>
      <title>Getting Started with XML</title>
      <link>https://example.com/xml-guide</link>
      <pubDate>Mon, 15 Jan 2024 10:00:00 GMT</pubDate>
      <description>A beginner-friendly guide to XML.</description>
    </item>

    <item>
      <title>Why JSON Won</title>
      <link>https://example.com/json-vs-xml</link>
      <pubDate>Wed, 17 Jan 2024 14:00:00 GMT</pubDate>
      <description>Comparing JSON and XML for modern APIs.</description>
    </item>
  </channel>
</rss>
```

## XSD Schema

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="bookstore">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="book" maxOccurs="unbounded">
          <xs:complexType>
            <xs:sequence>
              <xs:element name="title" type="xs:string"/>
              <xs:element name="author" type="xs:string"/>
              <xs:element name="year" type="xs:integer"/>
              <xs:element name="price" type="xs:decimal"/>
            </xs:sequence>
            <xs:attribute name="category" type="xs:string" use="required"/>
          </xs:complexType>
        </xs:element>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>
```

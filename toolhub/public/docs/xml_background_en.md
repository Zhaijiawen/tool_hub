# XML — What's Going On Under the Hood

XML was standardized by the W3C in 1998 as a simplified subset of SGML. The pitch: structured, self-describing data that both humans and machines can read. For about a decade, XML was the universal data interchange format — SOAP, RSS, XHTML, SVG, Office documents all used it.

## The Structure

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

Elements form a tree. Attributes hang off elements. Everything must be properly nested and closed. XML is strict about well-formedness — one unclosed tag and the parser rejects the whole document. This strictness is a feature: you know exactly where you stand.

## XML vs JSON

JSON largely replaced XML for API data because it's lighter and maps directly to JavaScript objects. But XML still dominates where you need:

- **Schema validation** (XSD) — enforce exact structure and data types
- **Namespaces** — mix vocabularies without collision
- **XPath/XSLT** — query and transform documents
- **Mixed content** — text interspersed with markup (think HTML in XML form)
- **Document formats** — DOCX, ODS, SVG are all XML under the hood

## The XML Toolchain

- **DTD / XSD** — define and validate document structure
- **XPath** — query language for selecting nodes: `//book[@category='fiction']/title`
- **XSLT** — transform XML to HTML, PDF, or another XML format
- **XQuery** — full query language (like SQL for XML)
- **DOM / SAX** — parsing APIs; DOM loads the full tree, SAX streams events

## Common Pain Points

**Verbosity.** XML is wordy. Every open tag needs a close tag, and the tag name is repeated. That's 2x the bytes of equivalent JSON for data-heavy payloads.

**Attributes vs elements.** A perennial debate: should metadata be attributes (`<book category="fiction">`) or child elements (`<category>fiction</category>`)? Attributes can't contain structured data, can't repeat, and order doesn't matter. Elements are more flexible.

**Parsing overhead.** DOM parsing builds the entire tree in memory. For large files (multi-gigabyte XML dumps), you need SAX/StAX streaming parsers.

## Where XML Still Rules

- **Office documents** — DOCX, XLSX, PPTX are ZIP files containing XML
- **SVG** — vector graphics
- **RSS/Atom** — web feeds
- **Android layouts** — view hierarchies
- **SOAP** — enterprise web services (still alive in banking, insurance, government)
- **Maven POM** — Java build configuration

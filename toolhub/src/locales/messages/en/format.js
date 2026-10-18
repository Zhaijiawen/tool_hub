// 格式化工具
export default {
  format: {
    formatTools: "Format Tools",
    dataFormat: "Data Format",
    programmingLanguage: "Programming Language",
    programmingLanguageFormat: "Programming Language Format",
    otherLanguage: "Other Languages",
    json: {
      title: "JSON Formatter",
      placeholder: "Enter JSON data",
      format: "Format",
      compress: "Compress",
      escape: "Escape",
      unescape: "Unescape",
      empty: "Please enter JSON data to format",
      success: "JSON formatted successfully",
      error: "JSON formatting failed",
      compressSuccess: "JSON compressed successfully",
      compressError: "JSON compression failed, please check data format",
      escapeSuccess: "JSON escaped successfully",
      escapeError: "JSON escape failed",
      unescapeSuccess: "JSON unescaped successfully",
      unescapeError: "JSON unescape failed",
      download: "Download JSON",
      downloadSuccess: "JSON file downloaded successfully",
      description: "Format, compress and validate JSON data",
      json5Title: "JSON5 Formatter",
      json5Placeholder: "Enter JSON5 data (supports comments, unquoted keys, trailing commas)",
      json5InfoTitle: "About JSON5",
      json5Tip1: "Keys may lose their double quotes after formatting (valid in JSON5)",
      json5Tip2: "Short objects may stay on a single line — this does not affect correctness",
      json5Tip3: "Comments are preserved — the main reason to use JSON5 over standard JSON",
      info: {
        title: "Feature Description",
        formatDesc: "Format JSON data with proper indentation for readability",
        compressDesc: "Remove all whitespace to make JSON more compact",
        escapeDesc: "Escape double quotes to \\\" and backslashes to \\\\",
        unescapeDesc: "Convert \\\" back to double quotes and \\\\ back to backslashes"
      }
    },
    xml: {
      title: "XML Formatter",
      placeholder: "Enter XML data",
      format: "Format",
      compress: "Compress",
      empty: "Please enter XML data to format",
      success: "XML formatted successfully",
      error: "XML formatting failed",
      compressSuccess: "XML compressed successfully",
      compressError: "XML compression failed",
      description: "Format XML documents",
      download: "Download XML",
      downloadSuccess: "XML file downloaded successfully",
      info: {
        title: "Feature Description",
        formatDesc: "Format XML document with proper indentation for readability",
        compressDesc: "Remove whitespace between tags to make XML more compact"
      }
    },
    yaml: {
      title: "YAML Formatter",
      placeholder: "Enter YAML data",
      format: "Format",
      empty: "Please enter YAML data to format",
      success: "YAML formatted successfully",
      error: "YAML formatting failed",
      description: "Format YAML documents",
      download: "Download YAML",
      downloadSuccess: "YAML file downloaded successfully"
    },
    js: {
      title: "JavaScript Formatter",
      placeholder: "Enter JavaScript code",
      format: "Format",
      empty: "Please enter JavaScript code to format",
      success: "JavaScript formatted successfully",
      error: "JavaScript formatting failed",
      description: "Format JavaScript code",
      download: "Download JS",
      downloadSuccess: "JavaScript file downloaded successfully",
      info: {
        title: "Feature Description",
        description: "Use js-beautify to format JavaScript code, automatically adjusting indentation, spacing, and line breaks to make code more readable and standardized. Supports ES6+ syntax and various JavaScript dialects."
      }
    },
    html: {
      title: "HTML Formatter",
      placeholder: "Enter HTML code",
      format: "Format",
      empty: "Please enter HTML code to format",
      success: "HTML formatted successfully",
      error: "HTML formatting failed",
      description: "Format HTML documents",
      download: "Download HTML",
      downloadSuccess: "HTML file downloaded successfully"
    },
    css: {
      title: "CSS Formatter",
      placeholder: "Enter CSS code",
      format: "Format",
      empty: "Please enter CSS code to format",
      success: "CSS formatted successfully",
      error: "CSS formatting failed",
      description: "Format CSS styles",
      download: "Download CSS",
      downloadSuccess: "CSS file downloaded successfully"
    },
    sql: {
      title: "SQL Formatter",
      placeholder: "Enter SQL query",
      format: "Format",
      empty: "Please enter SQL query to format",
      success: "SQL formatted successfully",
      error: "SQL formatting failed",
      description: "Format SQL queries",
      download: "Download SQL",
      downloadSuccess: "SQL file downloaded successfully"
    },
    markdown: {
      title: "Markdown Formatter",
      placeholder: "Enter Markdown text",
      format: "Format",
      empty: "Please enter Markdown text to format",
      success: "Markdown formatted successfully",
      error: "Markdown formatting failed",
      description: "Format Markdown documents",
      download: "Download MD",
      downloadSuccess: "Markdown file downloaded successfully"
    },
    vue: {
      title: "Vue Formatter",
      placeholder: "Enter Vue component code",
      format: "Format",
      empty: "Please enter Vue component code to format",
      success: "Vue code formatted successfully",
      error: "Vue code formatting failed",
      description: "Format .vue single file component code",
      download: "Download Vue",
      downloadSuccess: "Vue file downloaded successfully"
    }
  }
}

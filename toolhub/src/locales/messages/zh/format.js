// 格式化工具
export default {
  format: {
    formatTools: "格式化工具",
    dataFormat: "数据格式",
    programmingLanguage: "编程语言",
    programmingLanguageFormat: "编程语言格式化",
    otherLanguage: "其他语言",
    json: {
      title: "JSON 格式化",
      placeholder: "请输入JSON数据",
      format: "格式化",
      compress: "压缩",
      escape: "转义",
      unescape: "反转义",
      empty: "请输入要格式化的JSON数据",
      success: "JSON格式化成功",
      error: "JSON格式化失败",
      compressSuccess: "JSON压缩成功",
      compressError: "JSON压缩失败，请检查数据格式",
      escapeSuccess: "JSON转义成功",
      escapeError: "JSON转义失败",
      unescapeSuccess: "JSON反转义成功",
      unescapeError: "JSON反转义失败",
      download: "下载JSON",
      downloadSuccess: "JSON文件下载成功",
      description: "格式化、压缩和验证 JSON 数据",
      json5Title: "JSON5 格式化",
      json5Placeholder: "请输入JSON5数据（支持注释、无引号键、尾逗号）",
      json5InfoTitle: "关于 JSON5 格式",
      json5Tip1: "格式化后键的双引号可能被去除（JSON5 允许无引号键）",
      json5Tip2: "短对象可能保持单行不换行，不影响数据正确性",
      json5Tip3: "注释完整保留，JSON5 相比标准 JSON 的主要优势就在于此",
      info: {
        title: "功能说明",
        formatDesc: "将JSON数据格式化为易读的缩进格式",
        compressDesc: "移除所有空白字符，使JSON更紧凑",
        escapeDesc: "将双引号转义为\\\"，反斜杠转义为\\\\",
        unescapeDesc: "将\\\"转换回双引号，\\\\转换回反斜杠"
      }
    },
    xml: {
      title: "XML 格式化",
      placeholder: "请输入XML数据",
      format: "格式化",
      compress: "压缩",
      empty: "请输入要格式化的XML数据",
      success: "XML格式化成功",
      error: "XML格式化失败",
      compressSuccess: "XML压缩成功",
      compressError: "XML压缩失败",
      description: "格式化 XML 文档",
      download: "下载XML",
      downloadSuccess: "XML文件下载成功",
      info: {
        title: "功能说明",
        formatDesc: "将XML文档格式化为易读的缩进格式",
        compressDesc: "移除标签间的空白字符，使XML更紧凑"
      }
    },
    yaml: {
      title: "YAML 格式化",
      placeholder: "请输入YAML数据",
      format: "格式化",
      empty: "请输入要格式化的YAML数据",
      success: "YAML格式化成功",
      error: "YAML格式化失败",
      description: "格式化 YAML 文档",
      download: "下载YAML",
      downloadSuccess: "YAML文件下载成功"
    },
    js: {
      title: "JavaScript 格式化",
      placeholder: "请输入JavaScript代码",
      format: "格式化",
      empty: "请输入要格式化的JavaScript代码",
      success: "JavaScript格式化成功",
      error: "JavaScript格式化失败",
      description: "格式化 JavaScript 代码",
      download: "下载JS",
      downloadSuccess: "JavaScript文件下载成功",
      info: {
        title: "功能说明",
        description: "使用js-beautify格式化JavaScript代码，自动调整缩进、空格和换行，使代码更易读和规范。支持ES6+语法和各种JavaScript方言。"
      }
    },
    html: {
      title: "HTML 格式化",
      placeholder: "请输入HTML代码",
      format: "格式化",
      empty: "请输入要格式化的HTML代码",
      success: "HTML格式化成功",
      error: "HTML格式化失败",
      description: "格式化 HTML 文档",
      download: "下载HTML",
      downloadSuccess: "HTML文件下载成功"
    },
    css: {
      title: "CSS 格式化",
      placeholder: "请输入CSS代码",
      format: "格式化",
      empty: "请输入要格式化的CSS代码",
      success: "CSS格式化成功",
      error: "CSS格式化失败",
      description: "格式化 CSS 样式",
      download: "下载CSS",
      downloadSuccess: "CSS文件下载成功"
    },
    sql: {
      title: "SQL 格式化",
      placeholder: "请输入SQL查询语句",
      format: "格式化",
      empty: "请输入要格式化的SQL查询语句",
      success: "SQL格式化成功",
      error: "SQL格式化失败",
      description: "格式化 SQL 查询",
      download: "下载SQL",
      downloadSuccess: "SQL文件下载成功"
    },
    markdown: {
      title: "Markdown 格式化",
      placeholder: "请输入Markdown文本",
      format: "格式化",
      empty: "请输入要格式化的Markdown文本",
      success: "Markdown格式化成功",
      error: "Markdown格式化失败",
      description: "格式化 Markdown 文档",
      download: "下载MD",
      downloadSuccess: "Markdown文件下载成功"
    },
    vue: {
      title: "Vue 格式化",
      placeholder: "请输入Vue组件代码",
      format: "格式化",
      empty: "请输入要格式化的Vue组件代码",
      success: "Vue代码格式化成功",
      error: "Vue代码格式化失败",
      description: "格式化 .vue 单文件组件代码",
      download: "下载Vue",
      downloadSuccess: "Vue文件下载成功"
    }
  }
}

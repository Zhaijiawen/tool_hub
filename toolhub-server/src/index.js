const express = require('express');
const cors = require('cors');
const prettier = require('prettier');
const phpPlugin = require('@prettier/plugin-php');
const rubyPlugin = require('@prettier/plugin-ruby');
const javaPlugin = require('prettier-plugin-java');
const kotlinPlugin = require('prettier-plugin-kotlin');
const rustPlugin = require('prettier-plugin-rust');
const shPlugin = require('prettier-plugin-sh');
const sqlPlugin = require('prettier-plugin-sql');
const xmlPlugin = require('@prettier/plugin-xml');
const goPlugin = require('prettier-plugin-go-template');
const vuePlugin = require('@vue/compiler-sfc');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 插件映射
const pluginMap = {
  php: [phpPlugin],
  ruby: [rubyPlugin],
  java: [javaPlugin],
  kotlin: [kotlinPlugin],
  rust: [rustPlugin],
  shell: [shPlugin],
  sql: [sqlPlugin],
  xml: [xmlPlugin],
  go: [goPlugin],
  vue: [vuePlugin]
};

// 格式化配置
const prettierOptions = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none',
  // XML 特定配置
  xmlWhitespaceSensitivity: 'ignore',
  xmlSelfClosingSpace: true,
  xmlSortAttributesByKey: true
};

// 格式化接口
app.post('/api/format', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({ error: 'Missing code or language parameter' });
    }

    const plugins = pluginMap[language.toLowerCase()] || [];
    const formattedCode = await prettier.format(code, {
      ...prettierOptions,
      parser: getParser(language),
      plugins
    });

    res.json({ formattedCode });
  } catch (error) {
    console.error('Formatting error:', error);
    res.status(500).json({ error: 'Formatting failed' });
  }
});

// 获取对应的 parser
function getParser(language) {
  const parserMap = {
    php: 'php',
    ruby: 'ruby',
    java: 'java',
    kotlin: 'kotlin',
    rust: 'rust',
    shell: 'sh',
    sql: 'sql',
    xml: 'xml',
    go: 'go-template',
    vue: 'vue',
    markdown: 'markdown',
    yaml: 'yaml'
  };
  return parserMap[language.toLowerCase()] || 'babel';
}

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 
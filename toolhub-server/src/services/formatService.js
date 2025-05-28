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
  xmlWhitespaceSensitivity: 'ignore',
  xmlSelfClosingSpace: true,
  xmlSortAttributesByKey: true
};

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

/**
 * 格式化代码
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {Promise<string>} 格式化后的代码
 */
async function formatCode(code, language) {
  if (!code || !language) {
    throw new Error('Missing code or language parameter');
  }

  const plugins = pluginMap[language.toLowerCase()] || [];
  return await prettier.format(code, {
    ...prettierOptions,
    parser: getParser(language),
    plugins
  });
}

module.exports = {
  formatCode
}; 
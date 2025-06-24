import prettier from 'prettier';
import { createRequire } from 'module';

// 使用createRequire来导入CommonJS模块
const require = createRequire(import.meta.url);

// 导入插件模块并获取实际插件
const phpPluginModule = require('@prettier/plugin-php');
const phpPlugin = phpPluginModule.default || phpPluginModule;

const rubyPluginModule = require('@prettier/plugin-ruby');
const rubyPlugin = rubyPluginModule.default || rubyPluginModule;

const javaPluginModule = require('prettier-plugin-java');
const javaPlugin = javaPluginModule.default || javaPluginModule;

const shPluginModule = require('prettier-plugin-sh');
const shPlugin = shPluginModule.default || shPluginModule;

const sqlPluginModule = require('prettier-plugin-sql');
const sqlPlugin = sqlPluginModule.default || sqlPluginModule;

const xmlPluginModule = require('@prettier/plugin-xml');
const xmlPlugin = xmlPluginModule.default || xmlPluginModule;

// 插件映射
const pluginMap = {
  php: [phpPlugin],
  ruby: [rubyPlugin],
  java: [javaPlugin],
  shell: [shPlugin],
  sql: [sqlPlugin],
  xml: [xmlPlugin]
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

export { formatCode }; 
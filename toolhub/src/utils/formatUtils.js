import beautify from 'js-beautify';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserEstree from 'prettier/plugins/estree';
import axios from 'axios';

// js-beautify 配置
const beautifyOptions = {
  indent_size: 2,
  space_in_empty_paren: true,
  preserve_newlines: true,
  max_preserve_newlines: 2,
};

// prettier 配置
const prettierOptions = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'none'
};

// 支持 js-beautify 的语言列表
const BEAUTIFY_SUPPORTED_LANGUAGES = ['javascript', 'js', 'html', 'css', 'json'];

// 需要后端支持的插件列表
const BACKEND_REQUIRED_PLUGINS = [
  '@prettier/plugin-php',
  '@prettier/plugin-ruby',
  'prettier-plugin-java',
  'prettier-plugin-kotlin',
  'prettier-plugin-rust',
  '@un-ts/prettier-plugin-sh',
  '@un-ts/prettier-plugin-sql'
];

/**
 * 使用 js-beautify 进行格式化
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {string|null} 格式化后的代码
 */
export const formatWithBeautify = (code, language) => {
  if (!BEAUTIFY_SUPPORTED_LANGUAGES.includes(language.toLowerCase())) {
    return null;
  }

  try {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return beautify.js(code, beautifyOptions);
      case 'html':
        return beautify.html(code, beautifyOptions);
      case 'css':
        return beautify.css(code, beautifyOptions);
      case 'json':
        return beautify.js(code, beautifyOptions);
      default:
        return null;
    }
  } catch (error) {
    console.error('Beautify formatting failed:', error);
    return null;
  }
};

/**
 * 使用 prettier 进行格式化
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {Promise<string|null>} 格式化后的代码
 */
export const formatWithPrettier = async (code, language) => {
  try {
    const parser = getPrettierParser(language);
    const plugins = await getPrettierPlugins(language);
    
    return await prettier.format(code, {
      ...prettierOptions,
      parser,
      plugins
    });
  } catch (error) {
    console.error('Prettier formatting failed:', error);
    return null;
  }
};

/**
 * 获取 prettier parser
 * @param {string} language - 代码语言
 * @returns {string} parser 名称
 */
const getPrettierParser = (language) => {
  const parserMap = {
    javascript: 'babel',
    js: 'babel',
    typescript: 'typescript',
    ts: 'typescript',
    html: 'html',
    css: 'css',
    json: 'json',
    php: 'php',
    ruby: 'ruby',
    xml: 'xml',
    go: 'go-template',
    java: 'java',
    kotlin: 'kotlin',
    rust: 'rust',
    shell: 'sh',
    sql: 'sql',
    csharp: 'csharp',
    vue: 'vue',
    markdown: 'markdown',
    yaml: 'yaml',
    perl: 'perl',
    lua: 'lua',
    dart: 'dart',
    scala: 'scala',
    swift: 'swift',
    python: 'python'
  };
  return parserMap[language.toLowerCase()] || 'babel';
};

/**
 * 获取 prettier 插件
 * @param {string} language - 代码语言
 * @returns {Promise<Array>} 插件列表
 */
const getPrettierPlugins = async (language) => {
  const basePlugins = [parserBabel, parserEstree];
  const pluginMap = {
    php: ['@prettier/plugin-php'],
    ruby: ['@prettier/plugin-ruby'],
    xml: ['@prettier/plugin-xml'],
    go: ['prettier-plugin-go-template'],
    java: ['prettier-plugin-java'],
    kotlin: ['prettier-plugin-kotlin'],
    rust: ['prettier-plugin-rust'],
    shell: ['@un-ts/prettier-plugin-sh'],
    sql: ['@un-ts/prettier-plugin-sql'],
    vue: ['@vue/compiler-sfc'],
    markdown: ['prettier-plugin-markdown'],
    yaml: ['prettier-plugin-yaml'],
    csharp: ['prettier-plugin-csharp']
  };
  
  const languagePlugins = pluginMap[language.toLowerCase()] || [];
  return [...basePlugins, ...languagePlugins];
};

/**
 * 检查是否需要后端支持
 * @param {string} language - 代码语言
 * @returns {boolean} 是否需要后端支持
 */
const needsBackendSupport = (language) => {
  const plugins = getPrettierPlugins(language);
  return plugins.some(plugin => BACKEND_REQUIRED_PLUGINS.includes(plugin));
};

/**
 * 通过后端进行格式化
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {Promise<string>} 格式化后的代码
 */
const formatWithBackend = async (code, language) => {
  try {
    const response = await axios.post('/api/format', {
      code,
      language
    });
    return response.data.formattedCode;
  } catch (error) {
    console.error('Backend formatting failed:', error);
    throw new Error('Backend formatting failed');
  }
};

/**
 * 主格式化函数
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {Promise<string>} 格式化后的代码
 */
export const formatCode = async (code, language) => {
  // 首先尝试使用 js-beautify
  const beautified = formatWithBeautify(code, language);
  if (beautified) {
    return beautified;
  }

  // 检查是否需要后端支持
  if (needsBackendSupport(language)) {
    return await formatWithBackend(code, language);
  }

  // 如果不需要后端支持，尝试使用 prettier
  const prettierFormatted = await formatWithPrettier(code, language);
  if (prettierFormatted) {
    return prettierFormatted;
  }

  // 如果都不支持，返回原始代码
  return code;
}; 
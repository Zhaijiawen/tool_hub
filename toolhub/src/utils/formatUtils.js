import beautify from 'js-beautify';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/plugins/babel';
import parserEstree from 'prettier/plugins/estree';
import { formatCode as formatWithBackend } from '@/api/format';

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
  '@prettier/plugin-xml',
  'prettier-plugin-java',
  'prettier-plugin-sh',
  'prettier-plugin-sql',
  '@un-ts/prettier-plugin-sh',
  '@un-ts/prettier-plugin-sql',
  '@vue/compiler-sfc',
  'yaml'
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

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return beautify.js(code, beautifyOptions);
    case 'html':
      return beautify.html(code, beautifyOptions);
    case 'css':
      return beautify.css(code, beautifyOptions);
    case 'json':
      // 先校验 JSON 合法性，不合法直接抛出异常
      JSON.parse(code);
      return beautify.js(code, beautifyOptions);
    default:
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
  const parser = getPrettierParser(language);
  if (!parser) return null; // 只允许 markdown
  return await prettier.format(code, {
    ...prettierOptions,
    parser
    // plugins: [] // 可省略，markdown 不需要额外插件
  });
};

/**
 * 获取 prettier parser
 * @param {string} language - 代码语言
 * @returns {string} parser 名称
 */
const getPrettierParser = (language) => {
  const parserMap = {
    markdown: 'markdown',
    yaml: 'yaml'
  };
  return parserMap[language.toLowerCase()] || null;
};

/**
 * 获取 prettier 插件
 * @param {string} language - 代码语言
 * @returns {Array} 插件列表
 */
const getPrettierPlugins = (language) => {
  const basePlugins = [parserBabel, parserEstree];
  const pluginMap = {
    php: ['@prettier/plugin-php'],
    ruby: ['@prettier/plugin-ruby'],
    xml: ['@prettier/plugin-xml'],
    java: ['prettier-plugin-java'],
    shell: ['@un-ts/prettier-plugin-sh'],
    sql: ['@un-ts/prettier-plugin-sql'],
    vue: ['@vue/compiler-sfc'],
    yaml: ['yaml']
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
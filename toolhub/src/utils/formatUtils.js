import beautify from 'js-beautify';

// js-beautify 配置
const beautifyOptions = {
  indent_size: 2,
  space_in_empty_paren: true,
  preserve_newlines: true,
  max_preserve_newlines: 2,
};

// 支持 js-beautify 的语言（轻量、同步，优先使用）
// XML 用 beautify.html 处理，因为 HTML 和 XML 结构类似
const BEAUTIFY_LANGUAGES = ['javascript', 'js', 'html', 'css', 'json', 'xml'];

// 支持 Prettier 内置插件的语言（动态 import，懒加载）
const PRETTIER_LANGUAGES = {
  vue:      { parser: 'vue',       plugins: ['babel', 'estree', 'html'] },
  markdown: { parser: 'markdown',  plugins: ['babel', 'estree', 'markdown'] },
  yaml:     { parser: 'yaml',      plugins: ['yaml'] },
  json5:    { parser: 'json5',     plugins: ['babel', 'estree'] },
};

// 需要专用第三方格式化库的语言（动态 import，浏览器兼容）
const EXTERNAL_FORMATTERS = ['sql'];

// --- 懒加载缓存 ---
let prettierCache = null;
let sqlFormatterCache = null;

async function loadPrettier() {
  if (prettierCache) return prettierCache;

  const [
    { format },
    babelMod,
    estreeMod,
    htmlMod,
    markdownMod,
    yamlMod,
  ] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
    import('prettier/plugins/html'),
    import('prettier/plugins/markdown'),
    import('prettier/plugins/yaml'),
  ]);

  prettierCache = {
    format,
    plugins: {
      babel: babelMod.default,
      estree: estreeMod.default,
      html: htmlMod.default,
      markdown: markdownMod.default,
      yaml: yamlMod.default,
    },
  };

  return prettierCache;
}

async function loadSqlFormatter() {
  if (sqlFormatterCache) return sqlFormatterCache;
  const mod = await import('sql-formatter');
  sqlFormatterCache = mod;
  return sqlFormatterCache;
}

/**
 * 使用 Prettier 内置插件格式化
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {Promise<string|null>} 格式化后的代码
 */
async function formatWithPrettier(code, language) {
  const config = PRETTIER_LANGUAGES[language.toLowerCase()];
  if (!config) return null;

  const { format, plugins } = await loadPrettier();

  return format(code, {
    parser: config.parser,
    plugins: config.plugins.map(name => plugins[name]),
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'none',
  });
}

/**
 * 使用 sql-formatter 格式化 SQL
 * @param {string} code - SQL 代码
 * @returns {Promise<string>} 格式化后的 SQL
 */
async function formatWithSqlFormatter(code) {
  const { format } = await loadSqlFormatter();
  return format(code, {
    language: 'sql',
    tabWidth: 2,
    keywordCase: 'upper',
    linesBetweenQueries: 2,
  });
}

/**
 * 使用 js-beautify 进行格式化
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {string|null} 格式化后的代码
 */
export const formatWithBeautify = (code, language) => {
  if (!BEAUTIFY_LANGUAGES.includes(language.toLowerCase())) {
    return null;
  }

  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return beautify.js(code, beautifyOptions);
    case 'html':
      return beautify.html(code, beautifyOptions);
    case 'xml':
      return beautify.html(code, beautifyOptions);
    case 'css':
      return beautify.css(code, beautifyOptions);
    case 'json':
      return beautify.js(code, beautifyOptions);
    default:
      return null;
  }
};

/**
 * 主格式化函数（纯前端，无后端依赖）
 * @param {string} code - 要格式化的代码
 * @param {string} language - 代码语言
 * @returns {Promise<string>} 格式化后的代码
 */
export const formatCode = async (code, language) => {
  // 优先使用 js-beautify（快速、同步）
  const beautified = formatWithBeautify(code, language);
  if (beautified) {
    return beautified;
  }

  // 尝试 Prettier 内置插件（懒加载）
  const lang = language.toLowerCase();
  if (PRETTIER_LANGUAGES[lang]) {
    try {
      return await formatWithPrettier(code, lang);
    } catch (err) {
      throw new Error(`Format error: ${err.message}`);
    }
  }

  // 尝试专用第三方格式化库（懒加载）
  if (EXTERNAL_FORMATTERS.includes(lang)) {
    try {
      if (lang === 'sql') {
        return await formatWithSqlFormatter(code);
      }
    } catch (err) {
      throw new Error(`Format error: ${err.message}`);
    }
  }

  // 不支持的语言，返回原始代码
  return code;
};

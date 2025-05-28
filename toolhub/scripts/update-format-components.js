import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 组件目录路径
const COMPONENTS_DIR = path.join(__dirname, '../src/components/format');

// 需要替换的导入语句
const OLD_IMPORTS = [
  "import prettier from 'prettier/standalone'",
  "import parserBabel from 'prettier/plugins/babel'",
  "import parserEstree from 'prettier/plugins/estree'",
  "import beautify from 'js-beautify'",
  "import phpPlugin from '@prettier/plugin-php'",
  "import rubyPlugin from '@prettier/plugin-ruby'",
  "import javaPlugin from 'prettier-plugin-java'",
  "import kotlinPlugin from 'prettier-plugin-kotlin'",
  "import rustPlugin from 'prettier-plugin-rust'",
  "import shPlugin from 'prettier-plugin-sh'",
  "import sqlPlugin from 'prettier-plugin-sql'"
];

// 新的导入语句
const NEW_IMPORT = "import { formatCode } from '@/utils/formatUtils'";

// 格式化函数模板
const formatFunctionTemplate = (language) => `
const format${language.charAt(0).toUpperCase() + language.slice(1)} = async () => {
  if (!input.value.trim()) {
    message.warning(t('format.${language}.empty'))
    return
  }
  
  loading.value = true
  try {
    input.value = await formatCode(input.value, '${language}')
    error.value = ''
    message.success(t('format.${language}.success'))
  } catch (e) {
    error.value = e.message
    message.error(t('format.${language}.error'))
  } finally {
    loading.value = false
  }
}`;

// 处理单个文件
function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  // 读取文件内容
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 获取语言名称
  const language = path.basename(filePath, '.vue').replace('Format', '').toLowerCase();
  
  // 移除旧的导入语句
  OLD_IMPORTS.forEach(importStmt => {
    content = content.replace(importStmt + '\n', '');
  });
  
  // 添加新的导入语句
  if (!content.includes(NEW_IMPORT)) {
    content = content.replace(
      "import CodeEditor from '@/components/common/CodeEditor.vue'",
      "import CodeEditor from '@/components/common/CodeEditor.vue'\n// 导入格式化工具\n" + NEW_IMPORT
    );
  }
  
  // 替换格式化函数
  const formatFunctionName = `format${language.charAt(0).toUpperCase() + language.slice(1)}`;
  const formatFunctionRegex = new RegExp(`const ${formatFunctionName} = async \\(\\) => {[\\s\\S]*?}`);
  const oldFormatFunction = content.match(formatFunctionRegex);
  
  if (oldFormatFunction) {
    const newFormatFunction = formatFunctionTemplate(language);
    content = content.replace(oldFormatFunction[0], newFormatFunction);
  } else {
    console.warn(`Could not find format function for ${language} in ${filePath}`);
  }
  
  // 写入文件
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
}

// 主函数
function main() {
  // 读取组件目录
  const files = fs.readdirSync(COMPONENTS_DIR);
  
  // 处理每个 .vue 文件
  files.forEach(file => {
    if (file.endsWith('.vue')) {
      const filePath = path.join(COMPONENTS_DIR, file);
      processFile(filePath);
    }
  });
  
  console.log('All format components have been updated!');
}

// 运行脚本
main(); 
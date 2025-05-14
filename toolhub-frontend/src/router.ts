import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue'),
  },
  // 格式化工具
  {
    path: '/json-formatter',
    name: 'JsonFormatter',
    component: () => import('./pages/JsonFormatter.vue'),
  },
  {
    path: '/xml-formatter',
    name: 'XmlFormatter',
    component: () => import('./pages/XmlFormatter.vue'),
  },
  {
    path: '/java-formatter',
    name: 'JavaFormatter',
    component: () => import('./pages/JavaFormatter.vue'),
  },
  {
    path: '/js-formatter',
    name: 'JsFormatter',
    component: () => import('./pages/JsFormatter.vue'),
  },
  {
    path: '/html-formatter',
    name: 'HtmlFormatter',
    component: () => import('./pages/HtmlFormatter.vue'),
  },
  {
    path: '/css-formatter',
    name: 'CssFormatter',
    component: () => import('./pages/CssFormatter.vue'),
  },
  {
    path: '/python-formatter',
    name: 'PythonFormatter',
    component: () => import('./pages/PythonFormatter.vue'),
  },
  {
    path: '/csharp-formatter',
    name: 'CSharpFormatter',
    component: () => import('./pages/CSharpFormatter.vue'),
  },
  {
    path: '/go-formatter',
    name: 'GoFormatter',
    component: () => import('./pages/GoFormatter.vue'),
  },
  {
    path: '/php-formatter',
    name: 'PHPFormatter',
    component: () => import('./pages/PHPFormatter.vue'),
  },
  {
    path: '/ruby-formatter',
    name: 'RubyFormatter',
    component: () => import('./pages/RubyFormatter.vue'),
  },
  {
    path: '/kotlin-formatter',
    name: 'KotlinFormatter',
    component: () => import('./pages/KotlinFormatter.vue'),
  },
  {
    path: '/rust-formatter',
    name: 'RustFormatter',
    component: () => import('./pages/RustFormatter.vue'),
  },
  {
    path: '/shell-formatter',
    name: 'ShellFormatter',
    component: () => import('./pages/ShellFormatter.vue'),
  },
  {
    path: '/sql-formatter',
    name: 'SqlFormatter',
    component: () => import('./pages/SqlFormatter.vue'),
  },
  {
    path: '/markdown-formatter',
    name: 'MarkdownFormatter',
    component: () => import('./pages/MarkdownFormatter.vue'),
  },
  {
    path: '/dart-formatter',
    name: 'DartFormatter',
    component: () => import('./pages/DartFormatter.vue'),
  },
  // 加密工具
  {
    path: '/rsa-encrypt',
    name: 'RsaEncrypt',
    component: () => import('./pages/RsaEncrypt.vue'),
  },
  {
    path: '/rsa-sign',
    name: 'RsaSign',
    component: () => import('./pages/RsaSign.vue'),
  },
  {
    path: '/des-encrypt',
    name: 'DesEncrypt',
    component: () => import('./pages/DesEncrypt.vue'),
  },
  {
    path: '/bcrypt-hash',
    name: 'BcryptHash',
    component: () => import('./pages/BcryptHash.vue'),
  },
  {
    path: '/jwt-codec',
    name: 'JwtCodec',
    component: () => import('./pages/JwtCodec.vue'),
  },
  // 转换工具
  {
    path: '/radix-converter',
    name: 'RadixConverter',
    component: () => import('./pages/RadixConverter.vue'),
  },
  {
    path: '/unit-converter',
    name: 'UnitConverter',
    component: () => import('./pages/UnitConverter.vue'),
  },
  {
    path: '/url-codec',
    name: 'UrlCodec',
    component: () => import('./pages/UrlCodec.vue'),
  },
  {
    path: '/base64-codec',
    name: 'Base64Codec',
    component: () => import('./pages/Base64Codec.vue'),
  },
  // 文本工具
  {
    path: '/regex-generator',
    name: 'RegexGenerator',
    component: () => import('./pages/RegexGenerator.vue'),
  },
  {
    path: '/markdown-to-html',
    name: 'MarkdownToHtml',
    component: () => import('./pages/MarkdownToHtml.vue'),
  },
  // 其他工具
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import('./pages/Calculator.vue'),
  },
  {
    path: '/http-status-code',
    name: 'HttpStatusCode',
    component: () => import('./pages/HttpStatusCode.vue'),
  },
  {
    path: '/short-url',
    name: 'ShortUrlTool',
    component: () => import('./pages/ShortUrlTool.vue'),
  },
  {
    path: '/tool-arrange',
    name: 'ToolArrange',
    component: () => import('./pages/ToolArrange.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 
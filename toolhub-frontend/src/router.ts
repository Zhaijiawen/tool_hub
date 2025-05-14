import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./pages/Home.vue'),
  },
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
  // 其他工具页面路由后续补充
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router; 
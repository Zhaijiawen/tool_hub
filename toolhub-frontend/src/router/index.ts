import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import JsonFormatter from '../pages/JsonFormatter.vue';
import XmlFormatter from '../pages/XmlFormatter.vue';
import JsFormatter from '../pages/JsFormatter.vue';
import HtmlFormatter from '../pages/HtmlFormatter.vue';
import CssFormatter from '../pages/CssFormatter.vue';
import PythonFormatter from '../pages/PythonFormatter.vue';
import JavaFormatter from '../pages/JavaFormatter.vue';
import CSharpFormatter from '../pages/CSharpFormatter.vue';
import GoFormatter from '../pages/GoFormatter.vue';
import PhpFormatter from '../pages/PhpFormatter.vue';
import RubyFormatter from '../pages/RubyFormatter.vue';
import KotlinFormatter from '../pages/KotlinFormatter.vue';
import RustFormatter from '../pages/RustFormatter.vue';
import ShellFormatter from '../pages/ShellFormatter.vue';
import SqlFormatter from '../pages/SqlFormatter.vue';
import MarkdownFormatter from '../pages/MarkdownFormatter.vue';
import DartFormatter from '../pages/DartFormatter.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/json-formatter',
      name: 'json-formatter',
      component: JsonFormatter
    },
    {
      path: '/xml-formatter',
      name: 'xml-formatter',
      component: XmlFormatter
    },
    {
      path: '/js-formatter',
      name: 'js-formatter',
      component: JsFormatter
    },
    {
      path: '/html-formatter',
      name: 'html-formatter',
      component: HtmlFormatter
    },
    {
      path: '/css-formatter',
      name: 'css-formatter',
      component: CssFormatter
    },
    {
      path: '/python-formatter',
      name: 'python-formatter',
      component: PythonFormatter
    },
    {
      path: '/java-formatter',
      name: 'java-formatter',
      component: JavaFormatter
    },
    {
      path: '/csharp-formatter',
      name: 'csharp-formatter',
      component: CSharpFormatter
    },
    {
      path: '/go-formatter',
      name: 'go-formatter',
      component: GoFormatter
    },
    {
      path: '/php-formatter',
      name: 'php-formatter',
      component: PhpFormatter
    },
    {
      path: '/ruby-formatter',
      name: 'ruby-formatter',
      component: RubyFormatter
    },
    {
      path: '/kotlin-formatter',
      name: 'kotlin-formatter',
      component: KotlinFormatter
    },
    {
      path: '/rust-formatter',
      name: 'rust-formatter',
      component: RustFormatter
    },
    {
      path: '/shell-formatter',
      name: 'shell-formatter',
      component: ShellFormatter
    },
    {
      path: '/sql-formatter',
      name: 'sql-formatter',
      component: SqlFormatter
    },
    {
      path: '/markdown-formatter',
      name: 'markdown-formatter',
      component: MarkdownFormatter
    },
    {
      path: '/dart-formatter',
      name: 'dart-formatter',
      component: DartFormatter
    }
  ]
});

export default router; 
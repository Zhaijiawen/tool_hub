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
import TextCaseConverter from '../pages/TextCaseConverter.vue';
import TextReverser from '../pages/TextReverser.vue';
import TextSpaceHandler from '../pages/TextSpaceHandler.vue';
import TextReplacer from '../pages/TextReplacer.vue';
import UnitConverter from '../pages/UnitConverter.vue';
import NumberBaseConverter from '../pages/NumberBaseConverter.vue';
import TimeConverter from '../pages/TimeConverter.vue';
import AesEncryptor from '../pages/AesEncryptor.vue';
import ChaCha20Encryptor from '../pages/ChaCha20Encryptor.vue';
import DesEncryptor from '../pages/DesEncryptor.vue';
import RsaEncryptor from '../pages/RsaEncryptor.vue';
import EccEncryptor from '../pages/EccEncryptor.vue';
import Ed25519Encryptor from '../pages/Ed25519Encryptor.vue';
import HashGenerator from '../pages/HashGenerator.vue';
import JwtCodec from '../pages/JwtCodec.vue';
import Base64Codec from '../pages/Base64Codec.vue';
import UrlCodec from '../pages/UrlCodec.vue';
import CharConverter from '../pages/CharConverter.vue';
import NumberConverter from '../pages/NumberConverter.vue';
import ImageTools from '../pages/ImageTools.vue';
import RegexTools from '../pages/RegexTools.vue';
import MarkdownToHtml from '../pages/MarkdownToHtml.vue';
import QrCodeTools from '../pages/QrCodeTools.vue';
import Base64Tools from '../pages/Base64Tools.vue';
import JsonTools from '../pages/JsonTools.vue';
import HashTools from '../pages/HashTools.vue';
import ShortUrlTools from '../pages/ShortUrlTools.vue';
import ColorPickerTools from '../pages/ColorPickerTools.vue';
import ImageCompressor from '../pages/ImageCompressor.vue';
import ImageConverter from '../pages/ImageConverter.vue';
import ImageCropper from '../pages/ImageCropper.vue';
import ImageRotator from '../pages/ImageRotator.vue';
import ImageWatermarker from '../pages/ImageWatermarker.vue';
import ImageWatermarkRemover from '../pages/ImageWatermarkRemover.vue';
import Calculator from '../pages/Calculator.vue';
import HttpStatusExplainer from '../pages/HttpStatusExplainer.vue';
import IpAddressLookup from '../pages/IpAddressLookup.vue';
import UserAgentParser from '../pages/UserAgentParser.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/format/json',
      name: 'json-formatter',
      component: JsonFormatter
    },
    {
      path: '/format/xml',
      name: 'xml-formatter',
      component: XmlFormatter
    },
    {
      path: '/format/js',
      name: 'js-formatter',
      component: JsFormatter
    },
    {
      path: '/format/html',
      name: 'html-formatter',
      component: HtmlFormatter
    },
    {
      path: '/format/css',
      name: 'css-formatter',
      component: CssFormatter
    },
    {
      path: '/format/python',
      name: 'python-formatter',
      component: PythonFormatter
    },
    {
      path: '/format/java',
      name: 'java-formatter',
      component: JavaFormatter
    },
    {
      path: '/format/csharp',
      name: 'csharp-formatter',
      component: CSharpFormatter
    },
    {
      path: '/format/go',
      name: 'go-formatter',
      component: GoFormatter
    },
    {
      path: '/format/php',
      name: 'php-formatter',
      component: PhpFormatter
    },
    {
      path: '/format/ruby',
      name: 'ruby-formatter',
      component: RubyFormatter
    },
    {
      path: '/format/kotlin',
      name: 'kotlin-formatter',
      component: KotlinFormatter
    },
    {
      path: '/format/rust',
      name: 'rust-formatter',
      component: RustFormatter
    },
    {
      path: '/format/shell',
      name: 'shell-formatter',
      component: ShellFormatter
    },
    {
      path: '/format/sql',
      name: 'sql-formatter',
      component: SqlFormatter
    },
    {
      path: '/format/markdown',
      name: 'markdown-formatter',
      component: MarkdownFormatter
    },
    {
      path: '/format/dart',
      name: 'dart-formatter',
      component: DartFormatter
    },
    {
      path: '/text/case-converter',
      name: 'text-case-converter',
      component: TextCaseConverter
    },
    {
      path: '/text/reverser',
      name: 'text-reverser',
      component: TextReverser
    },
    {
      path: '/text/space-handler',
      name: 'text-space-handler',
      component: TextSpaceHandler
    },
    {
      path: '/text/replacer',
      name: 'text-replacer',
      component: TextReplacer
    },
    {
      path: '/convert/unit',
      name: 'unit-converter',
      component: UnitConverter
    },
    {
      path: '/convert/number-base',
      name: 'number-base-converter',
      component: NumberBaseConverter
    },
    {
      path: '/convert/time',
      name: 'time-converter',
      component: TimeConverter
    },
    {
      path: '/crypto',
      name: 'crypto',
      component: () => import('../pages/Crypto.vue'),
      children: [
        {
          path: 'aes',
          name: 'aes-encryptor',
          component: AesEncryptor
        },
        {
          path: 'chacha20',
          name: 'chacha20-encryptor',
          component: ChaCha20Encryptor
        },
        {
          path: 'des',
          name: 'des-encryptor',
          component: DesEncryptor
        },
        {
          path: 'rsa',
          name: 'rsa-encryptor',
          component: RsaEncryptor
        },
        {
          path: 'ecc',
          name: 'ecc-encryptor',
          component: EccEncryptor
        },
        {
          path: 'ed25519',
          name: 'ed25519-encryptor',
          component: Ed25519Encryptor
        },
        {
          path: 'hash',
          name: 'hash-generator',
          component: HashGenerator
        },
        {
          path: 'jwt',
          name: 'jwt-codec',
          component: JwtCodec
        },
        {
          path: 'base64',
          name: 'base64-codec',
          component: Base64Codec
        },
        {
          path: 'url',
          name: 'url-codec',
          component: UrlCodec
        },
        {
          path: 'char',
          name: 'char-converter',
          component: CharConverter
        },
        {
          path: 'number',
          name: 'number-converter',
          component: NumberConverter
        }
      ]
    },
    {
      path: '/image',
      name: 'image-tools',
      component: ImageTools
    },
    {
      path: '/regex',
      name: 'regex-tools',
      component: RegexTools
    },
    {
      path: '/markdown-to-html',
      name: 'markdown-to-html',
      component: MarkdownToHtml
    },
    {
      path: '/qr-code',
      name: 'qr-code-tools',
      component: QrCodeTools
    },
    {
      path: '/base64',
      name: 'base64-tools',
      component: Base64Tools
    },
    {
      path: '/json',
      name: 'json-tools',
      component: JsonTools
    },
    {
      path: '/hash',
      name: 'hash-tools',
      component: HashTools
    },
    {
      path: '/short-url',
      name: 'short-url-tools',
      component: ShortUrlTools
    },
    {
      path: '/color-picker',
      name: 'color-picker-tools',
      component: ColorPickerTools
    },
    {
      path: '/image-compressor',
      name: 'image-compressor',
      component: ImageCompressor
    },
    {
      path: '/image-converter',
      name: 'image-converter',
      component: ImageConverter
    },
    {
      path: '/image-cropper',
      name: 'image-cropper',
      component: ImageCropper
    },
    {
      path: '/image-rotator',
      name: 'image-rotator',
      component: ImageRotator
    },
    {
      path: '/image-watermarker',
      name: 'image-watermarker',
      component: ImageWatermarker
    },
    {
      path: '/image-watermark-remover',
      name: 'image-watermark-remover',
      component: ImageWatermarkRemover
    },
    {
      path: '/calculator',
      name: 'calculator',
      component: Calculator
    },
    {
      path: '/http-status-explainer',
      name: 'http-status-explainer',
      component: HttpStatusExplainer
    },
    {
      path: '/ip-address-lookup',
      component: IpAddressLookup
    },
    {
      path: '/user-agent-parser',
      component: UserAgentParser
    }
  ]
});

export default router; 
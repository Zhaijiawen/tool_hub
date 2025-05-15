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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // 格式化工具
    {
      path: '/format',
      name: 'format',
      component: () => import('../pages/Format.vue'),
      children: [
        {
          path: 'json',
          name: 'json-formatter',
          component: JsonFormatter
        },
        {
          path: 'xml',
          name: 'xml-formatter',
          component: XmlFormatter
        },
        {
          path: 'js',
          name: 'js-formatter',
          component: JsFormatter
        },
        {
          path: 'html',
          name: 'html-formatter',
          component: HtmlFormatter
        },
        {
          path: 'css',
          name: 'css-formatter',
          component: CssFormatter
        },
        {
          path: 'python',
          name: 'python-formatter',
          component: PythonFormatter
        },
        {
          path: 'java',
          name: 'java-formatter',
          component: JavaFormatter
        },
        {
          path: 'csharp',
          name: 'csharp-formatter',
          component: CSharpFormatter
        },
        {
          path: 'go',
          name: 'go-formatter',
          component: GoFormatter
        },
        {
          path: 'php',
          name: 'php-formatter',
          component: PhpFormatter
        },
        {
          path: 'ruby',
          name: 'ruby-formatter',
          component: RubyFormatter
        },
        {
          path: 'kotlin',
          name: 'kotlin-formatter',
          component: KotlinFormatter
        },
        {
          path: 'rust',
          name: 'rust-formatter',
          component: RustFormatter
        },
        {
          path: 'shell',
          name: 'shell-formatter',
          component: ShellFormatter
        },
        {
          path: 'sql',
          name: 'sql-formatter',
          component: SqlFormatter
        },
        {
          path: 'markdown',
          name: 'markdown-formatter',
          component: MarkdownFormatter
        },
        {
          path: 'dart',
          name: 'dart-formatter',
          component: DartFormatter
        }
      ]
    },
    // 文本工具
    {
      path: '/text',
      name: 'text',
      component: () => import('../pages/Text.vue'),
      children: [
        {
          path: 'case-converter',
          name: 'text-case-converter',
          component: TextCaseConverter
        },
        {
          path: 'reverser',
          name: 'text-reverser',
          component: TextReverser
        },
        {
          path: 'space-handler',
          name: 'text-space-handler',
          component: TextSpaceHandler
        },
        {
          path: 'replacer',
          name: 'text-replacer',
          component: TextReplacer
        }
      ]
    },
    // 转换工具
    {
      path: '/convert',
      name: 'convert',
      component: () => import('../pages/Convert.vue'),
      children: [
        {
          path: 'unit',
          name: 'unit-converter',
          component: UnitConverter
        },
        {
          path: 'number-base',
          name: 'number-base-converter',
          component: NumberBaseConverter
        },
        {
          path: 'time',
          name: 'time-converter',
          component: TimeConverter
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
    // 加密工具
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
        }
      ]
    },
    // 图片工具
    {
      path: '/image',
      name: 'image',
      component: () => import('../pages/Image.vue'),
      children: [
        {
          path: 'compressor',
          name: 'image-compressor',
          component: ImageCompressor
        },
        {
          path: 'converter',
          name: 'image-converter',
          component: ImageConverter
        },
        {
          path: 'cropper',
          name: 'image-cropper',
          component: ImageCropper
        },
        {
          path: 'rotator',
          name: 'image-rotator',
          component: ImageRotator
        },
        {
          path: 'watermarker',
          name: 'image-watermarker',
          component: ImageWatermarker
        },
        {
          path: 'watermark-remover',
          name: 'image-watermark-remover',
          component: ImageWatermarkRemover
        }
      ]
    },
    // 其他工具
    {
      path: '/tools',
      name: 'tools',
      component: () => import('../pages/Tools.vue'),
      children: [
        {
          path: 'calculator',
          name: 'calculator',
          component: Calculator
        },
        {
          path: 'http-status',
          name: 'http-status-explainer',
          component: HttpStatusExplainer
        },
        {
          path: 'ip-lookup',
          name: 'ip-address-lookup',
          component: IpAddressLookup
        },
        {
          path: 'user-agent',
          name: 'user-agent-parser',
          component: UserAgentParser
        },
        {
          path: 'regex',
          name: 'regex-tools',
          component: RegexTools
        },
        {
          path: 'markdown-to-html',
          name: 'markdown-to-html',
          component: MarkdownToHtml
        },
        {
          path: 'qr-code',
          name: 'qr-code-tools',
          component: QrCodeTools
        },
        {
          path: 'short-url',
          name: 'short-url-tools',
          component: ShortUrlTools
        },
        {
          path: 'color-picker',
          name: 'color-picker-tools',
          component: ColorPickerTools
        }
      ]
    }
  ]
});

export default router; 
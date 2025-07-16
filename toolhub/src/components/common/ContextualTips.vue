<template>
  <div class="contextual-tips" v-if="shouldShow">
    <!-- 左侧提示 -->
    <div class="tip-panel left-panel" v-if="leftTip">
      <n-card size="small" :title="leftTip.title" class="tip-card">
        <div class="tip-content">
          <div class="tip-icon">
            <n-icon size="24" :color="leftTip.iconColor">
              <component :is="leftTip.icon" />
            </n-icon>
          </div>
          <div class="tip-text">
            <p class="tip-description">{{ leftTip.description }}</p>
            <div class="tip-items">
              <div class="tip-item" v-for="item in leftTip.items" :key="item">
                <n-icon size="14" color="#18a058">
                  <svg viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm3.5 4L6.75 9.75 4.5 7.5l-1 1 3.25 3.25L12.5 6l-1-1z"/>
                  </svg>
                </n-icon>
                <span>{{ item }}</span>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 右侧提示 -->
    <div class="tip-panel right-panel" v-if="rightTip">
      <n-card size="small" :title="rightTip.title" class="tip-card">
        <div class="tip-content">
          <div class="tip-icon">
            <n-icon size="24" :color="rightTip.iconColor">
              <component :is="rightTip.icon" />
            </n-icon>
          </div>
          <div class="tip-text">
            <p class="tip-description">{{ rightTip.description }}</p>
            <div class="tip-example" v-if="rightTip.example">
              <h4>{{ t('common.example') }}:</h4>
              <pre class="example-code">{{ rightTip.example }}</pre>
            </div>
            <div class="tip-actions" v-if="rightTip.actions">
              <n-button 
                v-for="action in rightTip.actions" 
                :key="action.text"
                size="small" 
                @click="handleAction(action)"
                class="action-btn"
              >
                {{ action.text }}
              </n-button>
            </div>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  CodeOutline as CodeIcon,
  LockClosedOutline as LockIcon,
  TimeOutline as TimeIcon,
  ColorPaletteOutline as ColorIcon,
  DocumentTextOutline as DocIcon,
  ImageOutline as ImageIcon,
  ChatbubbleOutline as TextIcon,
  CalculatorOutline as CalcIcon,
  QrCodeOutline as QrIcon,
  ShieldCheckmarkOutline as ShieldIcon,
  SpeedometerOutline as SpeedIcon,
  BulbOutline as BulbIcon,
  BookOutline as BookIcon,
  StarOutline as StarIcon
} from '@vicons/ionicons5'

const props = defineProps({
  currentPath: {
    type: String,
    required: true
  }
})

const { t } = useI18n()
const router = useRouter()

// 响应式窗口宽度
const windowWidth = ref(1200)

// 更新窗口宽度
const updateWindowWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

// 组件挂载时监听窗口变化
onMounted(() => {
  updateWindowWidth()
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// 控制显示
const shouldShow = computed(() => {
  return windowWidth.value >= 1400 // 只在大屏幕显示
})

// 根据路径获取知识提示
const getTipsForPath = (path) => {
  const category = path.split('/')[1]
  const tool = path.split('/')[2]
  
  const tipConfigs = {
    format: {
      json: {
        left: {
          title: t('sidebar.tips.jsonFormat'),
          icon: CodeIcon,
          iconColor: '#18a058',
          description: t('sidebar.tips.jsonFormatDesc'),
          items: [
            t('sidebar.tips.jsonValidation'),
            t('sidebar.tips.jsonBeautify'),
            t('sidebar.tips.jsonCompress'),
            t('sidebar.tips.jsonEscape')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: BulbIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.jsonCommonDesc'),
          example: `{
  "name": "ToolHub",
  "version": "1.0.0",
  "features": ["format", "encrypt"]
}`,
          actions: [
            { text: t('sidebar.tips.tryXML'), path: '/format/xml' },
            { text: t('sidebar.tips.tryYAML'), path: '/format/yaml' }
          ]
        }
      },
      xml: {
        left: {
          title: t('sidebar.tips.xmlFormat'),
          icon: CodeIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.xmlFormatDesc'),
          items: [
            t('sidebar.tips.xmlValidation'),
            t('sidebar.tips.xmlBeautify'),
            t('sidebar.tips.xmlNamespace'),
            t('sidebar.tips.xmlStructure')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: BookIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.xmlCommonDesc'),
          example: `<?xml version="1.0" encoding="UTF-8"?>
<config>
  <database>
    <host>localhost</host>
    <port>3306</port>
  </database>
</config>`,
          actions: [
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' },
            { text: t('sidebar.tips.tryHTML'), path: '/format/html' }
          ]
        }
      },
      css: {
        left: {
          title: t('sidebar.tips.cssFormat'),
          icon: CodeIcon,
          iconColor: '#1890ff',
          description: t('sidebar.tips.cssFormatDesc'),
          items: [
            t('sidebar.tips.cssBeautify'),
            t('sidebar.tips.cssCompress'),
            t('sidebar.tips.cssValidation'),
            t('sidebar.tips.cssOptimize')
          ]
        },
        right: {
          title: t('sidebar.tips.cssAdvanced'),
          icon: BulbIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.cssAdvancedDesc'),
          example: `.container {
  display: flex;
  justify-content: center;
  align-items: center;
}`,
          actions: [
            { text: t('sidebar.tips.tryHTML'), path: '/format/html' },
            { text: t('sidebar.tips.tryJS'), path: '/format/js' }
          ]
        }
      },
      html: {
        left: {
          title: t('sidebar.tips.htmlFormat'),
          icon: CodeIcon,
          iconColor: '#fa541c',
          description: t('sidebar.tips.htmlFormatDesc'),
          items: [
            t('sidebar.tips.htmlBeautify'),
            t('sidebar.tips.htmlValidation'),
            t('sidebar.tips.htmlOptimize'),
            t('sidebar.tips.htmlSemantic')
          ]
        },
        right: {
          title: t('sidebar.tips.htmlTips'),
          icon: StarIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.htmlTipsDesc'),
          example: `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <title>ToolHub</title>
</head>`,
          actions: [
            { text: t('sidebar.tips.tryCSS'), path: '/format/css' },
            { text: t('sidebar.tips.tryJS'), path: '/format/js' }
          ]
        }
      },
      js: {
        left: {
          title: t('sidebar.tips.jsFormat'),
          icon: CodeIcon,
          iconColor: '#fadb14',
          description: t('sidebar.tips.jsFormatDesc'),
          items: [
            t('sidebar.tips.jsBeautify'),
            t('sidebar.tips.jsValidation'),
            t('sidebar.tips.jsOptimize'),
            t('sidebar.tips.jsMinify')
          ]
        },
        right: {
          title: t('sidebar.tips.jsModern'),
          icon: BulbIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.jsModernDesc'),
          example: `const formatCode = (code) => {
  return prettier.format(code, {
    parser: 'babel',
    singleQuote: true
  });
};`,
          actions: [
            { text: t('sidebar.tips.tryVue'), path: '/format/vue' },
            { text: t('sidebar.tips.tryCSS'), path: '/format/css' }
          ]
        }
      },
      yaml: {
        left: {
          title: t('sidebar.tips.yamlFormat'),
          icon: CodeIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.yamlFormatDesc'),
          items: [
            t('sidebar.tips.yamlIndentation'),
            t('sidebar.tips.yamlValidation'),
            t('sidebar.tips.yamlTypes'),
            t('sidebar.tips.yamlConfig')
          ]
        },
        right: {
          title: t('sidebar.tips.yamlUsage'),
          icon: BookIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.yamlUsageDesc'),
          example: `name: ToolHub
version: 1.0.0
dependencies:
  - vue: ^3.0.0
  - naive-ui: ^2.0.0`,
          actions: [
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' },
            { text: t('sidebar.tips.tryXML'), path: '/format/xml' }
          ]
        }
      },
      sql: {
        left: {
          title: t('sidebar.tips.sqlFormat'),
          icon: CodeIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.sqlFormatDesc'),
          items: [
            t('sidebar.tips.sqlBeautify'),
            t('sidebar.tips.sqlKeywords'),
            t('sidebar.tips.sqlIndentation'),
            t('sidebar.tips.sqlOptimize')
          ]
        },
        right: {
          title: t('sidebar.tips.sqlTips'),
          icon: BulbIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.sqlTipsDesc'),
          example: `SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id
ORDER BY order_count DESC;`,
          actions: [
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' },
            { text: t('sidebar.tips.tryXML'), path: '/format/xml' }
          ]
        }
      },
      vue: {
        left: {
          title: t('sidebar.tips.vueFormat'),
          icon: CodeIcon,
          iconColor: '#4fc08d',
          description: t('sidebar.tips.vueFormatDesc'),
          items: [
            t('sidebar.tips.vueTemplate'),
            t('sidebar.tips.vueScript'),
            t('sidebar.tips.vueStyle'),
            t('sidebar.tips.vueComposition')
          ]
        },
        right: {
          title: t('sidebar.tips.vueEcosystem'),
          icon: BulbIcon,
          iconColor: '#41b883',
          description: t('sidebar.tips.vueEcosystemDesc'),
          example: `// Vue Component Structure
template: container with title
script: reactive data binding
style: scoped CSS styles`,
          actions: [
            { text: t('sidebar.tips.tryJS'), path: '/format/js' },
            { text: t('sidebar.tips.tryHTML'), path: '/format/html' }
          ]
        }
      },
      php: {
        left: {
          title: t('sidebar.tips.phpFormat'),
          icon: CodeIcon,
          iconColor: '#777bb4',
          description: t('sidebar.tips.phpFormatDesc'),
          items: [
            t('sidebar.tips.phpSyntax'),
            t('sidebar.tips.phpPsr'),
            t('sidebar.tips.phpNamespace'),
            t('sidebar.tips.phpOop')
          ]
        },
        right: {
          title: t('sidebar.tips.phpModern'),
          icon: BulbIcon,
          iconColor: '#8892bf',
          description: t('sidebar.tips.phpModernDesc'),
          example: `namespace App\\Services;

class ToolService {
    public function format(string $code): string {
        return trim($code);
    }
}`,
          actions: [
            { text: t('sidebar.tips.trySQL'), path: '/format/sql' },
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' }
          ]
        }
      },
      ruby: {
        left: {
          title: t('sidebar.tips.rubyFormat'),
          icon: CodeIcon,
          iconColor: '#cc342d',
          description: t('sidebar.tips.rubyFormatDesc'),
          items: [
            t('sidebar.tips.rubyElegant'),
            t('sidebar.tips.rubyGems'),
            t('sidebar.tips.rubyRails'),
            t('sidebar.tips.rubyDsl')
          ]
        },
        right: {
          title: t('sidebar.tips.rubyPhilosophy'),
          icon: StarIcon,
          iconColor: '#d91a1c',
          description: t('sidebar.tips.rubyPhilosophyDesc'),
          example: `class ToolFormatter
  def self.beautify(code)
    code.split("\\n")
        .map(&:strip)
        .join("\\n")
  end
end`,
          actions: [
            { text: t('sidebar.tips.tryYAML'), path: '/format/yaml' },
            { text: t('sidebar.tips.tryJS'), path: '/format/js' }
          ]
        }
      },
      shell: {
        left: {
          title: t('sidebar.tips.shellFormat'),
          icon: CodeIcon,
          iconColor: '#2c3e50',
          description: t('sidebar.tips.shellFormatDesc'),
          items: [
            t('sidebar.tips.shellBash'),
            t('sidebar.tips.shellZsh'),
            t('sidebar.tips.shellScript'),
            t('sidebar.tips.shellAutomation')
          ]
        },
        right: {
          title: t('sidebar.tips.shellPower'),
          icon: BulbIcon,
          iconColor: '#34495e',
          description: t('sidebar.tips.shellPowerDesc'),
          example: `#!/bin/bash
format_code() {
    local file="$1"
    prettier --write "$file"
    echo "Formatted: $file"
}

format_code "app.js"`,
          actions: [
            { text: t('sidebar.tips.tryYAML'), path: '/format/yaml' },
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' }
          ]
        }
      },
      markdown: {
        left: {
          title: t('sidebar.tips.markdownFormat'),
          icon: DocIcon,
          iconColor: '#333333',
          description: t('sidebar.tips.markdownFormatDesc'),
          items: [
            t('sidebar.tips.markdownSyntax'),
            t('sidebar.tips.markdownTables'),
            t('sidebar.tips.markdownCode'),
            t('sidebar.tips.markdownLinks')
          ]
        },
        right: {
          title: t('sidebar.tips.markdownUsage'),
          icon: BookIcon,
          iconColor: '#666666',
          description: t('sidebar.tips.markdownUsageDesc'),
          example: `# ToolHub
## 功能特色
- **格式化工具**：代码美化
- **加密工具**：数据安全
- **转换工具**：格式转换

\`\`\`javascript
console.log('Hello ToolHub');
\`\`\``,
          actions: [
            { text: t('sidebar.tips.tryHTML'), path: '/format/html' },
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' }
          ]
        }
      },
      java: {
        left: {
          title: t('sidebar.tips.javaFormat'),
          icon: CodeIcon,
          iconColor: '#f89820',
          description: t('sidebar.tips.javaFormatDesc'),
          items: [
            t('sidebar.tips.javaOop'),
            t('sidebar.tips.javaEnterprise'),
            t('sidebar.tips.javaSpring'),
            t('sidebar.tips.javaPerformance')
          ]
        },
        right: {
          title: t('sidebar.tips.javaEcosystem'),
          icon: BulbIcon,
          iconColor: '#ed8b00',
          description: t('sidebar.tips.javaEcosystemDesc'),
          example: `public class ToolFormatter {
    public static String format(String code) {
        return code.trim()
                   .replaceAll("\\s+", " ");
    }
    
    public static void main(String[] args) {
        System.out.println("ToolHub");
    }
}`,
          actions: [
            { text: t('sidebar.tips.tryXML'), path: '/format/xml' },
            { text: t('sidebar.tips.tryJSON'), path: '/format/json' }
          ]
        }
      }
    },
    encrypt: {
      base64: {
        left: {
          title: t('sidebar.tips.base64Encoding'),
          icon: LockIcon,
          iconColor: '#2080f0',
          description: t('sidebar.tips.base64Desc'),
          items: [
            t('sidebar.tips.base64Text'),
            t('sidebar.tips.base64Image'),
            t('sidebar.tips.base64Safe'),
            t('sidebar.tips.base64URL')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: StarIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.base64CommonDesc'),
          example: `// 原文本
Hello World!

// Base64编码
SGVsbG8gV29ybGQh`,
          actions: [
            { text: t('sidebar.tips.tryHex'), path: '/encrypt/hex' },
            { text: t('sidebar.tips.tryURL'), path: '/encrypt/url' }
          ]
        }
      },
      aes: {
        left: {
          title: t('sidebar.tips.aesEncryption'),
          icon: ShieldIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.aesDesc'),
          items: [
            t('sidebar.tips.aesSecure'),
            t('sidebar.tips.aesKey'),
            t('sidebar.tips.aesModes'),
            t('sidebar.tips.aesPadding')
          ]
        },
        right: {
          title: t('sidebar.tips.securityTips'),
          icon: BulbIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.aesSecurityDesc'),
          example: `密钥长度: 128/192/256位
模式: CBC, ECB, CFB, OFB
填充: PKCS7, NoPadding`,
          actions: [
            { text: t('sidebar.tips.tryDES'), path: '/encrypt/des' },
            { text: t('sidebar.tips.tryRSA'), path: '/encrypt/rsa' }
          ]
        }
      },
      hex: {
        left: {
          title: t('sidebar.tips.hexEncoding'),
          icon: CodeIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.hexDesc'),
          items: [
            t('sidebar.tips.hexBinary'),
            t('sidebar.tips.hexText'),
            t('sidebar.tips.hexColor'),
            t('sidebar.tips.hexDebug')
          ]
        },
        right: {
          title: t('sidebar.tips.hexUsage'),
          icon: BulbIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.hexUsageDesc'),
          example: `文本: Hello
十六进制: 48656c6c6f
颜色: #FF6B6B`,
          actions: [
            { text: t('sidebar.tips.tryBase64'), path: '/encrypt/base64' },
            { text: t('sidebar.tips.tryURL'), path: '/encrypt/url' }
          ]
        }
      },
      rsa: {
        left: {
          title: t('sidebar.tips.rsaEncryption'),
          icon: ShieldIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.rsaDesc'),
          items: [
            t('sidebar.tips.rsaAsymmetric'),
            t('sidebar.tips.rsaKeyPair'),
            t('sidebar.tips.rsaPadding'),
            t('sidebar.tips.rsaDigitalSign')
          ]
        },
        right: {
          title: t('sidebar.tips.rsaSecurity'),
          icon: LockIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.rsaSecurityDesc'),
          example: `密钥长度: 1024/2048/4096位
填充方式: PKCS1, OAEP
用途: 加密小数据, 数字签名`,
          actions: [
            { text: t('sidebar.tips.tryAES'), path: '/encrypt/aes' },
            { text: t('sidebar.tips.tryECC'), path: '/encrypt/ecc' }
          ]
        }
      },
      sha: {
        left: {
          title: t('sidebar.tips.shaHash'),
          icon: ShieldIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.shaDesc'),
          items: [
            t('sidebar.tips.shaOneWay'),
            t('sidebar.tips.shaIntegrity'),
            t('sidebar.tips.shaVariants'),
            t('sidebar.tips.shaHmac')
          ]
        },
        right: {
          title: t('sidebar.tips.shaApplications'),
          icon: BulbIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.shaApplicationsDesc'),
          example: `SHA-256: 
e3b0c44298fc1c149afbf4c8996fb924
27ae41e4649b934ca495991b7852b855

用途: 密码存储, 文件校验`,
          actions: [
            { text: t('sidebar.tips.tryBcrypt'), path: '/encrypt/bcrypt' },
            { text: t('sidebar.tips.tryArgon2'), path: '/encrypt/argon2' }
          ]
        }
      },
      jwt: {
        left: {
          title: t('sidebar.tips.jwtToken'),
          icon: LockIcon,
          iconColor: '#1890ff',
          description: t('sidebar.tips.jwtDesc'),
          items: [
            t('sidebar.tips.jwtStructure'),
            t('sidebar.tips.jwtClaims'),
            t('sidebar.tips.jwtSignature'),
            t('sidebar.tips.jwtStateless')
          ]
        },
        right: {
          title: t('sidebar.tips.jwtUsage'),
          icon: BookIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.jwtUsageDesc'),
          example: `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6
IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`,
          actions: [
            { text: t('sidebar.tips.tryBase64'), path: '/encrypt/base64' },
            { text: t('sidebar.tips.tryRSA'), path: '/encrypt/rsa' }
          ]
        }
      }
    },
    convert: {
      timestamp: {
        left: {
          title: t('sidebar.tips.timestampConvert'),
          icon: TimeIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.timestampDesc'),
          items: [
            t('sidebar.tips.timestampUnix'),
            t('sidebar.tips.timestampMs'),
            t('sidebar.tips.timestampTimezone'),
            t('sidebar.tips.timestampFormat')
          ]
        },
        right: {
          title: t('sidebar.tips.commonUse'),
          icon: BookIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.timestampCommonDesc'),
          example: `当前时间戳: 1702889856
毫秒时间戳: 1702889856789
日期格式: 2023/12/18 15:10:56`,
          actions: [
            { text: t('sidebar.tips.tryDateCalc'), path: '/convert/date-calc' },
            { text: t('sidebar.tips.tryDateDiff'), path: '/convert/date-diff' }
          ]
        }
      },
      color: {
        left: {
          title: t('sidebar.tips.colorConvert'),
          icon: ColorIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.colorDesc'),
          items: [
            t('sidebar.tips.colorHex'),
            t('sidebar.tips.colorRGB'),
            t('sidebar.tips.colorHSL'),
            t('sidebar.tips.colorPicker')
          ]
        },
        right: {
          title: t('sidebar.tips.designTips'),
          icon: StarIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.colorDesignDesc'),
          example: `HEX: #FF6B6B
RGB: rgb(255, 107, 107)
HSL: hsl(0, 100%, 71%)`,
          actions: [
            { text: t('sidebar.tips.tryUnit'), path: '/convert/unit' },
            { text: t('sidebar.tips.tryNumber'), path: '/convert/number' }
          ]
        }
      },
      regex: {
        left: {
          title: t('sidebar.tips.regexPattern'),
          icon: CodeIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.regexDesc'),
          items: [
            t('sidebar.tips.regexMatch'),
            t('sidebar.tips.regexReplace'),
            t('sidebar.tips.regexValidation'),
            t('sidebar.tips.regexExtract')
          ]
        },
        right: {
          title: t('sidebar.tips.regexExamples'),
          icon: BulbIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.regexExamplesDesc'),
          example: `邮箱: ^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$
手机: ^1[3-9]\\d{9}$
URL: https?://[\\w.-]+`,
          actions: [
            { text: t('sidebar.tips.tryReplace'), path: '/text/replace' },
            { text: t('sidebar.tips.tryCase'), path: '/text/case' }
          ]
        }
      },
      number: {
        left: {
          title: t('sidebar.tips.numberConvert'),
          icon: CalcIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.numberDesc'),
          items: [
            t('sidebar.tips.numberBinary'),
            t('sidebar.tips.numberOctal'),
            t('sidebar.tips.numberHex'),
            t('sidebar.tips.numberDecimal')
          ]
        },
        right: {
          title: t('sidebar.tips.numberUsage'),
          icon: BookIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.numberUsageDesc'),
          example: `十进制: 255
二进制: 11111111
八进制: 377
十六进制: FF`,
          actions: [
            { text: t('sidebar.tips.tryHex'), path: '/encrypt/hex' },
            { text: t('sidebar.tips.tryCalc'), path: '/other/calculator' }
          ]
        }
      },
      unit: {
        left: {
          title: t('sidebar.tips.unitConvert'),
          icon: SpeedIcon,
          iconColor: '#1890ff',
          description: t('sidebar.tips.unitDesc'),
          items: [
            t('sidebar.tips.unitLength'),
            t('sidebar.tips.unitWeight'),
            t('sidebar.tips.unitArea'),
            t('sidebar.tips.unitVolume')
          ]
        },
        right: {
          title: t('sidebar.tips.unitPrecision'),
          icon: BulbIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.unitPrecisionDesc'),
          example: `1米 = 100厘米 = 1000毫米
1公斤 = 1000克 = 2.205磅
1平方米 = 10.764平方英尺`,
          actions: [
            { text: t('sidebar.tips.tryNumber'), path: '/convert/number' },
            { text: t('sidebar.tips.tryCalc'), path: '/other/calculator' }
          ]
        }
      }
    },
    text: {
      case: {
        left: {
          title: t('sidebar.tips.textCase'),
          icon: TextIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.textCaseDesc'),
          items: [
            t('sidebar.tips.caseUpper'),
            t('sidebar.tips.caseLower'),
            t('sidebar.tips.caseTitle'),
            t('sidebar.tips.caseCamel')
          ]
        },
        right: {
          title: t('sidebar.tips.caseUsage'),
          icon: BulbIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.caseUsageDesc'),
          example: `原文本: hello world
大写: HELLO WORLD
小写: hello world
驼峰: helloWorld`,
          actions: [
            { text: t('sidebar.tips.tryReplace'), path: '/text/replace' },
            { text: t('sidebar.tips.tryReverse'), path: '/text/reverse' }
          ]
        }
      },
      replace: {
        left: {
          title: t('sidebar.tips.textReplace'),
          icon: TextIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.textReplaceDesc'),
          items: [
            t('sidebar.tips.replaceSimple'),
            t('sidebar.tips.replaceRegex'),
            t('sidebar.tips.replaceBatch'),
            t('sidebar.tips.replaceCase')
          ]
        },
        right: {
          title: t('sidebar.tips.replaceAdvanced'),
          icon: CodeIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.replaceAdvancedDesc'),
          example: `查找: \\d{4}-\\d{2}-\\d{2}
替换: $1年$2月$3日
结果: 2024-01-15 → 2024年01月15日`,
          actions: [
            { text: t('sidebar.tips.tryRegex'), path: '/convert/regex' },
            { text: t('sidebar.tips.tryCase'), path: '/text/case' }
          ]
        }
      }
    },
    image: {
      convert: {
        left: {
          title: t('sidebar.tips.imageConvert'),
          icon: ImageIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.imageConvertDesc'),
          items: [
            t('sidebar.tips.imageFormats'),
            t('sidebar.tips.imageQuality'),
            t('sidebar.tips.imageSize'),
            t('sidebar.tips.imageBatch')
          ]
        },
        right: {
          title: t('sidebar.tips.imageOptimize'),
          icon: SpeedIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.imageOptimizeDesc'),
          example: `支持格式:
JPG ↔ PNG ↔ WebP
GIF ↔ BMP ↔ SVG
质量调节: 1-100%`,
          actions: [
            { text: t('sidebar.tips.tryCrop'), path: '/image/crop' },
            { text: t('sidebar.tips.tryWatermark'), path: '/image/watermark' }
          ]
        }
      },
      crop: {
        left: {
          title: t('sidebar.tips.imageCrop'),
          icon: ImageIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.imageCropDesc'),
          items: [
            t('sidebar.tips.cropRect'),
            t('sidebar.tips.cropRatio'),
            t('sidebar.tips.cropCenter'),
            t('sidebar.tips.cropPreview')
          ]
        },
        right: {
          title: t('sidebar.tips.cropTips'),
          icon: BulbIcon,
          iconColor: '#1890ff',
          description: t('sidebar.tips.cropTipsDesc'),
          example: `常用比例:
1:1 (正方形)
4:3 (标准)
16:9 (宽屏)
自定义尺寸`,
          actions: [
            { text: t('sidebar.tips.tryRotate'), path: '/image/rotate' },
            { text: t('sidebar.tips.tryConvert'), path: '/image/convert' }
          ]
        }
      }
    },
    other: {
      qrcode: {
        left: {
          title: t('sidebar.tips.qrcodeGenerate'),
          icon: QrIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.qrcodeDesc'),
          items: [
            t('sidebar.tips.qrcodeText'),
            t('sidebar.tips.qrcodeURL'),
            t('sidebar.tips.qrcodeContact'),
            t('sidebar.tips.qrcodeWifi')
          ]
        },
        right: {
          title: t('sidebar.tips.qrcodeTips'),
          icon: BulbIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.qrcodeTipsDesc'),
          example: `文本: Hello World
网址: https://toolhub.com
WiFi: WIFI:T:WPA;S:MyNetwork;P:password;;`,
          actions: [
            { text: t('sidebar.tips.tryCalc'), path: '/other/calculator' },
            { text: t('sidebar.tips.tryRegex'), path: '/convert/regex' }
          ]
        }
      },
      calculator: {
        left: {
          title: t('sidebar.tips.calculator'),
          icon: CalcIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.calculatorDesc'),
          items: [
            t('sidebar.tips.calcBasic'),
            t('sidebar.tips.calcScientific'),
            t('sidebar.tips.calcHistory'),
            t('sidebar.tips.calcMemory')
          ]
        },
        right: {
          title: t('sidebar.tips.calcAdvanced'),
          icon: BulbIcon,
          iconColor: '#52c41a',
          description: t('sidebar.tips.calcAdvancedDesc'),
          example: `基础运算: +, -, ×, ÷
科学计算: sin, cos, log, √
常数: π, e
进制转换: 2, 8, 10, 16`,
          actions: [
            { text: t('sidebar.tips.tryNumber'), path: '/convert/number' },
            { text: t('sidebar.tips.tryUnit'), path: '/convert/unit' }
          ]
        }
      },
      iptools: {
        left: {
          title: t('sidebar.tips.ipTools'),
          icon: SpeedIcon,
          iconColor: '#1890ff',
          description: t('sidebar.tips.ipToolsDesc'),
          items: [
            t('sidebar.tips.ipInfo'),
            t('sidebar.tips.ipLocation'),
            t('sidebar.tips.ipSubnet'),
            t('sidebar.tips.ipPing')
          ]
        },
        right: {
          title: t('sidebar.tips.ipUsage'),
          icon: BookIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.ipUsageDesc'),
          example: `IPv4: 192.168.1.1
IPv6: 2001:db8::1
子网: 192.168.1.0/24
域名解析: example.com`,
          actions: [
            { text: t('sidebar.tips.tryShortUrl'), path: '/other/shorturl' },
            { text: t('sidebar.tips.tryUserAgent'), path: '/convert/user-agent' }
          ]
        }
      },
      shorturl: {
        left: {
          title: t('sidebar.tips.shortUrl'),
          icon: LockIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.shortUrlDesc'),
          items: [
            t('sidebar.tips.urlShorten'),
            t('sidebar.tips.urlCustom'),
            t('sidebar.tips.urlAnalytics'),
            t('sidebar.tips.urlExpiry')
          ]
        },
        right: {
          title: t('sidebar.tips.urlBenefits'),
          icon: StarIcon,
          iconColor: '#f39c12',
          description: t('sidebar.tips.urlBenefitsDesc'),
          example: `长链接:
https://example.com/very/long/path?param=value

短链接:
https://short.ly/abc123`,
          actions: [
            { text: t('sidebar.tips.tryQR'), path: '/other/qrcode' },
            { text: t('sidebar.tips.tryURL'), path: '/encrypt/url' }
          ]
        }
      }
    }
  }
  
  return tipConfigs[category]?.[tool] || getDefaultTips(category)
}

// 获取默认提示（当没有具体工具配置时）
const getDefaultTips = (category) => {
  const defaultTips = {
    format: {
      left: {
        title: t('sidebar.tips.formatTools'),
        icon: CodeIcon,
        iconColor: '#18a058',
        description: t('sidebar.tips.formatToolsDesc'),
        items: [
          t('sidebar.tips.formatBeautify'),
          t('sidebar.tips.formatValidate'),
          t('sidebar.tips.formatCompress'),
          t('sidebar.tips.formatHighlight')
        ]
      },
      right: {
        title: t('sidebar.tips.formatAdvanced'),
        icon: SpeedIcon,
        iconColor: '#2080f0',
        description: t('sidebar.tips.formatAdvancedDesc'),
        actions: [
          { text: t('sidebar.tips.tryJSON'), path: '/format/json' },
          { text: t('sidebar.tips.tryXML'), path: '/format/xml' },
          { text: t('sidebar.tips.tryJS'), path: '/format/js' },
          { text: t('sidebar.tips.tryCSS'), path: '/format/css' }
        ]
      }
    },
    encrypt: {
      left: {
        title: t('sidebar.tips.encryptTools'),
        icon: ShieldIcon,
        iconColor: '#722ed1',
        description: t('sidebar.tips.encryptToolsDesc'),
        items: [
          t('sidebar.tips.encryptSecure'),
          t('sidebar.tips.encryptLocal'),
          t('sidebar.tips.encryptAlgorithms'),
          t('sidebar.tips.encryptKeys')
        ]
      },
      right: {
        title: t('sidebar.tips.encryptTypes'),
        icon: LockIcon,
        iconColor: '#fa8c16',
        description: t('sidebar.tips.encryptTypesDesc'),
        actions: [
          { text: t('sidebar.tips.tryAES'), path: '/encrypt/aes' },
          { text: t('sidebar.tips.tryRSA'), path: '/encrypt/rsa' },
          { text: t('sidebar.tips.tryBase64'), path: '/encrypt/base64' },
          { text: t('sidebar.tips.trySHA'), path: '/encrypt/sha' }
        ]
      }
    },
    convert: {
      left: {
        title: t('sidebar.tips.convertTools'),
        icon: TimeIcon,
        iconColor: '#f39c12',
        description: t('sidebar.tips.convertToolsDesc'),
        items: [
          t('sidebar.tips.convertTime'),
          t('sidebar.tips.convertNumber'),
          t('sidebar.tips.convertUnit'),
          t('sidebar.tips.convertColor')
        ]
      },
      right: {
        title: t('sidebar.tips.convertQuick'),
        icon: SpeedIcon,
        iconColor: '#13c2c2',
        description: t('sidebar.tips.convertQuickDesc'),
        actions: [
          { text: t('sidebar.timestamp'), path: '/convert/timestamp' },
          { text: t('sidebar.tips.tryNumberBase'), path: '/convert/number-base' },
          { text: t('sidebar.tips.tryColor'), path: '/convert/color' },
          { text: t('sidebar.tips.tryUnit'), path: '/convert/unit' }
        ]
      }
    },
    other: {
      left: {
        title: t('sidebar.tips.utilityTools'),
        icon: CalcIcon,
        iconColor: '#52c41a',
        description: t('sidebar.tips.utilityToolsDesc'),
        items: [
          t('sidebar.tips.utilityQR'),
          t('sidebar.tips.utilityCalc'),
          t('sidebar.tips.utilityText'),
          t('sidebar.tips.utilityImage')
        ]
      },
      right: {
        title: t('sidebar.tips.utilityQuick'),
        icon: StarIcon,
        iconColor: '#eb2f96',
        description: t('sidebar.tips.utilityQuickDesc'),
        actions: [
          { text: t('sidebar.qrCode'), path: '/other/qrcode' },
          { text: t('sidebar.tips.tryCalculator'), path: '/other/calculator' },
          { text: t('sidebar.tips.tryTextCase'), path: '/text/case' },
          { text: t('sidebar.tips.tryImageConvert'), path: '/image/convert' }
        ]
      }
    }
  }
  
  return defaultTips[category] || null
}

// 当前页面的提示
const currentTips = computed(() => {
  return getTipsForPath(props.currentPath)
})

const leftTip = computed(() => currentTips.value?.left)
const rightTip = computed(() => currentTips.value?.right)

// 处理操作按钮点击
const handleAction = (action) => {
  if (action.path) {
    router.push(action.path)
  } else if (action.url) {
    window.open(action.url, '_blank')
  }
}
</script>

<style scoped>
.contextual-tips {
  position: fixed;
  top: 84px;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 5;
}

.tip-panel {
  position: fixed;
  width: 280px;
  pointer-events: auto;
}

.left-panel {
  left: calc((100vw - 1200px) / 2 - 300px);
}

.right-panel {
  right: calc((100vw - 1200px) / 2 - 300px);
}

.tip-card {
  background: var(--card-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.tip-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tip-icon {
  text-align: center;
  padding: 8px 0;
}

.tip-text {
  flex: 1;
}

.tip-description {
  font-size: 13px;
  color: var(--text-color-2);
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.tip-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-color-2);
  line-height: 1.4;
}

.tip-example {
  margin-top: 12px;
}

.tip-example h4 {
  font-size: 12px;
  color: var(--text-color);
  margin: 0 0 8px 0;
  font-weight: 600;
}

.example-code {
  background: var(--code-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--text-color-2);
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.tip-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.action-btn {
  font-size: 11px;
  height: 26px;
  padding: 0 8px;
}

/* 响应式隐藏 */
@media (max-width: 1399px) {
  .contextual-tips {
    display: none;
  }
}

/* 确保在超大屏幕上有足够空间 */
@media (min-width: 1800px) {
  .left-panel {
    left: calc((100vw - 1200px) / 2 - 320px);
  }
  
  .right-panel {
    right: calc((100vw - 1200px) / 2 - 320px);
  }
  
  .tip-panel {
    width: 300px;
  }
}
</style> 
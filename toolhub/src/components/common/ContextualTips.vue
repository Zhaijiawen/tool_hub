<template>
  <div class="contextual-tips" v-if="shouldShow">
    <!-- 右侧知识提示面板 -->
    <div class="tip-panel right-panel" v-if="leftTip || rightTip">
      <!-- 上方提示（介绍类） -->
      <div v-if="leftTip" class="tip-card top-tip">
        <n-card size="small" :title="leftTip.title" class="tip-card-inner">
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

      <!-- 下方提示（安全建议或常见用法） -->
      <div v-if="rightTip" class="tip-card bottom-tip">
        <n-card size="small" :title="rightTip.title" class="tip-card-inner">
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

      <!-- 学习资源提示 -->
      <div class="tip-card learning-tip">
        <n-card size="small" :title="t('tutorial.hintTitle')" class="tip-card-inner learning-card">
          <div class="tip-content">
            <div class="tip-icon">
              <n-icon size="24" color="#1890ff">
                <BookIcon />
              </n-icon>
            </div>
            <div class="tip-text">
              <p class="tip-description">{{ t('tutorial.hintContent') }}</p>
              <div class="tip-actions">
                <n-button 
                  size="small" 
                  type="primary"
                  @click="scrollToTutorial"
                  class="action-btn"
                >
                  {{ t('tutorial.viewTutorial') }}
                </n-button>
              </div>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { examples, examplesEn } from '@/locales/toolExamples'
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

const { t, locale } = useI18n()
const router = useRouter()

// 获取示例代码的helper函数
const getExample = (key) => {
  const currentExamples = locale.value === 'zh' ? examples : examplesEn
  return currentExamples[key] || ''
}

// 响应式窗口宽度和挂载状态
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1400)
const isMounted = ref(false)

// 更新窗口宽度
const updateWindowWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
  }
}

// 组件挂载时监听窗口变化
onMounted(() => {
  isMounted.value = true
  updateWindowWidth()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updateWindowWidth)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', updateWindowWidth)
  }
})

// 控制显示 - 只在客户端挂载后才显示
const shouldShow = computed(() => {
  const show = isMounted.value && windowWidth.value >= 1200
  // 开发环境下输出调试信息
  if (process.env.NODE_ENV === 'development') {
    console.log('ContextualTips Debug:', {
      isMounted: isMounted.value,
      windowWidth: windowWidth.value,
      shouldShow: show,
      currentPath: props.currentPath
    })
  }
  return show
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
          example: getExample('json'),
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
          example: getExample('xml'),
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
          example: getExample('css'),
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
          example: getExample('html'),
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
          example: getExample('js'),
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
          example: getExample('yaml'),
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
          example: getExample('sql'),
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
          example: getExample('vue'),
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
          example: getExample('php'),
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
          example: getExample('ruby'),
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
          example: getExample('shell'),
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
          example: getExample('markdown'),
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
          example: getExample('java'),
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
          example: getExample('base64'),
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
          example: getExample('aes'),
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
          example: getExample('hex'),
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
          example: getExample('rsa'),
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
          example: getExample('sha'),
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
          example: getExample('jwt'),
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
          example: getExample('timestamp'),
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
          example: getExample('color'),
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
          example: getExample('regex'),
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
          example: getExample('number'),
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
          example: getExample('unit'),
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
          example: getExample('textCase'),
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
          example: getExample('textReplace'),
          actions: [
            { text: t('sidebar.tips.tryRegex'), path: '/convert/regex' },
            { text: t('sidebar.tips.tryCase'), path: '/text/case' }
          ]
        }
      },
      reverse: {
        left: {
          title: t('sidebar.tips.textReverse'),
          icon: TextIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.textReverseDesc'),
          items: [
            t('sidebar.tips.reverseChar'),
            t('sidebar.tips.reverseWord'),
            t('sidebar.tips.reverseLine'),
            t('sidebar.tips.reverseFormat')
          ]
        },
        right: {
          title: t('sidebar.tips.reverseUsage'),
          icon: BulbIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.reverseUsageDesc'),
          example: getExample('reverse'),
          actions: [
            { text: t('sidebar.tips.tryCase'), path: '/text/case' },
            { text: t('sidebar.tips.tryWhitespace'), path: '/text/whitespace' }
          ]
        }
      },
      whitespace: {
        left: {
          title: t('sidebar.tips.textWhitespace'),
          icon: TextIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.textWhitespaceDesc'),
          items: [
            t('sidebar.tips.whitespaceTrim'),
            t('sidebar.tips.whitespaceCompress'),
            t('sidebar.tips.whitespacePreserve'),
            t('sidebar.tips.whitespaceBatch')
          ]
        },
        right: {
          title: t('sidebar.tips.whitespaceUsage'),
          icon: BookIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.whitespaceUsageDesc'),
          example: getExample('whitespace'),
          actions: [
            { text: t('sidebar.tips.tryReplace'), path: '/text/replace' },
            { text: t('sidebar.tips.tryReverse'), path: '/text/reverse' }
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
          example: getExample('imageConvert'),
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
          example: getExample('imageCrop'),
          actions: [
            { text: t('sidebar.tips.tryRotate'), path: '/image/rotate' },
            { text: t('sidebar.tips.tryConvert'), path: '/image/convert' }
          ]
        }
      },
      rotate: {
        left: {
          title: t('sidebar.tips.imageRotate'),
          icon: ImageIcon,
          iconColor: '#13c2c2',
          description: t('sidebar.tips.imageRotateDesc'),
          items: [
            t('sidebar.tips.rotateAngle'),
            t('sidebar.tips.rotateAuto'),
            t('sidebar.tips.rotateBatch'),
            t('sidebar.tips.rotatePreview')
          ]
        },
        right: {
          title: t('sidebar.tips.rotateUsage'),
          icon: BulbIcon,
          iconColor: '#eb2f96',
          description: t('sidebar.tips.rotateUsageDesc'),
          example: getExample('rotate'),
          actions: [
            { text: t('sidebar.tips.tryWatermark'), path: '/image/watermark' },
            { text: t('sidebar.tips.tryCrop'), path: '/image/crop' }
          ]
        }
      },
      watermark: {
        left: {
          title: t('sidebar.tips.imageWatermark'),
          icon: ImageIcon,
          iconColor: '#722ed1',
          description: t('sidebar.tips.imageWatermarkDesc'),
          items: [
            t('sidebar.tips.watermarkText'),
            t('sidebar.tips.watermarkPosition'),
            t('sidebar.tips.watermarkOpacity'),
            t('sidebar.tips.watermarkStyle')
          ]
        },
        right: {
          title: t('sidebar.tips.watermarkUsage'),
          icon: StarIcon,
          iconColor: '#fa8c16',
          description: t('sidebar.tips.watermarkUsageDesc'),
          example: getExample('watermark'),
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
          example: getExample('qrcode'),
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
          example: getExample('calculator'),
          actions: [
            { text: t('sidebar.tips.tryNumber'), path: '/convert/number' },
            { text: t('sidebar.tips.tryUnit'), path: '/convert/unit' }
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

// 滚动到教程区域
const scrollToTutorial = () => {
  const tutorialElement = document.querySelector('.tutorial-and-docs')
  if (tutorialElement) {
    tutorialElement.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    })
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
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.tip-card-inner {
  background: transparent;
  border: none;
  box-shadow: none;
}

.tip-card-inner:hover {
  box-shadow: none;
  transform: none;
}

.top-tip {
  order: 1;
}

.bottom-tip {
  order: 2;
}

.learning-tip {
  order: 3;
}

.learning-card {
  border: 1px solid #1890ff !important;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(24, 144, 255, 0.02) 100%) !important;
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
@media (max-width: 1199px) {
  .contextual-tips {
    display: none;
  }
}

/* 确保在超大屏幕上有足够空间 */
@media (min-width: 1800px) {
  .right-panel {
    right: calc((100vw - 1200px) / 2 - 320px);
  }
  
  .tip-panel {
    width: 300px;
  }
}
</style> 
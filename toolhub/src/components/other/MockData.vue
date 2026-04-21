<template>
  <div class="mock-data">
    <n-card :title="t('other.mockData.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 字段配置头部 -->
        <div class="fields-header">
          <n-space align="center" justify="space-between" style="width:100%">
            <n-text strong>{{ t('other.mockData.fieldName') }} / {{ t('other.mockData.fieldType') }}</n-text>
            <n-space>
              <n-button size="small" type="primary" dashed @click="addRootField">
                + {{ t('other.mockData.addField') }}
              </n-button>
              <n-button size="small" @click="fields = defaultFields()">{{ t('other.mockData.clear') }}</n-button>
            </n-space>
          </n-space>
        </div>

        <!-- 字段树 -->
        <div class="fields-list">
          <FieldRow
            v-for="(field, idx) in fields"
            :key="field.id"
            :field="field"
            :depth="0"
            :type-options="typeOptions"
            :t="t"
            @remove="removeField(fields, idx)"
            @add-child="addChild"
          />
        </div>

        <!-- 生成控制 -->
        <n-space align="center" wrap>
          <n-text>{{ t('other.mockData.count') }}：</n-text>
          <n-input-number v-model:value="count" :min="1" :max="1000" style="width: 120px" />
          <n-button type="primary" @click="generate">{{ t('other.mockData.generate') }}</n-button>
          <n-button v-if="result" @click="copyResult">{{ t('other.mockData.copy') }}</n-button>
          <n-button v-if="result" @click="downloadJson">JSON</n-button>
        </n-space>

        <!-- 错误 -->
        <n-alert v-if="errorMsg" type="error">{{ errorMsg }}</n-alert>

        <!-- 结果 -->
        <div v-if="result" class="result-section">
          <n-text class="section-title">{{ t('other.mockData.resultTitle') }}</n-text>
          <n-input
            type="textarea"
            :value="result"
            readonly
            :rows="16"
            style="font-family: monospace; font-size: 12px"
          />
        </div>

        <n-alert type="info" :title="t('other.mockData.infoTitle')">
          {{ t('other.mockData.infoContent') }}
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="mockData" />
  </div>
</template>

<script setup>
import { ref, computed, defineComponent, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, NInput, NInputNumber, NSelect, NButton, NText } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t, locale } = useI18n()
const isZh = computed(() => locale.value.startsWith('zh'))
const message = useMessage()

// ── ID 工厂 ────────────────────────────────────────
let _idCounter = 0
const newId = () => ++_idCounter

// ── 字段工厂 ───────────────────────────────────────
const newField = (overrides = {}) => ({
  id: newId(),
  name: '',
  type: 'string',
  // 数值范围
  min: 0,
  max: 100,
  decimal: 2,
  // 枚举
  enumOpts: '',
  // 自定义模板
  template: '',
  // object / array 子字段
  children: [],
  // array 配置
  arrayItemType: 'string',   // 基础类型时使用
  arrayMin: 1,
  arrayMax: 5,
  // 折叠状态（object / array 时）
  collapsed: false,
  ...overrides
})

const defaultFields = () => [
  newField({ name: 'id',     type: 'int',   min: 1, max: 10000 }),
  newField({ name: 'name',   type: 'name' }),
  newField({ name: 'email',  type: 'email' }),
  newField({ name: 'status', type: 'enum',  enumOpts: 'active,inactive,pending' }),
  newField({
    name: 'address', type: 'object', children: [
      newField({ name: 'city',    type: 'enum',   enumOpts: isZh.value ? '北京,上海,广州,深圳,杭州,成都' : 'New York,London,Tokyo,Paris,Berlin,Sydney' }),
      newField({ name: 'street',  type: 'string' }),
      newField({ name: 'zipCode', type: 'int',    min: 100000, max: 999999 })
    ]
  }),
  newField({
    name: 'tags', type: 'array', arrayItemType: 'enum',
    enumOpts: 'vue,react,node,python,java,go', arrayMin: 1, arrayMax: 4
  })
]

const fields   = ref(defaultFields())
const count    = ref(5)
const result   = ref('')
const errorMsg = ref('')

// ── 语言切换时，递归更新 city 枚举 ─────────────────
const CN_CITIES = '北京,上海,广州,深圳,杭州,成都'
const EN_CITIES = 'New York,London,Tokyo,Paris,Berlin,Sydney'

const updateCityEnumOpts = (fieldList) => {
  for (const f of fieldList) {
    if (f.type === 'object' || f.type === 'array') {
      updateCityEnumOpts(f.children || [])
    }
    if (f.name === 'city' && f.type === 'enum') {
      const isCnCities = f.enumOpts === CN_CITIES || f.enumOpts === EN_CITIES
      if (isCnCities) {
        f.enumOpts = isZh.value ? CN_CITIES : EN_CITIES
      }
    }
  }
}

watch(locale, () => {
  updateCityEnumOpts(fields.value)
})

// ── 字段操作 ───────────────────────────────────────
const addRootField = () => fields.value.push(newField())

const removeField = (list, idx) => list.splice(idx, 1)

const addChild = (parentField) => {
  if (!parentField.children) parentField.children = []
  parentField.children.push(newField())
}

// ── 类型选项 ───────────────────────────────────────
const typeOptions = computed(() => [
  { type: 'group', label: t('other.mockData.groupBasic'), key: 'basic', children: [
    { label: t('other.mockData.typeInt'),      value: 'int'      },
    { label: t('other.mockData.typeFloat'),    value: 'float'    },
    { label: t('other.mockData.typeString'),   value: 'string'   },
    { label: t('other.mockData.typeBool'),     value: 'bool'     },
    { label: t('other.mockData.typeUuid'),     value: 'uuid'     },
  ]},
  { type: 'group', label: t('other.mockData.groupFaker'), key: 'faker', children: [
    { label: t('other.mockData.typeName'),     value: 'name'     },
    { label: t('other.mockData.typeEmail'),    value: 'email'    },
    { label: t('other.mockData.typePhone'),    value: 'phone'    },
    { label: t('other.mockData.typeDate'),     value: 'date'     },
    { label: t('other.mockData.typeDatetime'), value: 'datetime' },
    { label: t('other.mockData.typeEnum'),     value: 'enum'     },
    { label: t('other.mockData.typeCustom'),   value: 'custom'   },
  ]},
  { type: 'group', label: t('other.mockData.groupComplex'), key: 'complex', children: [
    { label: t('other.mockData.typeObject'),   value: 'object'   },
    { label: t('other.mockData.typeArray'),    value: 'array'    },
  ]},
])

// array item 类型（不含 object/array）
const itemTypeOptions = computed(() => [
  { label: t('other.mockData.typeInt'),      value: 'int'      },
  { label: t('other.mockData.typeFloat'),    value: 'float'    },
  { label: t('other.mockData.typeString'),   value: 'string'   },
  { label: t('other.mockData.typeBool'),     value: 'bool'     },
  { label: t('other.mockData.typeUuid'),     value: 'uuid'     },
  { label: t('other.mockData.typeName'),     value: 'name'     },
  { label: t('other.mockData.typeEmail'),    value: 'email'    },
  { label: t('other.mockData.typePhone'),    value: 'phone'    },
  { label: t('other.mockData.typeDate'),     value: 'date'     },
  { label: t('other.mockData.typeDatetime'), value: 'datetime' },
  { label: t('other.mockData.typeEnum'),     value: 'enum'     },
  { label: t('other.mockData.typeCustom'),   value: 'custom'   },
  { label: t('other.mockData.typeObject'),   value: 'object'   },
])

// ── 生成器 ─────────────────────────────────────────
const randInt   = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const genUUID   = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0
  return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
})

const CN_SURNAMES  = '赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹'.split('')
const CN_NAMES     = '伟芳娜敏静秀娟英华慧巧美岚风露洁璐琴素云莲真环雪荣爱妹霞香月莺媛艳瑞凡佳嘉琼勤珍贞莉桂娣叶璧璐娅琦晶妍茜秋珊莎锦黛青倩婷姣婉娴瑾颖露瑶怡婵雁蓓纨仪荷丹蓉眉君琴蕊薇菁梦岚苑婕馨瑗琰韵融园艺咏卿聪澜纯毓悦昭冰爽琬茗羽希宁欣飘育滢馥筠柔竹霭凝晓欢霄枫芸菲寒伊亚宜可姬舒影荔枝思丽'.split('')
const EN_FIRST     = ['James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles','Mary','Patricia','Jennifer','Linda','Barbara','Elizabeth','Susan','Jessica','Sarah','Karen','Alice','Bob','Charlie','Diana','Emma','Frank','Grace','Henry','Iris','Jack'].map(s => s)
const EN_LAST      = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson','Taylor','Thomas','Moore','Jackson','Martin','Lee','White','Harris','Clark','Lewis']
const randomCnName = () => CN_SURNAMES[randInt(0, CN_SURNAMES.length - 1)] + CN_NAMES[randInt(0, CN_NAMES.length - 1)] + (Math.random() > 0.5 ? CN_NAMES[randInt(0, CN_NAMES.length - 1)] : '')
const randomEnName = () => EN_FIRST[randInt(0, EN_FIRST.length - 1)] + ' ' + EN_LAST[randInt(0, EN_LAST.length - 1)]
const randomName   = () => isZh.value ? randomCnName() : randomEnName()

const CN_EMAIL_DOMAINS = ['163.com', 'qq.com', 'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com']
const EN_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'example.com', 'proton.me']
const randomEmail   = (idx) => {
  const names   = ['user', 'test', 'dev', 'admin', 'info', 'contact', 'hello']
  const domains = isZh.value ? CN_EMAIL_DOMAINS : EN_EMAIL_DOMAINS
  return `${names[idx % names.length]}${randInt(100, 9999)}@${domains[randInt(0, domains.length - 1)]}`
}
const randomPhone = () => {
  if (isZh.value) {
    const prefixes = ['130','131','132','133','135','136','137','138','139','150','151','152','153','155','156','157','158','159','176','177','178','180','181','182','183','185','186','187','188','189']
    return prefixes[randInt(0, prefixes.length - 1)] + String(randInt(10000000, 99999999)).padStart(8, '0')
  } else {
    // 北美格式 (XXX) XXX-XXXX
    return `(${randInt(200, 999)}) ${randInt(200, 999)}-${String(randInt(1000, 9999))}`
  }
}
const randomDate     = () => new Date(Date.now() - randInt(0, 365 * 5) * 86400000).toISOString().slice(0, 10)
const randomDatetime = () => new Date(Date.now() - randInt(0, 365 * 2) * 86400000).toISOString().replace('T', ' ').slice(0, 19)
const randomString   = (len = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: len }, () => chars[randInt(0, chars.length - 1)]).join('')
}

// 生成单个基础/对象值（递归）
const genValue = (field, idx) => {
  switch (field.type) {
    case 'int':     return randInt(field.min ?? 0, field.max ?? 100)
    case 'float': {
      const v = Math.random() * ((field.max ?? 100) - (field.min ?? 0)) + (field.min ?? 0)
      return parseFloat(v.toFixed(field.decimal ?? 2))
    }
    case 'string':   return randomString(randInt(6, 12))
    case 'name':     return randomName()
    case 'email':    return randomEmail(idx)
    case 'phone':    return randomPhone()
    case 'date':     return randomDate()
    case 'datetime': return randomDatetime()
    case 'bool':     return Math.random() > 0.5
    case 'uuid':     return genUUID()
    case 'enum': {
      const opts = (field.enumOpts || '').split(',').map(s => s.trim()).filter(Boolean)
      return opts.length ? opts[randInt(0, opts.length - 1)] : ''
    }
    case 'custom': {
      const tpl = field.template || '{index}'
      return tpl
        .replace(/\{index\}/g, idx + 1)
        .replace(/\{uuid\}/g, genUUID())
        .replace(/\{timestamp\}/g, Date.now())
    }
    case 'object': {
      const obj = {}
      for (const child of (field.children || [])) {
        const key = child.name.trim() || `field${child.id}`
        obj[key] = genValue(child, idx)
      }
      return obj
    }
    case 'array': {
      const len = randInt(field.arrayMin ?? 1, field.arrayMax ?? 5)
      // array of objects
      if (field.arrayItemType === 'object' && (field.children || []).length > 0) {
        return Array.from({ length: len }, (_, i) => {
          const obj = {}
          for (const child of field.children) {
            const key = child.name.trim() || `field${child.id}`
            obj[key] = genValue(child, i)
          }
          return obj
        })
      }
      // array of primitives
      const itemField = {
        ...field,
        type: field.arrayItemType || 'string',
      }
      return Array.from({ length: len }, (_, i) => genValue(itemField, i))
    }
    default: return ''
  }
}

const generate = () => {
  errorMsg.value = ''
  if (fields.value.length === 0) { errorMsg.value = t('other.mockData.emptyFields'); return }
  const data = []
  for (let i = 0; i < count.value; i++) {
    const row = {}
    for (const f of fields.value) {
      const key = f.name.trim() || `field${fields.value.indexOf(f) + 1}`
      row[key] = genValue(f, i)
    }
    data.push(row)
  }
  result.value = JSON.stringify(data, null, 2)
}

const copyResult = () => {
  navigator.clipboard.writeText(result.value).then(() => message.success(t('other.mockData.copied')))
}

const downloadJson = () => {
  const blob = new Blob([result.value], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'mock_data.json'
  a.click()
  URL.revokeObjectURL(a.href)
}

// ── FieldRow 子组件（递归渲染字段树）────────────────
const FieldRow = defineComponent({
  name: 'FieldRow',
  props: {
    field: Object,
    depth: { type: Number, default: 0 },
    typeOptions: Array,
    t: Function,
  },
  emits: ['remove', 'add-child'],
  setup(props, { emit }) {
    const itemTypeOpts = computed(() => itemTypeOptions.value)

    const isComplex = computed(() => props.field.type === 'object' || props.field.type === 'array')
    const isArrayOfObject = computed(() => props.field.type === 'array' && props.field.arrayItemType === 'object')

    const toggleCollapse = () => { props.field.collapsed = !props.field.collapsed }

    return () => {
      const f = props.field

      // 左侧缩进
      const indent = h('span', { style: { width: `${props.depth * 20}px`, flexShrink: 0, display: 'inline-block' } })

      // 折叠按钮
      const collapseBtn = isComplex.value
        ? h(NButton, {
            size: 'tiny', quaternary: true,
            onClick: toggleCollapse,
            style: 'flex-shrink:0; padding: 0 2px; min-width:22px'
          }, () => f.collapsed ? '▶' : '▼')
        : h('span', { style: 'width:22px; flex-shrink:0; display:inline-block' })

      // 字段名输入
      const nameInput = h(NInput, {
        value: f.name,
        'onUpdate:value': v => { f.name = v },
        placeholder: props.t('other.mockData.fieldNamePlaceholder'),
        size: 'small',
        style: `width: ${120 - props.depth * 10}px; flex-shrink: 0; min-width: 80px`
      })

      // 类型选择
      const typeSelect = h(NSelect, {
        value: f.type,
        'onUpdate:value': v => {
          f.type = v
          if (v === 'object' || v === 'array') {
            if (!f.children) f.children = []
          }
        },
        options: props.typeOptions,
        size: 'small',
        style: 'width: 130px; flex-shrink: 0'
      })

      // 类型附加参数
      const extras = []
      if (f.type === 'int') {
        extras.push(
          h(NInputNumber, { value: f.min, 'onUpdate:value': v => f.min = v, placeholder: props.t('other.mockData.intMin'), size: 'small', style: 'width:80px' }),
          h(NText, { depth: 3 }, () => '~'),
          h(NInputNumber, { value: f.max, 'onUpdate:value': v => f.max = v, placeholder: props.t('other.mockData.intMax'), size: 'small', style: 'width:80px' }),
        )
      } else if (f.type === 'float') {
        extras.push(
          h(NInputNumber, { value: f.min, 'onUpdate:value': v => f.min = v, placeholder: props.t('other.mockData.intMin'), size: 'small', style: 'width:80px' }),
          h(NText, { depth: 3 }, () => '~'),
          h(NInputNumber, { value: f.max, 'onUpdate:value': v => f.max = v, placeholder: props.t('other.mockData.intMax'), size: 'small', style: 'width:80px' }),
          h(NInputNumber, { value: f.decimal, 'onUpdate:value': v => f.decimal = v, min: 0, max: 8, placeholder: props.t('other.mockData.floatDecimal'), size: 'small', style: 'width:70px' }),
        )
      } else if (f.type === 'enum') {
        extras.push(
          h(NInput, { value: f.enumOpts, 'onUpdate:value': v => f.enumOpts = v, placeholder: props.t('other.mockData.enumPlaceholder'), size: 'small', style: 'flex:1; min-width:160px' })
        )
      } else if (f.type === 'custom') {
        extras.push(
          h(NInput, { value: f.template, 'onUpdate:value': v => f.template = v, placeholder: props.t('other.mockData.customPlaceholder'), size: 'small', style: 'flex:1; min-width:160px' })
        )
      } else if (f.type === 'array') {
        // array: item类型 + 数量范围
        extras.push(
          h(NText, { depth: 3, style: 'flex-shrink:0; font-size:12px' }, () => props.t('other.mockData.arrayItemType') + ':'),
          h(NSelect, {
            value: f.arrayItemType,
            'onUpdate:value': v => {
              f.arrayItemType = v
              if (v === 'object' && !f.children) f.children = []
            },
            options: itemTypeOpts.value,
            size: 'small',
            style: 'width:115px; flex-shrink:0'
          }),
          h(NInputNumber, { value: f.arrayMin, 'onUpdate:value': v => f.arrayMin = v, min: 0, max: 50, placeholder: 'min', size: 'small', style: 'width:64px' }),
          h(NText, { depth: 3 }, () => '~'),
          h(NInputNumber, { value: f.arrayMax, 'onUpdate:value': v => f.arrayMax = v, min: 1, max: 50, placeholder: 'max', size: 'small', style: 'width:64px' }),
        )
        if (f.arrayItemType === 'enum') {
          extras.push(
            h(NInput, { value: f.enumOpts, 'onUpdate:value': v => f.enumOpts = v, placeholder: props.t('other.mockData.enumPlaceholder'), size: 'small', style: 'flex:1; min-width:140px' })
          )
        }
      }

      // 操作按钮
      const addChildBtn = (isComplex.value || isArrayOfObject.value)
        ? h(NButton, {
            size: 'small', dashed: true, type: 'success',
            onClick: () => emit('add-child', f),
            style: 'flex-shrink:0'
          }, () => '+ ' + props.t('other.mockData.addChild'))
        : null

      const removeBtn = h(NButton, {
        size: 'small', quaternary: true, type: 'error',
        onClick: () => emit('remove'),
        style: 'flex-shrink:0'
      }, () => '✕')

      // 当前行
      const rowItems = [indent, collapseBtn, nameInput, typeSelect, ...extras]
      if (addChildBtn) rowItems.push(addChildBtn)
      rowItems.push(removeBtn)

      const baseRowStyle = 'display:flex; align-items:center; gap:6px; flex-wrap:wrap; padding:6px 10px; border:1px solid var(--n-border-color,#e0e0e0); border-radius:6px; transition:border-color 0.2s;'
      const depthStyle   = props.depth > 0 ? 'background:rgba(0,0,0,0.02); border-color:#d0d0d0;' : ''
      const row = h('div', { style: baseRowStyle + depthStyle }, rowItems)

      // 子节点（object 的直接子字段 / array of objects）
      const showChildren = isComplex.value && !f.collapsed && (f.children || []).length > 0
      const childRows = showChildren
        ? (f.children || []).map((child, ci) =>
            h(FieldRow, {
              key: child.id,
              field: child,
              depth: props.depth + 1,
              typeOptions: props.typeOptions,
              t: props.t,
              onRemove: () => removeField(f.children, ci),
              onAddChild: (c) => emit('add-child', c)
            })
          )
        : []

      return h('div', { style: 'display:flex; flex-direction:column; gap:4px;' }, [row, ...childRows])
    }
  }
})
</script>

<style scoped>
.mock-data {
  max-width: 1060px;
  margin: 20px auto;
  padding: 0 20px;
}

.fields-header {
  display: flex;
  align-items: center;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 6px 10px;
  border: 1px solid var(--n-border-color, #e0e0e0);
  border-radius: 6px;
  transition: border-color 0.2s;
}

.result-section {
  margin-top: 4px;
}

.section-title {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .mock-data { padding: 0 12px; }
  .field-row { flex-direction: column; align-items: flex-start; }
}
</style>


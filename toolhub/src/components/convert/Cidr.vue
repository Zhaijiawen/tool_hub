<template>
  <div class="cidr-calc">
    <n-card :title="t('convert.cidr.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 输入方式 -->
        <n-form-item :label="t('convert.cidr.inputMode')" :show-feedback="false">
          <n-radio-group v-model:value="inputMode" @update:value="clearResult">
            <n-space>
              <n-radio value="cidr">{{ t('convert.cidr.modeCidr') }}</n-radio>
              <n-radio value="mask">{{ t('convert.cidr.modeMask') }}</n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <!-- CIDR 输入 -->
        <n-form-item v-if="inputMode === 'cidr'" label="CIDR" :show-feedback="false">
          <n-input-group>
            <n-input
              v-model:value="cidrInput"
              :placeholder="t('convert.cidr.cidrPlaceholder')"
              clearable
              @keyup.enter="calculate"
            />
            <n-button type="primary" @click="calculate">{{ t('convert.cidr.calculate') }}</n-button>
          </n-input-group>
        </n-form-item>

        <!-- IP + 掩码输入 -->
        <template v-if="inputMode === 'mask'">
          <n-grid :cols="2" :x-gap="12">
            <n-grid-item>
              <n-form-item label="IP" :show-feedback="false">
                <n-input v-model:value="ipInput" :placeholder="t('convert.cidr.ipPlaceholder')" clearable @keyup.enter="calculate" />
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item :label="t('convert.cidr.subnetMask')" :show-feedback="false">
                <n-input v-model:value="maskInput" :placeholder="t('convert.cidr.maskPlaceholder')" clearable @keyup.enter="calculate" />
              </n-form-item>
            </n-grid-item>
          </n-grid>
          <n-button type="primary" @click="calculate">{{ t('convert.cidr.calculate') }}</n-button>
        </template>

        <!-- 错误 -->
        <n-alert v-if="error" type="error">{{ error }}</n-alert>

        <!-- 计算结果 -->
        <template v-if="result">
          <n-divider style="margin: 4px 0 16px">{{ t('convert.cidr.resultTitle') }}</n-divider>
          <n-grid :cols="2" :x-gap="16" :y-gap="12" responsive="screen" :collapsed-rows="2">
            <n-grid-item v-for="item in resultItems" :key="item.key">
              <div class="result-item">
                <n-text depth="3" class="result-label">{{ item.label }}</n-text>
                <div class="result-value-row">
                  <n-text class="result-value">{{ item.value }}</n-text>
                  <n-button size="tiny" quaternary @click="copyText(item.value)">
                    {{ t('common.copy') }}
                  </n-button>
                </div>
              </div>
            </n-grid-item>
          </n-grid>

          <!-- 二进制展示 -->
          <n-divider style="margin: 16px 0 12px">{{ t('convert.cidr.binaryTitle') }}</n-divider>
          <div class="binary-section">
            <div v-for="row in binaryRows" :key="row.label" class="binary-row">
              <n-text depth="3" class="bin-label">{{ row.label }}</n-text>
              <n-text class="bin-value">{{ row.value }}</n-text>
            </div>
          </div>
        </template>

        <!-- 子网速查表 -->
        <n-divider style="margin: 8px 0 12px">{{ t('convert.cidr.quickRef') }}</n-divider>
        <div class="quick-ref-wrap">
          <n-data-table
            :columns="quickRefColumns"
            :data="quickRefData"
            size="small"
            :bordered="true"
            striped
            :row-props="quickRowProps"
          />
        </div>

        <n-alert type="info" :title="t('convert.cidr.infoTitle')">
          {{ t('convert.cidr.infoContent') }}
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="cidr" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const STORAGE_KEY = 'tool_cidr_last'

const inputMode = ref('cidr')
const cidrInput = ref('')
const ipInput   = ref('')
const maskInput = ref('')
const error     = ref('')
const result    = ref(null)

// ── 工具函数 ──────────────────────────────────────
const ipToLong = (ip) => {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

const longToIp = (n) => {
  return [
    (n >>> 24) & 0xff,
    (n >>> 16) & 0xff,
    (n >>> 8) & 0xff,
    n & 0xff
  ].join('.')
}

const longToBin = (n) => {
  return (n >>> 0).toString(2).padStart(32, '0').replace(/(.{8})/g, '$1 ').trim()
}

const maskToPrefix = (mask) => {
  const n = ipToLong(mask)
  if (n === null) return null
  const bin = (n >>> 0).toString(2)
  const ones = bin.split('').filter(b => b === '1').length
  // 验证掩码连续
  const firstZero = bin.indexOf('0')
  if (firstZero !== -1 && bin.slice(firstZero).includes('1')) return null
  return ones
}

const prefixToMask = (prefix) => {
  if (prefix < 0 || prefix > 32) return null
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
  return longToIp(mask)
}

const getIpClass = (ip) => {
  const first = parseInt(ip.split('.')[0])
  if (first >= 1 && first <= 126) return 'Class A'
  if (first === 127) return 'Loopback'
  if (first >= 128 && first <= 191) return 'Class B'
  if (first >= 192 && first <= 223) return 'Class C'
  if (first >= 224 && first <= 239) return 'Class D (Multicast)'
  if (first >= 240 && first <= 255) return 'Class E (Reserved)'
  return 'Unknown'
}

const isPrivate = (ip) => {
  const n = ipToLong(ip)
  // 10.0.0.0/8
  if ((n & 0xff000000) >>> 0 === 0x0a000000) return true
  // 172.16.0.0/12
  if ((n & 0xfff00000) >>> 0 === 0xac100000) return true
  // 192.168.0.0/16
  if ((n & 0xffff0000) >>> 0 === 0xc0a80000) return true
  return false
}

// ── 计算 ─────────────────────────────────────────
const calculate = () => {
  error.value = ''
  result.value = null
  let prefix, ip

  try {
    if (inputMode.value === 'cidr') {
      const raw = cidrInput.value.trim()
      if (!raw) return
      const m = raw.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/)
      if (!m) throw new Error(t('convert.cidr.invalidCidr'))
      ip = m[1]
      prefix = parseInt(m[2])
    } else {
      ip = ipInput.value.trim()
      const mask = maskInput.value.trim()
      if (!ip || !mask) return
      const p = maskToPrefix(mask)
      if (p === null) throw new Error(t('convert.cidr.invalidMask'))
      prefix = p
    }

    if (ipToLong(ip) === null) throw new Error(t('convert.cidr.invalidInput'))
    if (prefix < 0 || prefix > 32) throw new Error(t('convert.cidr.invalidCidr'))

    const ipLong     = ipToLong(ip)
    const maskLong   = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0
    const networkLong = (ipLong & maskLong) >>> 0
    const broadcast   = (networkLong | (~maskLong >>> 0)) >>> 0
    const wildcard    = (~maskLong) >>> 0

    const usableCount = prefix >= 31 ? (prefix === 32 ? 1 : 2) : broadcast - networkLong - 1
    const firstHost   = prefix >= 31 ? networkLong : networkLong + 1
    const lastHost    = prefix >= 31 ? broadcast  : broadcast  - 1

    result.value = {
      ip,
      prefix,
      networkAddr:   longToIp(networkLong),
      broadcastAddr: longToIp(broadcast),
      subnetMask:    longToIp(maskLong),
      wildcardMask:  longToIp(wildcard),
      usableHosts:   usableCount.toLocaleString(),
      firstHost:     longToIp(firstHost),
      lastHost:      longToIp(lastHost),
      ipClass:       `${getIpClass(ip)}${isPrivate(ip) ? ' (Private)' : ''}`,
      cidrPrefix:    `/${prefix}`,
      // binary
      binNetwork: longToBin(networkLong),
      binMask:    longToBin(maskLong),
      binIp:      longToBin(ipLong)
    }

    // 持久化
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode: inputMode.value, cidr: cidrInput.value, ip: ipInput.value, mask: maskInput.value }))
  } catch (e) {
    error.value = e.message
  }
}

const clearResult = () => { result.value = null; error.value = '' }

// ── 结果展示 ─────────────────────────────────────
const resultItems = computed(() => {
  if (!result.value) return []
  const r = result.value
  return [
    { key: 'networkAddr',   label: t('convert.cidr.networkAddr'),   value: r.networkAddr   },
    { key: 'broadcastAddr', label: t('convert.cidr.broadcastAddr'), value: r.broadcastAddr },
    { key: 'subnetMask',    label: t('convert.cidr.subnetMask'),    value: r.subnetMask    },
    { key: 'wildcardMask',  label: t('convert.cidr.wildcardMask'),  value: r.wildcardMask  },
    { key: 'usableHosts',   label: t('convert.cidr.usableHosts'),   value: r.usableHosts   },
    { key: 'firstHost',     label: t('convert.cidr.firstHost'),     value: r.firstHost     },
    { key: 'lastHost',      label: t('convert.cidr.lastHost'),      value: r.lastHost      },
    { key: 'ipClass',       label: t('convert.cidr.ipClass'),       value: r.ipClass       },
    { key: 'cidrPrefix',    label: t('convert.cidr.cidrPrefix'),    value: r.cidrPrefix    }
  ]
})

const binaryRows = computed(() => {
  if (!result.value) return []
  return [
    { label: 'IP',                                   value: result.value.binIp      },
    { label: t('convert.cidr.subnetMask'),           value: result.value.binMask    },
    { label: t('convert.cidr.networkAddr'),          value: result.value.binNetwork }
  ]
})

// ── 速查表 ───────────────────────────────────────
const quickRefData = (() => {
  const rows = []
  const notable = [8, 16, 17, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32]
  for (let p = 8; p <= 32; p++) {
    const maskL = p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0
    const hosts = p >= 31 ? (p === 32 ? 1 : 2) : Math.pow(2, 32 - p) - 2
    rows.push({ prefix: `/${p}`, hosts: hosts.toLocaleString(), mask: longToIp(maskL), _prefix: p })
  }
  return rows
})()

const quickRefColumns = computed(() => [
  { title: t('convert.cidr.quickRefPrefix'), key: 'prefix', width: 80 },
  { title: t('convert.cidr.quickRefHosts'),  key: 'hosts',  width: 140 },
  { title: t('convert.cidr.quickRefMask'),   key: 'mask'  }
])

const quickRowProps = (row) => ({
  style: 'cursor:pointer',
  onClick: () => {
    inputMode.value = 'cidr'
    cidrInput.value = `192.168.1.0${row.prefix}`
    calculate()
  }
})

// ── 复制 ─────────────────────────────────────────
const copyText = (text) => {
  navigator.clipboard.writeText(text).then(() => message.success(t('common.copy') + ' ' + t('common.success')))
}

// ── 恢复上次 ─────────────────────────────────────
onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (saved) {
      inputMode.value = saved.mode || 'cidr'
      cidrInput.value = saved.cidr || ''
      ipInput.value   = saved.ip   || ''
      maskInput.value = saved.mask || ''
      if (cidrInput.value || (ipInput.value && maskInput.value)) calculate()
    }
  } catch {}
})
</script>

<style scoped>
.cidr-calc {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 20px;
}

.result-item {
  padding: 8px 12px;
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
}

.result-label {
  font-size: 12px;
  display: block;
  margin-bottom: 4px;
}

.result-value-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-value {
  font-family: monospace;
  font-size: 14px;
  font-weight: 600;
}

.binary-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.binary-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bin-label {
  width: 110px;
  font-size: 12px;
  flex-shrink: 0;
}

.bin-value {
  font-family: monospace;
  font-size: 13px;
  word-break: break-all;
}

.quick-ref-wrap {
  max-height: 300px;
  overflow-y: auto;
}

@media (max-width: 600px) {
  .cidr-calc {
    padding: 0 12px;
  }
  .binary-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }
  .bin-label { width: auto; }
}
</style>


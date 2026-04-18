<template>
  <div class="cert-parser-tool">
    <n-card :title="t('other.certParser.title')" :bordered="false">
      <n-space vertical size="large">

        <!-- 输入方式 -->
        <n-tabs v-model:value="inputMode" type="line" animated>
          <!-- 粘贴 PEM -->
          <n-tab-pane name="pem" :tab="t('other.certParser.pasteMode')">
            <n-space vertical size="small">
              <n-upload
                accept=".pem,.crt,.cer,.der,.p7b"
                :show-file-list="false"
                @change="handleFileUpload"
              >
                <n-button size="small" secondary>
                  {{ t('other.certParser.uploadFile') }}
                </n-button>
              </n-upload>
              <n-input
                v-model:value="pemText"
                type="textarea"
                :placeholder="t('other.certParser.pemPlaceholder')"
                :autosize="{ minRows: 8, maxRows: 16 }"
                @input="autoParse"
                clearable
              />
            </n-space>
          </n-tab-pane>

          <!-- 域名检测 -->
          <n-tab-pane name="domain" :tab="t('other.certParser.domainMode')">
            <div class="domain-row">
              <n-input
                v-model:value="domainInput"
                :placeholder="t('other.certParser.domainPlaceholder')"
                clearable
                @keydown.enter="fetchCert"
              />
              <n-button type="primary" :loading="fetching" @click="fetchCert">
                {{ t('other.certParser.fetch') }}
              </n-button>
            </div>
            <n-alert v-if="fetchError" type="warning" class="fetch-error" :title="t('other.certParser.fetchFailedTitle')">
              <div>{{ fetchError }}</div>
              <div v-if="opensslCmd" class="openssl-hint">
                <n-divider style="margin: 8px 0" />
                <n-text depth="3">{{ t('other.certParser.opensslHint') }}</n-text>
                <n-input
                  :value="opensslCmd"
                  readonly
                  size="small"
                  class="openssl-cmd"
                />
                <n-button size="tiny" quaternary @click="copyOpensslCmd">{{ t('common.copy') }}</n-button>
              </div>
            </n-alert>
          </n-tab-pane>
        </n-tabs>

        <!-- 操作按钮 -->
        <n-space>
          <n-button type="primary" :disabled="!pemText.trim()" @click="parseCert">
            {{ t('other.certParser.parse') }}
          </n-button>
          <n-button @click="clearAll">{{ t('common.clear') }}</n-button>
          <n-button v-if="certInfo" @click="copyInfo" quaternary>{{ t('common.copy') }}</n-button>
        </n-space>

        <!-- 错误提示 -->
        <n-alert v-if="parseError" type="error">{{ parseError }}</n-alert>

        <!-- 证书信息展示 -->
        <div v-if="certInfo" class="cert-result">

          <!-- 过期状态 banner -->
          <n-alert
            :type="certInfo.isExpired ? 'error' : certInfo.expireSoon ? 'warning' : 'success'"
            class="expiry-banner"
          >
            <span v-if="certInfo.isExpired">{{ t('other.certParser.expired') }}</span>
            <span v-else-if="certInfo.expireSoon">
              {{ t('other.certParser.expireSoon', { days: certInfo.daysRemaining }) }}
            </span>
            <span v-else>
              {{ t('other.certParser.validFor', { days: certInfo.daysRemaining }) }}
            </span>
          </n-alert>

          <!-- 详细信息表格 -->
          <n-descriptions bordered :column="1" size="small" class="cert-table">
            <!-- 基本信息 -->
            <n-descriptions-item :label="t('other.certParser.subject')">
              <n-text code>{{ certInfo.subject }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('other.certParser.issuer')">
              {{ certInfo.issuer }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('other.certParser.serialNumber')">
              <n-text code>{{ certInfo.serialNumber }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('other.certParser.version')">
              {{ certInfo.version }}
            </n-descriptions-item>

            <!-- 有效期 -->
            <n-descriptions-item :label="t('other.certParser.validFrom')">
              <n-text :type="certInfo.isExpired ? 'error' : 'default'">{{ certInfo.validFrom }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('other.certParser.validTo')">
              <n-text :type="certInfo.isExpired ? 'error' : certInfo.expireSoon ? 'warning' : 'success'">
                {{ certInfo.validTo }}
              </n-text>
            </n-descriptions-item>

            <!-- 算法 -->
            <n-descriptions-item :label="t('other.certParser.signatureAlgorithm')">
              {{ certInfo.signatureAlgorithm }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('other.certParser.publicKeyAlgorithm')">
              {{ certInfo.publicKeyAlgorithm }}
            </n-descriptions-item>
            <n-descriptions-item v-if="certInfo.keySize" :label="t('other.certParser.keySize')">
              {{ certInfo.keySize }} bits
            </n-descriptions-item>

            <!-- SAN -->
            <n-descriptions-item v-if="certInfo.san?.length" :label="t('other.certParser.san')">
              <n-space wrap>
                <n-tag v-for="name in certInfo.san" :key="name" size="small" type="info">{{ name }}</n-tag>
              </n-space>
            </n-descriptions-item>

            <!-- 用途 -->
            <n-descriptions-item v-if="certInfo.keyUsage" :label="t('other.certParser.keyUsage')">
              {{ certInfo.keyUsage }}
            </n-descriptions-item>
            <n-descriptions-item v-if="certInfo.extKeyUsage" :label="t('other.certParser.extKeyUsage')">
              {{ certInfo.extKeyUsage }}
            </n-descriptions-item>

            <!-- 指纹 -->
            <n-descriptions-item :label="t('other.certParser.thumbprintSha1')">
              <n-text code>{{ certInfo.thumbprintSha1 }}</n-text>
            </n-descriptions-item>
            <n-descriptions-item :label="t('other.certParser.thumbprintSha256')">
              <n-text code>{{ certInfo.thumbprintSha256 }}</n-text>
            </n-descriptions-item>
          </n-descriptions>
        </div>

        <!-- 说明 -->
        <n-alert type="info" :title="t('other.certParser.noteTitle')">
          {{ t('other.certParser.noteContent') }}
        </n-alert>

      </n-space>
    </n-card>
    <TutorialAndDocs toolKey="certParser" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'

const { t } = useI18n()
const message = useMessage()

const inputMode = ref('pem')
const pemText = ref('')
const domainInput = ref('')
const fetching = ref(false)
const fetchError = ref('')
const opensslCmd = ref('')
const parseError = ref('')
const certInfo = ref(null)

// ── 工具函数：ASN.1 DER 解码 ────────────────────────────────

// 将 PEM 转为 DER (Uint8Array)
const pemToDer = (pem) => {
  const b64 = pem
    .replace(/-----BEGIN [A-Z ]+-----/g, '')
    .replace(/-----END [A-Z ]+-----/g, '')
    .replace(/\s+/g, '')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

// 读取 ASN.1 TLV 节点
const readTlv = (buf, offset) => {
  let tag = buf[offset++]
  // 长格式 tag
  if ((tag & 0x1f) === 0x1f) {
    while (buf[offset++] & 0x80) { /* skip */ }
  }
  let len = buf[offset++]
  if (len & 0x80) {
    const lenBytes = len & 0x7f
    len = 0
    for (let i = 0; i < lenBytes; i++) len = (len << 8) | buf[offset++]
  }
  return { tag, len, valueStart: offset, end: offset + len }
}

// 遍历 SEQUENCE 的子元素
const iterSeq = function* (buf, start, end) {
  let pos = start
  while (pos < end) {
    const node = readTlv(buf, pos)
    yield node
    pos = node.end
  }
}

// 读取 OID 字节序列 → 点分十进制
const readOid = (buf, start, end) => {
  const bytes = buf.slice(start, end)
  const parts = []
  let val = 0
  for (let i = 0; i < bytes.length; i++) {
    val = (val << 7) | (bytes[i] & 0x7f)
    if (!(bytes[i] & 0x80)) {
      if (parts.length === 0) {
        parts.push(Math.floor(val / 40))
        parts.push(val % 40)
      } else {
        parts.push(val)
      }
      val = 0
    }
  }
  return parts.join('.')
}

// 读取 ASN.1 INTEGER → hex string
const readInt = (buf, start, end) => {
  return Array.from(buf.slice(start, end)).map(b => b.toString(16).padStart(2, '0')).join(':')
}

// 读取 UTF8String / PrintableString / IA5String / BMPString
const readString = (buf, start, end, tag) => {
  if (tag === 0x1e) { // BMPString - UTF-16 BE
    const bytes = buf.slice(start, end)
    let s = ''
    for (let i = 0; i < bytes.length - 1; i += 2) {
      s += String.fromCharCode((bytes[i] << 8) | bytes[i + 1])
    }
    return s
  }
  return new TextDecoder().decode(buf.slice(start, end))
}

// 读取 GeneralizedTime / UTCTime
const readTime = (buf, start, end, tag) => {
  const str = new TextDecoder().decode(buf.slice(start, end))
  if (tag === 0x18) { // GeneralizedTime: YYYYMMDDHHMMSSZ
    return new Date(`${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}T${str.slice(8, 10)}:${str.slice(10, 12)}:${str.slice(12, 14)}Z`)
  }
  // UTCTime: YYMMDDHHMMSSZ
  const year = parseInt(str.slice(0, 2))
  const fullYear = year >= 50 ? 1900 + year : 2000 + year
  return new Date(`${fullYear}-${str.slice(2, 4)}-${str.slice(4, 6)}T${str.slice(6, 8)}:${str.slice(8, 10)}:${str.slice(10, 12)}Z`)
}

// OID 到算法名称映射
const OID_MAP = {
  '1.2.840.113549.1.1.1': 'RSA',
  '1.2.840.113549.1.1.5': 'SHA1withRSA',
  '1.2.840.113549.1.1.11': 'SHA256withRSA',
  '1.2.840.113549.1.1.12': 'SHA384withRSA',
  '1.2.840.113549.1.1.13': 'SHA512withRSA',
  '1.2.840.10040.4.3': 'SHA1withDSA',
  '1.2.840.10045.4.3.1': 'SHA224withECDSA',
  '1.2.840.10045.4.3.2': 'SHA256withECDSA',
  '1.2.840.10045.4.3.3': 'SHA384withECDSA',
  '1.2.840.10045.4.3.4': 'SHA512withECDSA',
  '1.2.840.10045.2.1': 'EC',
  '1.3.101.110': 'X25519',
  '1.3.101.112': 'Ed25519',
  // RDN
  '2.5.4.3': 'CN',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '2.5.4.12': 'T',
  '1.2.840.113549.1.9.1': 'emailAddress',
  // SAN
  '2.5.29.17': 'subjectAltName',
  '2.5.29.15': 'keyUsage',
  '2.5.29.37': 'extKeyUsage',
  // EKU
  '1.3.6.1.5.5.7.3.1': 'TLS Web Server Authentication',
  '1.3.6.1.5.5.7.3.2': 'TLS Web Client Authentication',
  '1.3.6.1.5.5.7.3.3': 'Code Signing',
  '1.3.6.1.5.5.7.3.4': 'Email Protection',
  '1.3.6.1.5.5.7.3.8': 'Timestamping',
}

const KEY_USAGE_BITS = ['Digital Signature', 'Non Repudiation', 'Key Encipherment', 'Data Encipherment', 'Key Agreement', 'Key Cert Sign', 'CRL Sign', 'Encipher Only', 'Decipher Only']

// 解析 RDN（相对可分辨名称）
const parseRdn = (buf, start, end) => {
  const parts = []
  for (const rdnSet of iterSeq(buf, start, end)) {
    for (const rdnSeq of iterSeq(buf, rdnSet.valueStart, rdnSet.end)) {
      const children = [...iterSeq(buf, rdnSeq.valueStart, rdnSeq.end)]
      if (children.length < 2) continue
      const oidNode = children[0]
      const valNode = children[1]
      const oid = readOid(buf, oidNode.valueStart, oidNode.end)
      const attrName = OID_MAP[oid] || oid
      const val = readString(buf, valNode.valueStart, valNode.end, valNode.tag)
      parts.push(`${attrName}=${val}`)
    }
  }
  return parts.join(', ')
}

// 计算 SHA 指纹
const calcFingerprint = async (der, algo) => {
  const digest = await crypto.subtle.digest(algo, der)
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join(':')
}

// ── 主解析函数 ────────────────────────────────
const parsePem = async (pem) => {
  const der = pemToDer(pem)

  // Certificate ::= SEQUENCE { tbsCertificate, signatureAlgorithm, signature }
  const certSeq = readTlv(der, 0)
  const [tbs, sigAlgNode] = [...iterSeq(der, certSeq.valueStart, certSeq.end)]

  const tbsChildren = [...iterSeq(der, tbs.valueStart, tbs.end)]
  let idx = 0

  // version [0] EXPLICIT (optional)
  let version = 'v1'
  if (tbsChildren[idx].tag === 0xa0) {
    const vNode = readTlv(der, tbsChildren[idx].valueStart)
    version = `v${der[vNode.valueStart] + 1}`
    idx++
  }

  // serialNumber
  const serialNode = tbsChildren[idx++]
  const serialNumber = readInt(der, serialNode.valueStart, serialNode.end).replace(/^00:/, '')

  // signature algorithm (in TBS) - 跳过，外层已解析
  idx++

  // issuer
  const issuerNode = tbsChildren[idx++]
  const issuer = parseRdn(der, issuerNode.valueStart, issuerNode.end)

  // validity
  const validityNode = tbsChildren[idx++]
  const validityChildren = [...iterSeq(der, validityNode.valueStart, validityNode.end)]
  const validFrom = readTime(der, validityChildren[0].valueStart, validityChildren[0].end, validityChildren[0].tag)
  const validTo = readTime(der, validityChildren[1].valueStart, validityChildren[1].end, validityChildren[1].tag)

  // subject
  const subjectNode = tbsChildren[idx++]
  const subject = parseRdn(der, subjectNode.valueStart, subjectNode.end)

  // subjectPublicKeyInfo
  const spkiNode = tbsChildren[idx++]
  const spkiChildren = [...iterSeq(der, spkiNode.valueStart, spkiNode.end)]
  let publicKeyAlgorithm = 'Unknown'
  let keySize = null
  if (spkiChildren.length >= 1) {
    const algChildren = [...iterSeq(der, spkiChildren[0].valueStart, spkiChildren[0].end)]
    if (algChildren.length >= 1) {
      const oid = readOid(der, algChildren[0].valueStart, algChildren[0].end)
      publicKeyAlgorithm = OID_MAP[oid] || oid
    }
  }
  // RSA key size = BIT STRING 中嵌套 SEQUENCE 的第一个 INTEGER 的位长
  if (publicKeyAlgorithm === 'RSA' && spkiChildren.length >= 2) {
    try {
      const bitStringContent = spkiChildren[1]
      // BIT STRING 内容前有一个字节表示未使用位数
      const innerSeq = readTlv(der, bitStringContent.valueStart + 1)
      const rsaInner = [...iterSeq(der, innerSeq.valueStart, innerSeq.end)]
      if (rsaInner.length >= 1) {
        keySize = (rsaInner[0].end - rsaInner[0].valueStart - 1) * 8
      }
    } catch { /* ignore */ }
  }

  // signatureAlgorithm (outer)
  const sigAlgChildren = [...iterSeq(der, sigAlgNode.valueStart, sigAlgNode.end)]
  let signatureAlgorithm = 'Unknown'
  if (sigAlgChildren.length >= 1) {
    const oid = readOid(der, sigAlgChildren[0].valueStart, sigAlgChildren[0].end)
    signatureAlgorithm = OID_MAP[oid] || oid
  }

  // extensions [3]
  let san = []
  let keyUsage = ''
  let extKeyUsage = ''
  for (const node of tbsChildren.slice(idx)) {
    if (node.tag === 0xa3) {
      // 扩展是一个 SEQUENCE of Extension
      for (const extSeq of iterSeq(der, node.valueStart, node.end)) {
        for (const ext of iterSeq(der, extSeq.valueStart, extSeq.end)) {
          // 每个 extension: SEQUENCE { oid, [critical], OCTET STRING }
          const extChildren = [...iterSeq(der, ext.valueStart, ext.end)]
          if (extChildren.length < 2) continue
          const oid = readOid(der, extChildren[0].valueStart, extChildren[0].end)
          // 找到 OCTET STRING（tag 0x04）
          const octetNode = extChildren.find(c => c.tag === 0x04) || extChildren[extChildren.length - 1]
          if (!octetNode) continue

          if (oid === '2.5.29.17') { // SAN
            try {
              const sanSeq = readTlv(der, octetNode.valueStart)
              for (const sanEntry of iterSeq(der, sanSeq.valueStart, sanSeq.end)) {
                if ((sanEntry.tag & 0x1f) === 2) { // dNSName
                  san.push(new TextDecoder().decode(der.slice(sanEntry.valueStart, sanEntry.end)))
                } else if ((sanEntry.tag & 0x1f) === 7) { // iPAddress
                  const ip = der.slice(sanEntry.valueStart, sanEntry.end)
                  if (ip.length === 4) san.push(ip.join('.'))
                  else if (ip.length === 16) {
                    san.push(Array.from({ length: 8 }, (_, i) => ((ip[i * 2] << 8) | ip[i * 2 + 1]).toString(16)).join(':'))
                  }
                }
              }
            } catch { /* ignore */ }
          } else if (oid === '2.5.29.15') { // Key Usage
            try {
              const bitSeq = readTlv(der, octetNode.valueStart)
              const bitStr = readTlv(der, bitSeq.valueStart)
              // BIT STRING: 第一字节是 unusedBits（未使用的低位数），后面是实际位图
              const unusedBits = der[bitStr.valueStart]
              const usageByte = der[bitStr.valueStart + 1]
              const usageByte2 = der[bitStr.valueStart + 2] ?? 0 // 某些证书有9位用途
              const bits = []
              for (let i = 0; i < 8; i++) {
                if (usageByte & (0x80 >> i)) bits.push(KEY_USAGE_BITS[i])
              }
              // 第9位（Decipher Only）在第二个字节的最高位
              if (usageByte2 & 0x80) bits.push(KEY_USAGE_BITS[8])
              // 根据 unusedBits 移除末尾无效位（一般不影响常见证书）
              void unusedBits
              keyUsage = bits.join(', ')
            } catch { /* ignore */ }
          } else if (oid === '2.5.29.37') { // Extended Key Usage
            try {
              const ekuSeq = readTlv(der, octetNode.valueStart)
              const ekuInner = readTlv(der, ekuSeq.valueStart)
              const ekuNames = []
              for (const ekuOidNode of iterSeq(der, ekuInner.valueStart, ekuInner.end)) {
                const ekuOid = readOid(der, ekuOidNode.valueStart, ekuOidNode.end)
                ekuNames.push(OID_MAP[ekuOid] || ekuOid)
              }
              extKeyUsage = ekuNames.join(', ')
            } catch { /* ignore */ }
          }
        }
      }
    }
  }

  // 计算指纹
  const [thumbprintSha1, thumbprintSha256] = await Promise.all([
    calcFingerprint(der, 'SHA-1'),
    calcFingerprint(der, 'SHA-256')
  ])

  const now = new Date()
  const isExpired = validTo < now
  const daysRemaining = Math.ceil((validTo - now) / (1000 * 60 * 60 * 24))
  const expireSoon = !isExpired && daysRemaining <= 30

  const fmt = (d) => d.toLocaleString()

  return {
    subject,
    issuer,
    serialNumber,
    version,
    validFrom: fmt(validFrom),
    validTo: fmt(validTo),
    signatureAlgorithm,
    publicKeyAlgorithm,
    keySize,
    san,
    keyUsage,
    extKeyUsage,
    thumbprintSha1,
    thumbprintSha256,
    isExpired,
    expireSoon,
    daysRemaining
  }
}

// ── 操作 ────────────────────────────────

const parseCert = async () => {
  parseError.value = ''
  certInfo.value = null
  try {
    certInfo.value = await parsePem(pemText.value.trim())
  } catch (e) {
    parseError.value = t('other.certParser.parseError') + ': ' + (e.message || String(e))
  }
}

const handleFileUpload = ({ file }) => {
  const raw = file.file
  if (!raw) return
  const reader = new FileReader()
  reader.onload = (e) => {
    pemText.value = e.target.result
    autoParse()
  }
  reader.readAsText(raw)
}

const autoParse = () => {
  const text = pemText.value.trim()
  if (text.includes('-----BEGIN CERTIFICATE-----')) {
    parseCert()
  }
}

// 带超时的 fetch 封装
const fetchWithTimeout = (url, timeoutMs = 10000) => {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer))
}

// 通过 crt.sh API 获取域名证书（公共 CT 日志）
const fetchCert = async () => {
  const domain = domainInput.value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  if (!domain) {
    fetchError.value = t('other.certParser.domainRequired')
    return
  }
  fetchError.value = ''
  fetching.value = true
  certInfo.value = null
  parseError.value = ''
  try {
    // 使用 crt.sh JSON API 获取最新证书，10s 超时
    let res
    const cmd = `openssl s_client -connect ${domain}:443 </dev/null 2>/dev/null | openssl x509 -outform PEM`
    try {
      res = await fetchWithTimeout(`https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`, 10000)
    } catch (e) {
      opensslCmd.value = cmd
      fetchError.value = e.name === 'AbortError'
        ? t('other.certParser.fetchTimeout')
        : t('other.certParser.fetchNetworkError')
      return
    }
    if (!res.ok) {
      opensslCmd.value = cmd
      fetchError.value = t('other.certParser.fetchNetworkError')
      return
    }
    const data = await res.json()
    if (!data || data.length === 0) {
      fetchError.value = t('other.certParser.noResult')
      return
    }
    // 取最新的一条，再获取其 PEM
    const certId = data[0].id
    let pemRes
    try {
      pemRes = await fetchWithTimeout(`https://crt.sh/?d=${certId}`, 10000)
    } catch (e) {
      opensslCmd.value = cmd
      fetchError.value = t('other.certParser.fetchNetworkError')
      return
    }
    if (!pemRes.ok) throw new Error(`HTTP ${pemRes.status}`)
    const pemData = await pemRes.text()
    pemText.value = pemData
    certInfo.value = await parsePem(pemData.trim())
  } catch (e) {
    fetchError.value = t('other.certParser.fetchError') + ': ' + (e.message || String(e))
  } finally {
    fetching.value = false
  }
}

const copyOpensslCmd = () => {
  if (!opensslCmd.value) return
  navigator.clipboard.writeText(opensslCmd.value).then(() => message.success(t('common.copySuccess')))
}

const clearAll = () => {
  pemText.value = ''
  domainInput.value = ''
  certInfo.value = null
  parseError.value = ''
  fetchError.value = ''
  opensslCmd.value = ''
}

const copyInfo = () => {
  if (!certInfo.value) return
  const lines = [
    `Subject: ${certInfo.value.subject}`,
    `Issuer: ${certInfo.value.issuer}`,
    `Serial: ${certInfo.value.serialNumber}`,
    `Valid From: ${certInfo.value.validFrom}`,
    `Valid To: ${certInfo.value.validTo}`,
    `Signature Algorithm: ${certInfo.value.signatureAlgorithm}`,
    `Public Key: ${certInfo.value.publicKeyAlgorithm}${certInfo.value.keySize ? ' ' + certInfo.value.keySize + ' bits' : ''}`,
    certInfo.value.san?.length ? `SAN: ${certInfo.value.san.join(', ')}` : '',
    certInfo.value.keyUsage ? `Key Usage: ${certInfo.value.keyUsage}` : '',
    certInfo.value.extKeyUsage ? `Extended Key Usage: ${certInfo.value.extKeyUsage}` : '',
    `SHA-1: ${certInfo.value.thumbprintSha1}`,
    `SHA-256: ${certInfo.value.thumbprintSha256}`
  ].filter(Boolean).join('\n')
  navigator.clipboard.writeText(lines).then(() => message.success(t('common.copySuccess')))
}
</script>

<style scoped>
.cert-parser-tool {
  max-width: 960px;
  margin: 20px auto;
  padding: 0 20px;
}

.domain-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.domain-row :first-child {
  flex: 1;
}

.fetch-error {
  margin-top: 8px;
}

.openssl-hint {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}

.openssl-cmd {
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 12px;
}

.cert-result {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expiry-banner {
  font-weight: 500;
}

.cert-table {
  margin-top: 4px;
}

@media (max-width: 768px) {
  .cert-parser-tool {
    padding: 0 12px;
  }
  .domain-row {
    flex-wrap: wrap;
  }
}
</style>


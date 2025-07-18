<template>
  <div class="argon2-hash">
    <n-card :title="t('encrypt.argon2.title')">
      <!-- 输入区域 -->
      <div class="input-section">
        <n-text>{{ t('encrypt.argon2.input') }}</n-text>
        <n-input 
          v-model:value="input" 
          type="textarea" 
          :placeholder="t('encrypt.argon2.inputPlaceholder')"
          :autosize="{ minRows: 8, maxRows: 15 }" 
        />
        <div class="input-info">
          <n-text depth="3">{{ t('encrypt.argon2.charCount', { count: input.length }) }}</n-text>
        </div>
      </div>

      <!-- 参数配置 -->
      <div class="options-section">
        <n-form :model="formData" label-placement="left" label-width="auto">
          <n-form-item :label="t('encrypt.argon2.type')">
            <n-select 
              v-model:value="formData.type" 
              :options="typeOptions"
              :placeholder="t('encrypt.argon2.typePlaceholder')" 
            />
            <n-text depth="3" class="param-info">
              {{ t('encrypt.argon2.typeInfo') }}
            </n-text>
          </n-form-item>

          <n-form-item :label="t('encrypt.argon2.iterations')">
            <n-input-number 
              v-model:value="formData.iterations" 
              :min="1" 
              :max="1000000" 
              :placeholder="t('encrypt.argon2.iterationsPlaceholder')"
            />
            <n-text depth="3" class="param-info">
              {{ t('encrypt.argon2.iterationsInfo') }}
            </n-text>
          </n-form-item>

          <n-form-item :label="t('encrypt.argon2.keyLength')">
            <n-input-number 
              v-model:value="formData.keyLength" 
              :min="1" 
              :max="64" 
              :placeholder="t('encrypt.argon2.keyLengthPlaceholder')"
            />
            <n-text depth="3" class="param-info">
              {{ t('encrypt.argon2.keyLengthInfo') }}
            </n-text>
          </n-form-item>

          <n-form-item :label="t('encrypt.argon2.algorithm')">
            <n-select 
              v-model:value="formData.algorithm" 
              :options="algorithmOptions"
              :placeholder="t('encrypt.argon2.algorithmPlaceholder')" 
            />
            <n-text depth="3" class="param-info">
              {{ t('encrypt.argon2.algorithmInfo') }}
            </n-text>
          </n-form-item>
        </n-form>
      </div>

      <!-- 操作按钮 -->
      <div class="button-group">
        <n-button @click="hash" type="primary" :disabled="!input.trim()" :loading="isHashing">
          {{ t('encrypt.argon2.hash') }}
        </n-button>
        <n-button @click="copyToClipboard" :disabled="!output">
          {{ t('common.copy') }}
        </n-button>
        <n-button @click="clearAll">
          {{ t('common.clear') }}
        </n-button>
      </div>

      <!-- 输出区域 -->
      <div class="output-section">
        <n-text>{{ t('encrypt.argon2.output') }}</n-text>
        <n-input 
          v-model:value="output" 
          type="textarea" 
          :placeholder="t('encrypt.argon2.outputPlaceholder')"
          :autosize="{ minRows: 8, maxRows: 15 }" 
          readonly 
        />
        <div class="output-info" v-if="output">
          <n-text depth="3">{{ t('encrypt.argon2.length') }}：{{ output.length }} {{ t('encrypt.argon2.characters') }}</n-text>
        </div>
      </div>

      <!-- 验证区域 -->
      <div class="verify-section">
        <n-text>{{ t('encrypt.argon2.verify') }}</n-text>
        <n-input 
          v-model:value="verifyHash" 
          type="textarea" 
          :placeholder="t('encrypt.argon2.verifyPlaceholder')"
          :autosize="{ minRows: 4, maxRows: 8 }" 
        />
        <div class="button-group">
          <n-button @click="verify" type="info" :disabled="!input.trim() || !verifyHash.trim()" :loading="isVerifying">
            {{ t('encrypt.argon2.verify') }}
          </n-button>
        </div>
      </div>

      <!-- 错误提示 -->
      <n-alert v-if="error" type="error" :title="t('common.error')" class="error-alert">
        {{ error }}
      </n-alert>
    </n-card>
    
    <!-- 工具描述组件 -->
    <ToolDescription tool-key="argon2" />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
// 导入工具描述组件
import ToolDescription from '@/components/common/ToolDescription.vue'

const { t } = useI18n()
const message = useMessage()

// 响应式数据
const input = ref('')
const output = ref('')
const verifyHash = ref('')
const error = ref('')
const isHashing = ref(false)
const isVerifying = ref(false)

const formData = reactive({
  type: 'pbkdf2',
  iterations: 100000,
  keyLength: 32,
  algorithm: 'SHA-256'
})

// 哈希算法选项 - 使用computed确保i18n正确工作
const typeOptions = computed(() => [
  { label: `PBKDF2 (${t('encrypt.argon2.recommended')})`, value: 'pbkdf2' },
  { label: 'SHA-256', value: 'sha256' },
  { label: 'SHA-512', value: 'sha512' }
])

// 哈希算法选项
const algorithmOptions = [
  { label: 'SHA-256', value: 'SHA-256' },
  { label: 'SHA-512', value: 'SHA-512' }
]

// 生成随机盐值
const generateSalt = () => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// 将字符串转换为ArrayBuffer
const stringToArrayBuffer = (str) => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

// 将ArrayBuffer转换为十六进制字符串
const arrayBufferToHex = (buffer) => {
  return Array.from(new Uint8Array(buffer), byte => byte.toString(16).padStart(2, '0')).join('');
};

// 将十六进制字符串转换为ArrayBuffer
const hexToArrayBuffer = (hex) => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes.buffer;
};

// 计算哈希
const hash = async () => {
  try {
    if (!input.value.trim()) {
      error.value = t('encrypt.argon2.inputRequired')
      return
    }

    isHashing.value = true
    error.value = ''

    const password = input.value;
    const salt = generateSalt();
    let hashResult = '';

    if (formData.type === 'pbkdf2') {
      // 使用PBKDF2
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        stringToArrayBuffer(password),
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: stringToArrayBuffer(salt),
          iterations: formData.iterations,
          hash: formData.algorithm
        },
        keyMaterial,
        formData.keyLength * 8
      );

      hashResult = arrayBufferToHex(derivedBits);
    } else {
      // 使用SHA-256或SHA-512
      const hashBuffer = await crypto.subtle.digest(
        formData.algorithm,
        stringToArrayBuffer(password + salt)
      );
      hashResult = arrayBufferToHex(hashBuffer);
    }

    // 格式：algorithm:iterations:salt:hash
    output.value = `${formData.type}:${formData.iterations}:${salt}:${hashResult}`;
    message.success(t('encrypt.argon2.hashSuccess'));
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isHashing.value = false
  }
}

// 验证哈希
const verify = async () => {
  try {
    if (!input.value.trim() || !verifyHash.value.trim()) {
      error.value = t('encrypt.argon2.bothInputsRequired')
      return
    }

    isVerifying.value = true
    error.value = ''

    const password = input.value;
    const parts = verifyHash.value.split(':');
    
    if (parts.length !== 4) {
      message.error(t('encrypt.argon2.invalidHashFormat'));
      return;
    }

    const [algorithm, iterations, salt, storedHash] = parts;
    let computedHash = '';

    if (algorithm === 'pbkdf2') {
      // 使用PBKDF2验证
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        stringToArrayBuffer(password),
        'PBKDF2',
        false,
        ['deriveBits']
      );

      const derivedBits = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: stringToArrayBuffer(salt),
          iterations: parseInt(iterations),
          hash: formData.algorithm
        },
        keyMaterial,
        formData.keyLength * 8
      );

      computedHash = arrayBufferToHex(derivedBits);
    } else {
      // 使用SHA验证
      const hashBuffer = await crypto.subtle.digest(
        algorithm,
        stringToArrayBuffer(password + salt)
      );
      computedHash = arrayBufferToHex(hashBuffer);
    }
    
    if (computedHash === storedHash) {
      message.success(t('encrypt.argon2.verificationSuccess'))
    } else {
      message.error(t('encrypt.argon2.verificationFailed'))
    }
  } catch (e) {
    error.value = e.message
    message.error(t('common.error'))
  } finally {
    isVerifying.value = false
  }
}

// 复制到剪贴板
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(output.value)
    message.success(t('encrypt.argon2.copySuccess'))
  } catch (e) {
    message.error(t('encrypt.argon2.copyError'))
  }
}

// 清空所有
const clearAll = () => {
  input.value = ''
  output.value = ''
  verifyHash.value = ''
  error.value = ''
  message.success(t('common.clear') + ' ' + t('common.success'))
}
</script>

<style scoped>
.argon2-hash {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.input-section {
  margin-bottom: 20px;
}

.input-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.input-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.options-section {
  margin-bottom: 20px;
}

.param-info {
  display: block;
  margin-top: 4px;
  font-size: 12px;
}

.button-group {
  margin: 20px 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.output-section {
  margin: 20px 0;
}

.output-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.output-info {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.verify-section {
  margin: 20px 0;
}

.verify-section .n-text {
  display: block;
  margin-bottom: 8px;
}

.error-alert {
  margin-top: 16px;
}
</style>
<template>
  <div class="hash-generator">
    <n-card :title="t('tools.hashGenerator.title')">
      <n-form>
        <n-form-item :label="t('tools.hashGenerator.input')">
          <n-input
            v-model:value="input"
            type="textarea"
            :placeholder="t('tools.hashGenerator.inputPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </n-form-item>
        <n-form-item :label="t('tools.hashGenerator.algorithm')">
          <n-select
            v-model:value="algorithm"
            :options="algorithmOptions"
            :placeholder="t('tools.hashGenerator.algorithmPlaceholder')"
          />
        </n-form-item>
        <n-form-item v-if="algorithm === 'bcrypt'">
          <n-input-number
            v-model:value="bcryptRounds"
            :min="4"
            :max="31"
            :placeholder="t('tools.hashGenerator.bcryptRoundsPlaceholder')"
          />
        </n-form-item>
        <n-form-item v-if="algorithm === 'argon2'">
          <n-select
            v-model:value="argon2Type"
            :options="argon2TypeOptions"
            :placeholder="t('tools.hashGenerator.argon2TypePlaceholder')"
          />
          <n-input-number
            v-model:value="argon2Memory"
            :min="1024"
            :max="65536"
            :step="1024"
            :placeholder="t('tools.hashGenerator.argon2MemoryPlaceholder')"
          />
          <n-input-number
            v-model:value="argon2Parallelism"
            :min="1"
            :max="16"
            :placeholder="t('tools.hashGenerator.argon2ParallelismPlaceholder')"
          />
          <n-input-number
            v-model:value="argon2Iterations"
            :min="1"
            :max="100"
            :placeholder="t('tools.hashGenerator.argon2IterationsPlaceholder')"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="generateHash">
            {{ t('tools.hashGenerator.generate') }}
          </n-button>
        </n-form-item>
        <n-form-item :label="t('tools.hashGenerator.result')">
          <n-input
            v-model:value="result"
            type="textarea"
            :placeholder="t('tools.hashGenerator.resultPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
            readonly
          />
        </n-form-item>
      </n-form>

      <div class="btn-group">
        <n-button @click="copyResult">{{ t('common.copy') }}</n-button>
        <n-button @click="clearInput">{{ t('common.clear') }}</n-button>
      </div>
      <n-alert v-if="copySuccess" type="success" class="copy-tip">{{ t('common.copySuccess') }}</n-alert>
      <n-alert v-if="error" type="error" class="error-tip">{{ error }}</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@vueuse/core';
import { createHash } from 'crypto';
import * as bcrypt from 'bcryptjs';
import * as argon2 from 'argon2';

const { t } = useI18n();
const { copy } = useClipboard();

const input = ref('');
const algorithm = ref('sha256');
const result = ref('');
const error = ref('');
const copySuccess = ref(false);

// Bcrypt 参数
const bcryptRounds = ref(10);

// Argon2 参数
const argon2Type = ref('argon2id');
const argon2Memory = ref(4096);
const argon2Parallelism = ref(4);
const argon2Iterations = ref(3);

const algorithmOptions = [
  { label: 'SHA-1', value: 'sha1' },
  { label: 'SHA-256', value: 'sha256' },
  { label: 'SHA-512', value: 'sha512' },
  { label: 'Bcrypt', value: 'bcrypt' },
  { label: 'Argon2', value: 'argon2' }
];

const argon2TypeOptions = [
  { label: 'Argon2d', value: 'argon2d' },
  { label: 'Argon2i', value: 'argon2i' },
  { label: 'Argon2id', value: 'argon2id' }
];

async function generateHash() {
  try {
    error.value = '';
    if (!input.value) {
      throw new Error(t('tools.hashGenerator.inputRequired'));
    }

    switch (algorithm.value) {
      case 'sha1':
      case 'sha256':
      case 'sha512':
        const hash = createHash(algorithm.value);
        hash.update(input.value);
        result.value = hash.digest('hex');
        break;
      case 'bcrypt':
        const salt = await bcrypt.genSalt(bcryptRounds.value);
        result.value = await bcrypt.hash(input.value, salt);
        break;
      case 'argon2':
        result.value = await argon2.hash(input.value, {
          type: argon2.argon2id,
          memoryCost: argon2Memory.value,
          parallelism: argon2Parallelism.value,
          timeCost: argon2Iterations.value
        });
        break;
      default:
        throw new Error(t('tools.hashGenerator.invalidAlgorithm'));
    }
  } catch (e) {
    error.value = e.message;
  }
}

function copyResult() {
  if (result.value) {
    copy(result.value);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function clearInput() {
  input.value = '';
  result.value = '';
  error.value = '';
}
</script>

<style scoped>
.hash-generator {
  max-width: 800px;
  margin: 0 auto;
}
.btn-group {
  display: flex;
  gap: 12px;
  margin: 16px 0;
}
.copy-tip,
.error-tip {
  margin-top: 8px;
}
</style> 
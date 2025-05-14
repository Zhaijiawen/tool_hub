<template>
  <div class="number-converter">
    <n-card :title="t('tools.numberConverter.title')">
      <n-tabs type="line" animated>
        <!-- 科学计数法转普通数值 -->
        <n-tab-pane :name="1" :tab="t('tools.numberConverter.scientificToNormal')">
          <n-form>
            <n-form-item :label="t('tools.numberConverter.input')">
              <n-input
                v-model:value="scientificInput"
                :placeholder="t('tools.numberConverter.scientificPlaceholder')"
                @update:value="convertScientificToNormal"
              />
            </n-form-item>
            <n-form-item :label="t('tools.numberConverter.result')">
              <n-input
                v-model:value="scientificResult"
                :placeholder="t('tools.numberConverter.resultPlaceholder')"
                readonly
              />
            </n-form-item>
          </n-form>
          <div class="btn-group">
            <n-button @click="copyScientificResult">{{ t('common.copy') }}</n-button>
            <n-button @click="clearScientificInput">{{ t('common.clear') }}</n-button>
          </div>
        </n-tab-pane>

        <!-- 普通数值转科学计数法 -->
        <n-tab-pane :name="2" :tab="t('tools.numberConverter.normalToScientific')">
          <n-form>
            <n-form-item :label="t('tools.numberConverter.input')">
              <n-input
                v-model:value="normalInput"
                :placeholder="t('tools.numberConverter.normalPlaceholder')"
                @update:value="convertNormalToScientific"
              />
            </n-form-item>
            <n-form-item :label="t('tools.numberConverter.result')">
              <n-input
                v-model:value="normalResult"
                :placeholder="t('tools.numberConverter.resultPlaceholder')"
                readonly
              />
            </n-form-item>
          </n-form>
          <div class="btn-group">
            <n-button @click="copyNormalResult">{{ t('common.copy') }}</n-button>
            <n-button @click="clearNormalInput">{{ t('common.clear') }}</n-button>
          </div>
        </n-tab-pane>
      </n-tabs>

      <n-alert v-if="copySuccess" type="success" class="copy-tip">{{ t('common.copySuccess') }}</n-alert>
      <n-alert v-if="error" type="error" class="error-tip">{{ error }}</n-alert>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@vueuse/core';

const { t } = useI18n();
const { copy } = useClipboard();

const scientificInput = ref('');
const scientificResult = ref('');
const normalInput = ref('');
const normalResult = ref('');
const error = ref('');
const copySuccess = ref(false);

function convertScientificToNormal() {
  try {
    error.value = '';
    if (!scientificInput.value) {
      scientificResult.value = '';
      return;
    }

    // 验证科学计数法格式
    if (!/^-?\d+(\.\d+)?[eE][-+]?\d+$/.test(scientificInput.value)) {
      throw new Error(t('tools.numberConverter.invalidScientific'));
    }

    const num = Number(scientificInput.value);
    if (isNaN(num)) {
      throw new Error(t('tools.numberConverter.invalidNumber'));
    }

    scientificResult.value = num.toString();
  } catch (e) {
    error.value = e.message;
    scientificResult.value = '';
  }
}

function convertNormalToScientific() {
  try {
    error.value = '';
    if (!normalInput.value) {
      normalResult.value = '';
      return;
    }

    // 验证普通数值格式
    if (!/^-?\d+(\.\d+)?$/.test(normalInput.value)) {
      throw new Error(t('tools.numberConverter.invalidNumber'));
    }

    const num = Number(normalInput.value);
    if (isNaN(num)) {
      throw new Error(t('tools.numberConverter.invalidNumber'));
    }

    normalResult.value = num.toExponential();
  } catch (e) {
    error.value = e.message;
    normalResult.value = '';
  }
}

function copyScientificResult() {
  if (scientificResult.value) {
    copy(scientificResult.value);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function copyNormalResult() {
  if (normalResult.value) {
    copy(normalResult.value);
    copySuccess.value = true;
    setTimeout(() => (copySuccess.value = false), 1500);
  }
}

function clearScientificInput() {
  scientificInput.value = '';
  scientificResult.value = '';
  error.value = '';
}

function clearNormalInput() {
  normalInput.value = '';
  normalResult.value = '';
  error.value = '';
}
</script>

<style scoped>
.number-converter {
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
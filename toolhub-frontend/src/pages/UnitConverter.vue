<template>
  <div class="unit-converter">
    <n-card :title="t('tools.unitConverter.title')">
      <n-tabs type="line" animated>
        <!-- 存储单位转换 -->
        <n-tab-pane name="storage" :tab="t('tools.unitConverter.storage')">
          <n-form>
            <n-form-item>
              <n-input-number
                v-model:value="storageValue"
                :min="0"
                :precision="2"
                @update:value="convertStorage"
              />
              <n-select
                v-model:value="storageFromUnit"
                :options="storageUnits"
                style="width: 120px; margin: 0 8px;"
                @update:value="convertStorage"
              />
              <span style="margin: 0 8px;">=</span>
              <n-input-number
                v-model:value="storageResult"
                :min="0"
                :precision="2"
                readonly
              />
              <n-select
                v-model:value="storageToUnit"
                :options="storageUnits"
                style="width: 120px; margin-left: 8px;"
                @update:value="convertStorage"
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 时间单位转换 -->
        <n-tab-pane name="time" :tab="t('tools.unitConverter.time')">
          <n-form>
            <n-form-item>
              <n-input-number
                v-model:value="timeValue"
                :min="0"
                :precision="2"
                @update:value="convertTime"
              />
              <n-select
                v-model:value="timeFromUnit"
                :options="timeUnits"
                style="width: 120px; margin: 0 8px;"
                @update:value="convertTime"
              />
              <span style="margin: 0 8px;">=</span>
              <n-input-number
                v-model:value="timeResult"
                :min="0"
                :precision="2"
                readonly
              />
              <n-select
                v-model:value="timeToUnit"
                :options="timeUnits"
                style="width: 120px; margin-left: 8px;"
                @update:value="convertTime"
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 长度单位转换 -->
        <n-tab-pane name="length" :tab="t('tools.unitConverter.length')">
          <n-form>
            <n-form-item>
              <n-input-number
                v-model:value="lengthValue"
                :min="0"
                :precision="2"
                @update:value="convertLength"
              />
              <n-select
                v-model:value="lengthFromUnit"
                :options="lengthUnits"
                style="width: 120px; margin: 0 8px;"
                @update:value="convertLength"
              />
              <span style="margin: 0 8px;">=</span>
              <n-input-number
                v-model:value="lengthResult"
                :min="0"
                :precision="2"
                readonly
              />
              <n-select
                v-model:value="lengthToUnit"
                :options="lengthUnits"
                style="width: 120px; margin-left: 8px;"
                @update:value="convertLength"
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 温度单位转换 -->
        <n-tab-pane name="temperature" :tab="t('tools.unitConverter.temperature')">
          <n-form>
            <n-form-item>
              <n-input-number
                v-model:value="temperatureValue"
                :precision="2"
                @update:value="convertTemperature"
              />
              <n-select
                v-model:value="temperatureFromUnit"
                :options="temperatureUnits"
                style="width: 120px; margin: 0 8px;"
                @update:value="convertTemperature"
              />
              <span style="margin: 0 8px;">=</span>
              <n-input-number
                v-model:value="temperatureResult"
                :precision="2"
                readonly
              />
              <n-select
                v-model:value="temperatureToUnit"
                :options="temperatureUnits"
                style="width: 120px; margin-left: 8px;"
                @update:value="convertTemperature"
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 重量单位转换 -->
        <n-tab-pane name="weight" :tab="t('tools.unitConverter.weight')">
          <n-form>
            <n-form-item>
              <n-input-number
                v-model:value="weightValue"
                :min="0"
                :precision="2"
                @update:value="convertWeight"
              />
              <n-select
                v-model:value="weightFromUnit"
                :options="weightUnits"
                style="width: 120px; margin: 0 8px;"
                @update:value="convertWeight"
              />
              <span style="margin: 0 8px;">=</span>
              <n-input-number
                v-model:value="weightResult"
                :min="0"
                :precision="2"
                readonly
              />
              <n-select
                v-model:value="weightToUnit"
                :options="weightUnits"
                style="width: 120px; margin-left: 8px;"
                @update:value="convertWeight"
              />
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// 存储单位
const storageUnits = [
  { label: 'B', value: 'B' },
  { label: 'KB', value: 'KB' },
  { label: 'MB', value: 'MB' },
  { label: 'GB', value: 'GB' },
  { label: 'TB', value: 'TB' },
  { label: 'PB', value: 'PB' }
];

const storageValue = ref(1);
const storageFromUnit = ref('MB');
const storageToUnit = ref('KB');
const storageResult = ref(1024);

function convertStorage() {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const fromIndex = units.indexOf(storageFromUnit.value);
  const toIndex = units.indexOf(storageToUnit.value);
  const diff = fromIndex - toIndex;
  storageResult.value = storageValue.value * Math.pow(1024, diff);
}

// 时间单位
const timeUnits = [
  { label: '毫秒', value: 'ms' },
  { label: '秒', value: 's' },
  { label: '分钟', value: 'min' },
  { label: '小时', value: 'h' },
  { label: '天', value: 'd' }
];

const timeValue = ref(1);
const timeFromUnit = ref('h');
const timeToUnit = ref('min');
const timeResult = ref(60);

function convertTime() {
  const unitToMs = {
    'ms': 1,
    's': 1000,
    'min': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000
  };
  const ms = timeValue.value * unitToMs[timeFromUnit.value];
  timeResult.value = ms / unitToMs[timeToUnit.value];
}

// 长度单位
const lengthUnits = [
  { label: '毫米', value: 'mm' },
  { label: '厘米', value: 'cm' },
  { label: '米', value: 'm' },
  { label: '千米', value: 'km' },
  { label: '英寸', value: 'in' },
  { label: '英尺', value: 'ft' }
];

const lengthValue = ref(1);
const lengthFromUnit = ref('m');
const lengthToUnit = ref('cm');
const lengthResult = ref(100);

function convertLength() {
  const unitToMm = {
    'mm': 1,
    'cm': 10,
    'm': 1000,
    'km': 1000000,
    'in': 25.4,
    'ft': 304.8
  };
  const mm = lengthValue.value * unitToMm[lengthFromUnit.value];
  lengthResult.value = mm / unitToMm[lengthToUnit.value];
}

// 温度单位
const temperatureUnits = [
  { label: '摄氏度', value: 'C' },
  { label: '华氏度', value: 'F' },
  { label: '开尔文', value: 'K' }
];

const temperatureValue = ref(0);
const temperatureFromUnit = ref('C');
const temperatureToUnit = ref('F');
const temperatureResult = ref(32);

function convertTemperature() {
  let kelvin = 0;
  // 先转换为开尔文
  if (temperatureFromUnit.value === 'C') {
    kelvin = temperatureValue.value + 273.15;
  } else if (temperatureFromUnit.value === 'F') {
    kelvin = (temperatureValue.value - 32) * 5/9 + 273.15;
  } else {
    kelvin = temperatureValue.value;
  }
  
  // 从开尔文转换为目标单位
  if (temperatureToUnit.value === 'C') {
    temperatureResult.value = kelvin - 273.15;
  } else if (temperatureToUnit.value === 'F') {
    temperatureResult.value = (kelvin - 273.15) * 9/5 + 32;
  } else {
    temperatureResult.value = kelvin;
  }
}

// 重量单位
const weightUnits = [
  { label: '毫克', value: 'mg' },
  { label: '克', value: 'g' },
  { label: '千克', value: 'kg' },
  { label: '吨', value: 't' },
  { label: '磅', value: 'lb' }
];

const weightValue = ref(1);
const weightFromUnit = ref('kg');
const weightToUnit = ref('g');
const weightResult = ref(1000);

function convertWeight() {
  const unitToG = {
    'mg': 0.001,
    'g': 1,
    'kg': 1000,
    't': 1000000,
    'lb': 453.59237
  };
  const g = weightValue.value * unitToG[weightFromUnit.value];
  weightResult.value = g / unitToG[weightToUnit.value];
}
</script>

<style scoped>
.unit-converter {
  max-width: 800px;
  margin: 0 auto;
}
</style> 
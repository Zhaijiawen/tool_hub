<template>
  <div class="color-picker-tools">
    <n-card :title="t('tools.colorPickerTools.title')">
      <n-tabs type="line" animated>
        <!-- 颜色选择器 -->
        <n-tab-pane :name="1" :tab="t('tools.colorPickerTools.picker')">
          <n-form>
            <n-form-item :label="t('tools.colorPickerTools.color')">
              <n-color-picker
                v-model:value="selectedColor"
                :show-alpha="true"
                :swatches="swatches"
                @update:value="handleColorChange"
              />
            </n-form-item>
            <n-form-item :label="t('tools.colorPickerTools.formats')">
              <n-space vertical>
                <n-space>
                  <n-text>HEX:</n-text>
                  <n-input
                    v-model:value="colorFormats.hex"
                    readonly
                    @click="copyColor('hex')"
                  />
                </n-space>
                <n-space>
                  <n-text>RGB:</n-text>
                  <n-input
                    v-model:value="colorFormats.rgb"
                    readonly
                    @click="copyColor('rgb')"
                  />
                </n-space>
                <n-space>
                  <n-text>HSL:</n-text>
                  <n-input
                    v-model:value="colorFormats.hsl"
                    readonly
                    @click="copyColor('hsl')"
                  />
                </n-space>
                <n-space>
                  <n-text>CMYK:</n-text>
                  <n-input
                    v-model:value="colorFormats.cmyk"
                    readonly
                    @click="copyColor('cmyk')"
                  />
                </n-space>
              </n-space>
            </n-form-item>
            <n-form-item :label="t('tools.colorPickerTools.preview')">
              <div class="color-preview" :style="{ backgroundColor: selectedColor }">
                <span :style="{ color: getContrastColor(selectedColor) }">
                  {{ t('tools.colorPickerTools.previewText') }}
                </span>
              </div>
            </n-form-item>
          </n-form>
        </n-tab-pane>

        <!-- 调色板生成器 -->
        <n-tab-pane :name="2" :tab="t('tools.colorPickerTools.palette')">
          <n-form>
            <n-form-item :label="t('tools.colorPickerTools.baseColor')">
              <n-color-picker
                v-model:value="baseColor"
                :show-alpha="false"
                @update:value="generatePalette"
              />
            </n-form-item>
            <n-form-item :label="t('tools.colorPickerTools.paletteType')">
              <n-select
                v-model:value="paletteType"
                :options="paletteTypeOptions"
                @update:value="generatePalette"
              />
            </n-form-item>
            <n-form-item :label="t('tools.colorPickerTools.generatedPalette')">
              <div class="palette-grid">
                <div
                  v-for="(color, index) in generatedPalette"
                  :key="index"
                  class="palette-color"
                  :style="{ backgroundColor: color }"
                  @click="copyColor('hex', color)"
                >
                  <span :style="{ color: getContrastColor(color) }">
                    {{ color }}
                  </span>
                </div>
              </div>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { hexToRgb, rgbToHex, rgbToHsl, rgbToCmyk } from '../utils/color';

const { t } = useI18n();
const message = useMessage();

// 颜色选择器相关
const selectedColor = ref('#000000');
const swatches = [
  '#000000',
  '#FFFFFF',
  '#FF0000',
  '#00FF00',
  '#0000FF',
  '#FFFF00',
  '#FF00FF',
  '#00FFFF'
];

const colorFormats = computed(() => {
  const rgb = hexToRgb(selectedColor.value);
  if (!rgb) return {
    hex: selectedColor.value,
    rgb: 'Invalid color',
    hsl: 'Invalid color',
    cmyk: 'Invalid color'
  };

  const hsl = rgbToHsl(rgb);
  const cmyk = rgbToCmyk(rgb);

  return {
    hex: selectedColor.value,
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`,
    cmyk: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`
  };
});

function handleColorChange(color: string) {
  selectedColor.value = color;
}

function copyColor(format: keyof typeof colorFormats.value, color?: string) {
  const textToCopy = color || colorFormats.value[format];
  navigator.clipboard.writeText(textToCopy);
  message.success(t('common.copySuccess'));
}

function getContrastColor(hexColor: string): string {
  const rgb = hexToRgb(hexColor);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

// 调色板生成器相关
const baseColor = ref('#000000');
const paletteType = ref('complementary');
const generatedPalette = ref<string[]>([]);

const paletteTypeOptions = [
  { label: t('tools.colorPickerTools.complementary'), value: 'complementary' },
  { label: t('tools.colorPickerTools.analogous'), value: 'analogous' },
  { label: t('tools.colorPickerTools.triadic'), value: 'triadic' },
  { label: t('tools.colorPickerTools.tetradic'), value: 'tetradic' },
  { label: t('tools.colorPickerTools.monochromatic'), value: 'monochromatic' }
];

function generatePalette() {
  const rgb = hexToRgb(baseColor.value);
  if (!rgb) return;

  const hsl = rgbToHsl(rgb);
  let colors: string[] = [];

  switch (paletteType.value) {
    case 'complementary':
      colors = [
        baseColor.value,
        rgbToHex({ r: 255 - rgb.r, g: 255 - rgb.g, b: 255 - rgb.b })
      ];
      break;
    case 'analogous':
      colors = [
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 30)),
        baseColor.value,
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, -30))
      ];
      break;
    case 'triadic':
      colors = [
        baseColor.value,
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 120)),
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 240))
      ];
      break;
    case 'tetradic':
      colors = [
        baseColor.value,
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 90)),
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 180)),
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 270))
      ];
      break;
    case 'monochromatic':
      colors = [
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 0, 0.2)),
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 0, 0.1)),
        baseColor.value,
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 0, -0.1)),
        rgbToHex(rgbToHsl({ r: rgb.r, g: rgb.g, b: rgb.b }, 0, -0.2))
      ];
      break;
  }

  generatedPalette.value = colors;
}
</script>

<style scoped>
.color-picker-tools {
  max-width: 800px;
  margin: 0 auto;
}
.color-preview {
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
}
.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 12px;
}
.palette-color {
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}
.palette-color:hover {
  transform: scale(1.05);
}
</style> 
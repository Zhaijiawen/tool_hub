<template>
  <div class="pdf-tools">
    <!-- 工具简介 -->
    <ToolIntro toolKey="pdfTools" />

    <n-card :bordered="false">
      <template #header-extra>
        <WasmTag />
      </template>

      <n-tabs v-model:value="activeTab" type="line" animated>
        <!-- ============ Tab 1: PDF 转图片 ============ -->
        <n-tab-pane name="toImage" :tab="t('document.pdfTools.tabs.toImage')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': toImageDragging }"
              @dragover.prevent="toImageDragging = true"
              @dragleave.prevent="toImageDragging = false"
              @drop.prevent="onToImageDrop"
              @click="toImageInput?.click()"
            >
              <input ref="toImageInput" type="file" accept="application/pdf,.pdf" style="display:none" @change="onToImageChange" />
              <div v-if="!toImageFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('document.pdfTools.uploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.uploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ toImageFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(toImageFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearToImage">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <div v-if="toImageFile" class="options">
              <div class="option-row">
                <span class="option-label">{{ t('document.pdfTools.formatLabel') }}</span>
                <n-radio-group v-model:value="toImageFormat" size="small">
                  <n-radio value="png">PNG</n-radio>
                  <n-radio value="jpeg">JPEG</n-radio>
                </n-radio-group>
              </div>
              <div class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('document.pdfTools.scaleLabel') }}</span>
                <n-select v-model:value="toImageScale" :options="scaleOptions" size="small" style="max-width: 200px;" />
              </div>
              <div class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('document.pdfTools.rangeLabel') }}</span>
                <n-radio-group v-model:value="toImageRangeMode" size="small">
                  <n-radio value="all">{{ t('document.pdfTools.allPages') }}</n-radio>
                  <n-radio value="custom">{{ t('document.pdfTools.customRange') }}</n-radio>
                </n-radio-group>
                <n-input
                  v-if="toImageRangeMode === 'custom'"
                  v-model:value="toImageRange"
                  size="small"
                  :placeholder="t('document.pdfTools.rangePlaceholder')"
                  style="max-width: 200px;"
                />
              </div>
              <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.rangeHint') }}</n-text>
            </div>

            <div v-if="toImageFile" class="action-row">
              <n-button
                type="primary"
                :loading="processing"
                :disabled="processing || (toImageRangeMode === 'custom' && !toImageRange.trim())"
                @click="runToImage"
              >
                {{ processing ? t(phaseTextKey) : t('document.pdfTools.startRender') }}
              </n-button>
            </div>

            <div v-if="processing" class="progress-area">
              <n-progress
                type="line"
                :percentage="mupdf.displayProgress.value"
                :show-percentage="true"
                :height="8"
                indicator-placement="inside"
                processing
              />
              <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
                {{ t(phaseTextKey) }} · {{ mupdf.displayProgress.value }}%
              </n-text>
            </div>
            <n-alert v-else-if="errorText" type="error" :show-icon="true" style="margin-top: 4px;">
              {{ errorText }}
            </n-alert>

            <div v-if="toImageResult" class="result">
              <n-space align="center" :wrap="true" style="margin-bottom: 12px;">
                <n-tag :bordered="false" type="info">{{ t('document.pdfTools.pageCount') }}: {{ toImageResult.pageCount }}</n-tag>
                <n-tag :bordered="false" type="success">{{ t('document.pdfTools.converted') }}: {{ toImageResult.pages.length }}</n-tag>
                <n-button size="small" @click="downloadAllImages">{{ t('document.pdfTools.downloadAll') }}</n-button>
              </n-space>
              <div class="image-grid">
                <div v-for="(img, i) in toImageResult.pages" :key="i" class="image-item">
                  <img :src="img.url" :alt="img.name" loading="lazy" />
                  <div class="image-meta">
                    <n-text style="font-size: 12px;">{{ t('document.pdfTools.page') }} {{ img.page }}</n-text>
                    <n-text depth="3" style="font-size: 12px;">{{ formatSize(img.size) }}</n-text>
                  </div>
                  <n-button size="tiny" secondary @click="downloadImage(img)">{{ t('document.pdfTools.download') }}</n-button>
                </div>
              </div>
              <n-text depth="3" style="font-size: 12px; margin-top: 8px; display: block;">
                {{ t('document.pdfTools.multiDownloadHint') }}
              </n-text>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ============ Tab 2: 合并 PDF ============ -->
        <n-tab-pane name="merge" :tab="t('document.pdfTools.tabs.merge')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': mergeDragging }"
              @dragover.prevent="mergeDragging = true"
              @dragleave.prevent="mergeDragging = false"
              @drop.prevent="onMergeDrop"
              @click="mergeInput?.click()"
            >
              <input ref="mergeInput" type="file" accept="application/pdf,.pdf" multiple style="display:none" @change="onMergeChange" />
              <div class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('document.pdfTools.mergeUploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.uploadSubHint') }}</n-text>
              </div>
            </div>

            <div v-if="mergeFiles.length" class="file-list">
              <n-text depth="3" style="font-size: 12px; display: block; margin-bottom: 8px;">
                {{ t('document.pdfTools.mergeOrderHint') }}
              </n-text>
              <div v-for="(f, i) in mergeFiles" :key="f.id" class="file-row">
                <span class="file-index">{{ i + 1 }}</span>
                <n-text class="file-name" :title="f.name">{{ f.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(f.size) }}</n-text>
                <n-button-group size="tiny">
                  <n-button :disabled="i === 0" @click="moveMergeFile(i, -1)">↑</n-button>
                  <n-button :disabled="i === mergeFiles.length - 1" @click="moveMergeFile(i, 1)">↓</n-button>
                </n-button-group>
                <n-button size="tiny" quaternary type="error" @click="removeMergeFile(i)">✕</n-button>
              </div>
            </div>

            <div v-if="mergeFiles.length >= 2" class="action-row">
              <n-button type="primary" :loading="processing" :disabled="processing" @click="runMerge">
                {{ processing ? t(phaseTextKey) : t('document.pdfTools.startMerge') }}
              </n-button>
            </div>
            <n-text v-else-if="mergeFiles.length === 1" depth="3" style="font-size: 12px;">
              {{ t('document.pdfTools.needTwoFiles') }}
            </n-text>

            <div v-if="processing" class="progress-area">
              <n-progress
                type="line"
                :percentage="mupdf.displayProgress.value"
                :show-percentage="true"
                :height="8"
                indicator-placement="inside"
                processing
              />
              <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
                {{ t(phaseTextKey) }} · {{ mupdf.displayProgress.value }}%
              </n-text>
            </div>
            <n-alert v-else-if="errorText" type="error" :show-icon="true" style="margin-top: 4px;">
              {{ errorText }}
            </n-alert>

            <div v-if="mergeResult" class="result">
              <n-space align="center" :wrap="true">
                <n-tag :bordered="false" type="success">{{ mergeResult.name }}</n-tag>
                <n-tag :bordered="false" type="info">{{ t('document.pdfTools.pageCount') }}: {{ mergeResult.pageCount }}</n-tag>
                <n-tag :bordered="false">{{ formatSize(mergeResult.size) }}</n-tag>
                <n-button type="primary" size="small" @click="downloadMergeResult">{{ t('document.pdfTools.download') }}</n-button>
              </n-space>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ============ Tab 3: 拆分 PDF ============ -->
        <n-tab-pane name="split" :tab="t('document.pdfTools.tabs.split')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': splitDragging }"
              @dragover.prevent="splitDragging = true"
              @dragleave.prevent="splitDragging = false"
              @drop.prevent="onSplitDrop"
              @click="splitInput?.click()"
            >
              <input ref="splitInput" type="file" accept="application/pdf,.pdf" style="display:none" @change="onSplitChange" />
              <div v-if="!splitFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('document.pdfTools.uploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.uploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ splitFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(splitFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearSplit">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <div v-if="splitFile" class="options">
              <div class="option-row">
                <span class="option-label">{{ t('document.pdfTools.splitModeLabel') }}</span>
                <n-radio-group v-model:value="splitMode" size="small">
                  <n-radio value="each">{{ t('document.pdfTools.splitEachPage') }}</n-radio>
                  <n-radio value="range">{{ t('document.pdfTools.splitByRange') }}</n-radio>
                </n-radio-group>
              </div>
              <div v-if="splitMode === 'range'" class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('document.pdfTools.rangesLabel') }}</span>
                <n-input
                  v-model:value="splitRange"
                  size="small"
                  :placeholder="t('document.pdfTools.rangePlaceholder')"
                  style="max-width: 240px;"
                />
              </div>
              <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.rangeHint') }}</n-text>
            </div>

            <div v-if="splitFile" class="action-row">
              <n-button
                type="primary"
                :loading="processing"
                :disabled="processing || (splitMode === 'range' && !splitRange.trim())"
                @click="runSplit"
              >
                {{ processing ? t(phaseTextKey) : t('document.pdfTools.startSplit') }}
              </n-button>
            </div>

            <div v-if="processing" class="progress-area">
              <n-progress
                type="line"
                :percentage="mupdf.displayProgress.value"
                :show-percentage="true"
                :height="8"
                indicator-placement="inside"
                processing
              />
              <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
                {{ t(phaseTextKey) }} · {{ mupdf.displayProgress.value }}%
              </n-text>
            </div>
            <n-alert v-else-if="errorText" type="error" :show-icon="true" style="margin-top: 4px;">
              {{ errorText }}
            </n-alert>

            <div v-if="splitResult" class="result">
              <n-space align="center" :wrap="true" style="margin-bottom: 12px;">
                <n-tag :bordered="false" type="info">{{ t('document.pdfTools.partsCount') }}: {{ splitResult.parts.length }}</n-tag>
                <n-button size="small" @click="downloadAllParts">{{ t('document.pdfTools.downloadAll') }}</n-button>
              </n-space>
              <div class="file-list">
                <div v-for="(p, i) in splitResult.parts" :key="i" class="file-row">
                  <n-text class="file-name" :title="p.name">{{ p.name }}</n-text>
                  <n-text depth="3" style="font-size: 12px;">{{ p.pages }} {{ t('document.pdfTools.pages') }}</n-text>
                  <n-text depth="3" style="font-size: 12px;">{{ formatSize(p.size) }}</n-text>
                  <n-button size="tiny" secondary @click="downloadPart(p)">{{ t('document.pdfTools.download') }}</n-button>
                </div>
              </div>
              <n-text depth="3" style="font-size: 12px; margin-top: 8px; display: block;">
                {{ t('document.pdfTools.multiDownloadHint') }}
              </n-text>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ============ Tab 4: PDF 瘦身压缩 ============ -->
        <n-tab-pane name="compress" :tab="t('document.pdfTools.tabs.compress')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': compressDragging }"
              @dragover.prevent="compressDragging = true"
              @dragleave.prevent="compressDragging = false"
              @drop.prevent="onCompressDrop"
              @click="compressInput?.click()"
            >
              <input ref="compressInput" type="file" accept="application/pdf,.pdf" style="display:none" @change="onCompressChange" />
              <div v-if="!compressFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('document.pdfTools.uploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.uploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ compressFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(compressFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearCompress">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <n-text depth="3" style="font-size: 12px;">
              {{ t('document.pdfTools.compressIntro') }}
            </n-text>

            <div v-if="compressFile" class="action-row">
              <n-button type="primary" :loading="processing" :disabled="processing" @click="runCompress">
                {{ processing ? t(phaseTextKey) : t('document.pdfTools.startCompress') }}
              </n-button>
            </div>

            <div v-if="processing" class="progress-area">
              <n-progress type="line" :percentage="mupdf.displayProgress.value" :show-percentage="true" :height="8" indicator-placement="inside" processing />
              <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
                {{ t(phaseTextKey) }} · {{ mupdf.displayProgress.value }}%
              </n-text>
            </div>
            <n-alert v-else-if="errorText" type="error" :show-icon="true" style="margin-top: 4px;">
              {{ errorText }}
            </n-alert>

            <div v-if="compressResult" class="result">
              <n-space align="center" :wrap="true" style="margin-bottom: 12px;">
                <n-tag :bordered="false" :type="compressResult.reduced ? 'success' : 'warning'">
                  {{ formatSize(compressResult.before) }} → {{ formatSize(compressResult.after) }}
                  ({{ compressResult.reduced ? '-' : '+' }}{{ compressResult.percent }}%)
                </n-tag>
                <n-button size="small" @click="downloadCompressResult">{{ t('document.pdfTools.download') }}</n-button>
              </n-space>
              <n-text depth="3" style="font-size: 12px; display: block;">
                {{ t(compressResult.reduced ? 'document.pdfTools.compressDoneHint' : 'document.pdfTools.noGainHint') }}
              </n-text>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ============ Tab 5: 提取 PDF 文字 ============ -->
        <n-tab-pane name="extract" :tab="t('document.pdfTools.tabs.extract')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': extractDragging }"
              @dragover.prevent="extractDragging = true"
              @dragleave.prevent="extractDragging = false"
              @drop.prevent="onExtractDrop"
              @click="extractInput?.click()"
            >
              <input ref="extractInput" type="file" accept="application/pdf,.pdf" style="display:none" @change="onExtractChange" />
              <div v-if="!extractFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('document.pdfTools.uploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.uploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ extractFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(extractFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearExtract">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <div v-if="extractFile" class="options">
              <div class="option-row">
                <span class="option-label">{{ t('document.pdfTools.extractScopeLabel') }}</span>
                <n-radio-group v-model:value="extractMode" size="small">
                  <n-radio value="all">{{ t('document.pdfTools.extractAll') }}</n-radio>
                  <n-radio value="range">{{ t('document.pdfTools.extractRange') }}</n-radio>
                </n-radio-group>
              </div>
              <div v-if="extractMode === 'range'" class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('document.pdfTools.rangesLabel') }}</span>
                <n-input v-model:value="extractRange" size="small" :placeholder="t('document.pdfTools.rangePlaceholder')" style="max-width: 240px;" />
              </div>
              <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.rangeHint') }}</n-text>
              <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.scanHint') }}</n-text>
            </div>

            <div v-if="extractFile" class="action-row">
              <n-button
                type="primary"
                :loading="processing"
                :disabled="processing || (extractMode === 'range' && !extractRange.trim())"
                @click="runExtract"
              >
                {{ processing ? t(phaseTextKey) : t('document.pdfTools.startExtract') }}
              </n-button>
            </div>

            <div v-if="processing" class="progress-area">
              <n-progress type="line" :percentage="mupdf.displayProgress.value" :show-percentage="true" :height="8" indicator-placement="inside" processing />
              <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
                {{ t(phaseTextKey) }} · {{ mupdf.displayProgress.value }}%
              </n-text>
            </div>
            <n-alert v-else-if="errorText" type="error" :show-icon="true" style="margin-top: 4px;">
              {{ errorText }}
            </n-alert>

            <div v-if="extractResult" class="result">
              <n-space align="center" :wrap="true" style="margin-bottom: 12px;">
                <n-tag :bordered="false" type="info">
                  {{ t('document.pdfTools.extractedPages') }}: {{ extractResult.parts.length }}
                </n-tag>
                <n-button size="small" @click="copyAllExtracted">{{ t('document.pdfTools.copyAll') }}</n-button>
                <n-button size="small" @click="downloadExtracted">{{ t('document.pdfTools.downloadText') }}</n-button>
              </n-space>

              <n-alert v-if="isEmptyExtract" type="warning" :show-icon="true" style="margin-bottom: 12px;">
                {{ t('document.pdfTools.emptyLayerHint') }}
              </n-alert>

              <div class="extract-list">
                <div v-for="part in extractResult.parts" :key="part.page" class="extract-row">
                  <div class="extract-head">
                    <n-tag size="small" :bordered="false">{{ t('document.pdfTools.pageLabel') }} {{ part.page }}</n-tag>
                    <n-button size="tiny" quaternary @click="copyText(part.text)">{{ t('document.pdfTools.copyPage') }}</n-button>
                  </div>
                  <div class="extract-body">{{ part.text || t('document.pdfTools.noTextOnPage') }}</div>
                </div>
              </div>
            </div>
          </n-space>
        </n-tab-pane>

        <!-- ============ Tab 6: 页面整理（删除 / 保留） ============ -->
        <n-tab-pane name="organize" :tab="t('document.pdfTools.tabs.organize')">
          <n-space vertical size="large">
            <div
              class="upload-area"
              :class="{ 'drag-over': organizeDragging }"
              @dragover.prevent="organizeDragging = true"
              @dragleave.prevent="organizeDragging = false"
              @drop.prevent="onOrganizeDrop"
              @click="organizeInput?.click()"
            >
              <input ref="organizeInput" type="file" accept="application/pdf,.pdf" style="display:none" @change="onOrganizeChange" />
              <div v-if="!organizeFile" class="upload-hint">
                <n-icon size="40" :depth="3">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14,2H6C4.89,2 4,2.89 4,4V20C4,21.11 4.89,22 6,22H18C19.11,22 20,21.11 20,19V8L14,2M18,20H6V4H13V9H18V20M8,17L9.5,15L11,17L13,14L16,18H8Z"/></svg>
                </n-icon>
                <n-text depth="3">{{ t('document.pdfTools.uploadHint') }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.uploadSubHint') }}</n-text>
              </div>
              <div v-else class="file-info" @click.stop>
                <n-text>{{ organizeFile.name }}</n-text>
                <n-text depth="3" style="font-size: 12px;">{{ formatSize(organizeFile.size) }}</n-text>
                <n-button size="tiny" quaternary @click="clearOrganizeFile">{{ t('common.clear') }}</n-button>
              </div>
            </div>

            <div v-if="organizeFile" class="options">
              <div class="option-row">
                <span class="option-label">{{ t('document.pdfTools.organizeModeLabel') }}</span>
                <n-radio-group v-model:value="organizeMode" size="small">
                  <n-radio value="delete">{{ t('document.pdfTools.organizeDelete') }}</n-radio>
                  <n-radio value="keep">{{ t('document.pdfTools.organizeKeep') }}</n-radio>
                </n-radio-group>
              </div>
              <div class="option-row" style="margin-top: 8px;">
                <span class="option-label">{{ t('document.pdfTools.rangesLabel') }}</span>
                <n-input v-model:value="organizeRange" size="small" :placeholder="t('document.pdfTools.rangePlaceholder')" style="max-width: 240px;" />
              </div>
              <n-text depth="3" style="font-size: 12px;">{{ t('document.pdfTools.rangeHint') }}</n-text>
            </div>

            <div v-if="organizeFile" class="action-row">
              <n-button type="primary" :loading="processing" :disabled="processing || !organizeRange.trim()" @click="runOrganize">
                {{ processing ? t(phaseTextKey) : t('document.pdfTools.startOrganize') }}
              </n-button>
            </div>

            <div v-if="processing" class="progress-area">
              <n-progress type="line" :percentage="mupdf.displayProgress.value" :show-percentage="true" :height="8" indicator-placement="inside" processing />
              <n-text depth="3" style="font-size: 12px; margin-top: 6px; display: block;">
                {{ t(phaseTextKey) }} · {{ mupdf.displayProgress.value }}%
              </n-text>
            </div>
            <n-alert v-else-if="errorText" type="error" :show-icon="true" style="margin-top: 4px;">
              {{ errorText }}
            </n-alert>

            <div v-if="organizeResult" class="result">
              <n-space align="center" :wrap="true" style="margin-bottom: 12px;">
                <n-tag :bordered="false" type="success">
                  {{ t('document.pdfTools.pagesRemoved') }}: {{ organizeResult.removed }} ·
                  {{ t('document.pdfTools.pagesLeft') }}: {{ organizeResult.pageCount }}
                </n-tag>
                <n-button size="small" @click="downloadOrganizeResult">{{ t('document.pdfTools.download') }}</n-button>
              </n-space>
              <n-text depth="3" style="font-size: 12px; display: block;">
                {{ formatSize(organizeFile?.size || 0) }} → {{ formatSize(organizeResult.size) }}
              </n-text>
            </div>
          </n-space>
        </n-tab-pane>
      </n-tabs>

      <!-- 共享：密码（可选） -->
      <n-divider style="margin-top: 24px;" />
      <div class="option-row">
        <span class="option-label">{{ t('document.pdfTools.passwordLabel') }}</span>
        <n-input
          v-model:value="password"
          type="password"
          size="small"
          show-password-on="click"
          :placeholder="t('document.pdfTools.passwordPlaceholder')"
          style="max-width: 280px;"
        />
      </div>
      <n-text depth="3" style="font-size: 12px; margin-top: 4px; display: block;">
        {{ t('document.pdfTools.passwordHint') }}
      </n-text>
    </n-card>

    <TutorialAndDocs toolKey="pdfTools" />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage } from 'naive-ui'
import TutorialAndDocs from '@/components/common/TutorialAndDocs.vue'
import ToolIntro from '@/components/common/ToolIntro.vue'
import WasmTag from '@/components/common/WasmTag.vue'
import { useMupdf } from '@/composables/useMupdf'

const { t } = useI18n()
const message = useMessage()
const mupdf = useMupdf()

const activeTab = ref('toImage')
const password = ref('')

// ---- 进度 / 错误 ----
const processing = computed(() => mupdf.busy.value)

const phaseTextKey = computed(() =>
  mupdf.stage.value === 'download' ? 'document.pdfTools.phaseDownloading' : 'document.pdfTools.phaseWorking'
)

const errorText = ref('')

// worker 错误码 → i18n 键
const ERROR_KEYS = {
  PASSWORD_REQUIRED: 'document.pdfTools.errors.passwordRequired',
  PASSWORD_WRONG: 'document.pdfTools.errors.passwordWrong',
  OPEN_FAILED: 'document.pdfTools.errors.openFailed',
  RANGE_INVALID: 'document.pdfTools.errors.rangeInvalid',
  EMPTY_DOC: 'document.pdfTools.errors.emptyDoc',
  DELETE_ALL: 'document.pdfTools.errors.deleteAll'
}

function fail(err) {
  // 用户主动取消下载（AbortController）：静默，不视为失败
  if (err && err.name === 'AbortError') return
  const msg = String(err && err.message ? err.message : err)
  const key = ERROR_KEYS[msg]
  errorText.value = key ? t(key) : `${t('document.pdfTools.failed')}: ${msg}`
}

// ---- 通用 ----
function formatSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

function isPdf(file) {
  return file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
}

async function readPdf(file) {
  if (!isPdf(file)) {
    message.warning(t('document.pdfTools.pdfOnly'))
    return null
  }
  return { name: file.name, size: file.size, buffer: await file.arrayBuffer() }
}

function downloadBytes(bytes, name, mime) {
  const url = URL.createObjectURL(new Blob([bytes], { type: mime }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

// ================= Tab 1: PDF 转图片 =================
const toImageInput = ref(null)
const toImageDragging = ref(false)
const toImageFile = ref(null)
const toImageFormat = ref('png')
const toImageScale = ref(2)
const toImageRangeMode = ref('all')
const toImageRange = ref('')
const toImageResult = ref(null)

const scaleOptions = [
  { label: '1x · 72 DPI', value: 1 },
  { label: '2x · 144 DPI', value: 2 },
  { label: '3x · 216 DPI', value: 3 }
]

async function onToImageChange(e) {
  const file = e.target.files?.[0]
  if (file) await loadToImageFile(file)
  e.target.value = ''
}

async function onToImageDrop(e) {
  toImageDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) await loadToImageFile(file)
}

async function loadToImageFile(file) {
  const info = await readPdf(file)
  if (!info) return
  toImageFile.value = info
  resetToImage()
}

function clearToImage() {
  toImageFile.value = null
  resetToImage()
}

function resetToImage() {
  clearToImageResult()
  errorText.value = ''
}

function clearToImageResult() {
  if (toImageResult.value) {
    for (const img of toImageResult.value.pages) URL.revokeObjectURL(img.url)
  }
  toImageResult.value = null
}

async function runToImage() {
  if (!toImageFile.value) return
  errorText.value = ''
  clearToImageResult()
  try {
    const range = toImageRangeMode.value === 'custom' ? toImageRange.value.trim() : null
    const result = await mupdf.render(toImageFile.value.buffer, {
      format: toImageFormat.value,
      scale: toImageScale.value,
      range,
      password: password.value || undefined
    })
    const mime = toImageFormat.value === 'jpeg' ? 'image/jpeg' : 'image/png'
    toImageResult.value = {
      pageCount: result.pageCount,
      pages: result.pages.map((p) => ({
        name: p.name,
        page: p.page,
        size: p.bytes.byteLength,
        url: URL.createObjectURL(new Blob([p.bytes], { type: mime })),
        bytes: p.bytes
      }))
    }
  } catch (err) {
    fail(err)
  }
}

function downloadImage(img) {
  const mime = toImageFormat.value === 'jpeg' ? 'image/jpeg' : 'image/png'
  const base = toImageFile.value.name.replace(/\.[^.]+$/, '') || 'pdf'
  downloadBytes(img.bytes, `${base}-${img.name}`, mime)
}

function downloadAllImages() {
  for (const img of toImageResult.value.pages) downloadImage(img)
}

// ================= Tab 2: 合并 PDF =================
const mergeInput = ref(null)
const mergeDragging = ref(false)
const mergeFiles = ref([])
const mergeResult = ref(null)
let mergeSeq = 0

async function onMergeChange(e) {
  for (const file of e.target.files || []) await addMergeFile(file)
  e.target.value = ''
}

async function onMergeDrop(e) {
  mergeDragging.value = false
  for (const file of e.dataTransfer.files || []) await addMergeFile(file)
}

async function addMergeFile(file) {
  const info = await readPdf(file)
  if (!info) return
  mergeFiles.value.push({ ...info, id: ++mergeSeq })
  errorText.value = ''
  clearMergeResult()
}

function moveMergeFile(index, dir) {
  const arr = mergeFiles.value
  const target = index + dir
  if (target < 0 || target >= arr.length) return
  const [item] = arr.splice(index, 1)
  arr.splice(target, 0, item)
}

function removeMergeFile(index) {
  mergeFiles.value.splice(index, 1)
  if (mergeFiles.value.length < 2) clearMergeResult()
}

function clearMergeResult() {
  if (mergeResult.value) URL.revokeObjectURL(mergeResult.value.url)
  mergeResult.value = null
}

async function runMerge() {
  if (mergeFiles.value.length < 2) return
  errorText.value = ''
  clearMergeResult()
  try {
    const result = await mupdf.merge(
      mergeFiles.value.map((f) => ({ name: f.name, buffer: f.buffer })),
      password.value || undefined
    )
    mergeResult.value = {
      name: result.name,
      pageCount: result.pageCount,
      size: result.bytes.byteLength,
      url: URL.createObjectURL(new Blob([result.bytes], { type: 'application/pdf' })),
      bytes: result.bytes
    }
  } catch (err) {
    fail(err)
  }
}

function downloadMergeResult() {
  downloadBytes(mergeResult.value.bytes, mergeResult.value.name, 'application/pdf')
}

// ================= Tab 3: 拆分 PDF =================
const splitInput = ref(null)
const splitDragging = ref(false)
const splitFile = ref(null)
const splitMode = ref('each')
const splitRange = ref('')
const splitResult = ref(null)

async function onSplitChange(e) {
  const file = e.target.files?.[0]
  if (file) await loadSplitFile(file)
  e.target.value = ''
}

async function onSplitDrop(e) {
  splitDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) await loadSplitFile(file)
}

async function loadSplitFile(file) {
  const info = await readPdf(file)
  if (!info) return
  splitFile.value = info
  resetSplit()
}

function clearSplit() {
  splitFile.value = null
  resetSplit()
}

function resetSplit() {
  clearSplitResult()
  errorText.value = ''
}

function clearSplitResult() {
  if (splitResult.value) {
    for (const p of splitResult.value.parts) URL.revokeObjectURL(p.url)
  }
  splitResult.value = null
}

async function runSplit() {
  if (!splitFile.value) return
  errorText.value = ''
  clearSplitResult()
  try {
    const result = await mupdf.split(splitFile.value.buffer, {
      mode: splitMode.value,
      range: splitMode.value === 'range' ? splitRange.value.trim() : null,
      password: password.value || undefined
    })
    splitResult.value = {
      parts: result.parts.map((p) => ({
        name: p.name,
        pages: p.pages,
        size: p.bytes.byteLength,
        url: URL.createObjectURL(new Blob([p.bytes], { type: 'application/pdf' })),
        bytes: p.bytes
      }))
    }
  } catch (err) {
    fail(err)
  }
}

function downloadPart(p) {
  downloadBytes(p.bytes, p.name, 'application/pdf')
}

function downloadAllParts() {
  for (const p of splitResult.value.parts) downloadPart(p)
}

// ================= Tab 4: PDF 瘦身压缩 =================
const compressInput = ref(null)
const compressDragging = ref(false)
const compressFile = ref(null)
const compressResult = ref(null)

async function onCompressChange(e) {
  const file = e.target.files?.[0]
  if (file) await loadCompressFile(file)
  e.target.value = ''
}

async function onCompressDrop(e) {
  compressDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) await loadCompressFile(file)
}

async function loadCompressFile(file) {
  const info = await readPdf(file)
  if (!info) return
  compressFile.value = info
  clearCompressResult()
  errorText.value = ''
}

function clearCompress() {
  compressFile.value = null
  clearCompressResult()
  errorText.value = ''
}

function clearCompressResult() {
  if (compressResult.value) URL.revokeObjectURL(compressResult.value.url)
  compressResult.value = null
}

async function runCompress() {
  if (!compressFile.value) return
  errorText.value = ''
  clearCompressResult()
  try {
    const result = await mupdf.compress(compressFile.value.buffer, { password: password.value || undefined })
    const before = compressFile.value.size
    const after = result.bytes.byteLength
    // 如实呈现：可能变大（已高度优化的 PDF 压缩收益极小甚至倒增），
    // 不粉饰成"一定变小"，否则用户会以为工具失效。
    const diff = before - after
    compressResult.value = {
      name: result.name,
      before,
      after,
      reduced: diff > 0,
      percent: Math.abs(((diff / before) * 100).toFixed(1)),
      url: URL.createObjectURL(new Blob([result.bytes], { type: 'application/pdf' })),
      bytes: result.bytes
    }
  } catch (err) {
    fail(err)
  }
}

function downloadCompressResult() {
  downloadBytes(compressResult.value.bytes, compressResult.value.name, 'application/pdf')
}

// ================= Tab 5: 提取 PDF 文字 =================
const extractInput = ref(null)
const extractDragging = ref(false)
const extractFile = ref(null)
const extractMode = ref('all')
const extractRange = ref('')
const extractResult = ref(null)

// 扫描件 / 纯图片 PDF 没有文本层，提取结果会是空串 —— 必须显式告知，
// 否则用户会误判为工具 bug（真实原因是不含文本层）。
const isEmptyExtract = computed(() => {
  if (!extractResult.value) return false
  return extractResult.value.parts.every((p) => !p.text || !p.text.trim())
})

async function onExtractChange(e) {
  const file = e.target.files?.[0]
  if (file) await loadExtractFile(file)
  e.target.value = ''
}

async function onExtractDrop(e) {
  extractDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) await loadExtractFile(file)
}

async function loadExtractFile(file) {
  const info = await readPdf(file)
  if (!info) return
  extractFile.value = info
  clearExtractResult()
  errorText.value = ''
}

function clearExtract() {
  extractFile.value = null
  clearExtractResult()
  errorText.value = ''
}

function clearExtractResult() {
  extractResult.value = null
}

async function runExtract() {
  if (!extractFile.value) return
  errorText.value = ''
  clearExtractResult()
  try {
    const result = await mupdf.extract(extractFile.value.buffer, {
      range: extractMode.value === 'range' ? extractRange.value.trim() : null,
      password: password.value || undefined
    })
    extractResult.value = { parts: result.parts }
  } catch (err) {
    fail(err)
  }
}

function fullExtractText() {
  if (!extractResult.value) return ''
  return extractResult.value.parts.map((p) => `----- ${t('document.pdfTools.pageLabel')} ${p.page} -----\n${p.text}`).join('\n\n')
}

function copyText(text) {
  navigator.clipboard.writeText(text)
  message.success(t('document.pdfTools.copied'))
}

function copyAllExtracted() {
  navigator.clipboard.writeText(fullExtractText())
  message.success(t('document.pdfTools.copied'))
}

function downloadExtracted() {
  const base = (extractFile.value?.name || 'document').replace(/\.pdf$/i, '')
  const blob = new Blob([fullExtractText()], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${base}.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

// ================= Tab 6: 页面整理（删除 / 保留） =================
const organizeInput = ref(null)
const organizeDragging = ref(false)
const organizeFile = ref(null)
const organizeMode = ref('delete')
const organizeRange = ref('')
const organizeResult = ref(null)

async function onOrganizeChange(e) {
  const file = e.target.files?.[0]
  if (file) await loadOrganizeFile(file)
  e.target.value = ''
}

async function onOrganizeDrop(e) {
  organizeDragging.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) await loadOrganizeFile(file)
}

async function loadOrganizeFile(file) {
  const info = await readPdf(file)
  if (!info) return
  organizeFile.value = info
  clearOrganizeResult()
  errorText.value = ''
}

function clearOrganizeFile() {
  organizeFile.value = null
  clearOrganizeResult()
  errorText.value = ''
}

function clearOrganizeResult() {
  if (organizeResult.value) URL.revokeObjectURL(organizeResult.value.url)
  organizeResult.value = null
}

async function runOrganize() {
  if (!organizeFile.value) return
  errorText.value = ''
  clearOrganizeResult()
  try {
    const keep = organizeMode.value === 'keep'
    const result = await mupdf.organize(organizeFile.value.buffer, {
      // worker 侧以「待删除页码」为输入，保留模式需先取反由上层换算
      mode: keep ? 'keep' : 'delete',
      range: organizeRange.value.trim(),
      password: password.value || undefined
    })
    organizeResult.value = {
      name: result.name,
      pageCount: result.pageCount,
      removed: result.removed,
      size: result.bytes.byteLength,
      url: URL.createObjectURL(new Blob([result.bytes], { type: 'application/pdf' })),
      bytes: result.bytes
    }
  } catch (err) {
    fail(err)
  }
}

function downloadOrganizeResult() {
  downloadBytes(organizeResult.value.bytes, organizeResult.value.name, 'application/pdf')
}

onUnmounted(() => {
  clearToImageResult()
  clearMergeResult()
  clearSplitResult()
  clearCompressResult()
  clearExtractResult()
  clearOrganizeResult()
  mupdf.terminate()
})
</script>

<style scoped>
.pdf-tools {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  padding: 32px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: var(--card-color);
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover,
.upload-area.drag-over {
  border-color: var(--primary-color);
  background-color: rgba(24, 160, 88, 0.04);
}

.upload-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.file-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.option-label {
  font-size: 13px;
  color: var(--text-color);
  flex-shrink: 0;
  min-width: 72px;
}

.action-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.progress-area {
  padding: 4px 0;
}

.error-area {
  padding: 4px 0;
}

.result {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-color);
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

/* 提取文字结果：按页分段 */
.extract-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.extract-row {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.extract-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 10px;
  background-color: rgba(128, 128, 128, 0.06);
}

.extract-body {
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 220px;
  overflow: auto;
  font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
}

.file-index {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--primary-color);
  color: #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.image-item {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.image-item img {
  max-width: 100%;
  max-height: 180px;
  border-radius: 4px;
  object-fit: contain;
}

.image-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
</style>

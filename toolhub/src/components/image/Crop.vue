<template>
  <div class="cropper-container">
    <n-card title="图片裁剪">
      <n-upload
        :max="1"
        accept="image/*"
        :show-file-list="false"
        @change="onFileChange"
      >
        <n-button>上传图片</n-button>
      </n-upload>
      <div v-if="imgSrc" class="cropper-wrapper">
        <div class="img-container">
          <img ref="image" :src="imgSrc" style="max-width: 100%;" />
        </div>
        <n-space class="mt-2">
          <n-button @click="getCroppedImage" type="primary">裁剪并预览</n-button>
          <n-button @click="clear">清空</n-button>
        </n-space>
      </div>
      <div v-if="croppedImg" class="preview">
        <h4>裁剪结果预览：</h4>
        <img :src="croppedImg" alt="裁剪结果" style="max-width: 100%; border: 1px solid #eee;" />
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Cropper from 'cropperjs'
import { NCard, NButton, NUpload, NSpace } from 'naive-ui'

const imgSrc = ref('')
const croppedImg = ref('')
const image = ref(null)
let cropper = null

function initCropper() {
  if (cropper) {
    cropper.destroy()
  }
  if (image.value) {
    cropper = new Cropper(image.value, {
      aspectRatio: 1,
      viewMode: 1,
      ready: function () {
        // 裁剪器准备就绪
      }
    })
  }
}

function onFileChange({ file }) {
  if (file && file.file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imgSrc.value = e.target.result
      croppedImg.value = ''
      // 等待DOM更新后初始化裁剪器
      setTimeout(initCropper, 100)
    }
    reader.readAsDataURL(file.file)
  }
}

function getCroppedImage() {
  if (cropper) {
    const canvas = cropper.getCroppedCanvas()
    croppedImg.value = canvas.toDataURL('image/jpeg')
  }
}

function clear() {
  imgSrc.value = ''
  croppedImg.value = ''
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
}

onBeforeUnmount(() => {
  if (cropper) {
    cropper.destroy()
    cropper = null
  }
})
</script>

<style>
/* Cropper.js 的必要样式 */
.cropper-container {
  direction: ltr;
  font-size: 0;
  line-height: 0;
  position: relative;
  touch-action: none;
  user-select: none;
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.cropper-wrap-box {
  overflow: hidden;
}

.cropper-drag-box {
  background-color: #fff;
  opacity: 0;
}

.cropper-modal {
  background-color: #000;
  opacity: 0.5;
}

.cropper-view-box {
  display: block;
  height: 100%;
  outline: 1px solid #39f;
  outline-color: rgba(51, 153, 255, 0.75);
  overflow: hidden;
  width: 100%;
}
</style>

<style scoped>
.cropper-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 0;
}

.cropper-wrapper {
  margin-top: 24px;
}

.img-container {
  max-height: 400px;
  overflow: hidden;
}

.preview {
  margin-top: 24px;
}

.mt-2 {
  margin-top: 12px;
}
</style> 
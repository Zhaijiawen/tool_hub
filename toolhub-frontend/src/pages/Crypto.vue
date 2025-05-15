<template>
  <div class="crypto-container">
    <n-card title="加密工具">
      <n-menu mode="horizontal" :options="menuOptions" />
      <div class="content">
        <router-view></router-view>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import { RouterLink } from 'vue-router'
import { NCard, NMenu } from 'naive-ui'

const menuOptions = [
  {
    label: '对称加密',
    key: 'symmetric',
    children: [
      {
        label: () => h(RouterLink, { to: '/crypto/aes' }, { default: () => 'AES加密' }),
        key: 'aes'
      },
      {
        label: () => h(RouterLink, { to: '/crypto/chacha20' }, { default: () => 'ChaCha20加密' }),
        key: 'chacha20'
      },
      {
        label: () => h(RouterLink, { to: '/crypto/des' }, { default: () => 'DES/3DES加密' }),
        key: 'des'
      }
    ]
  },
  {
    label: '非对称加密',
    key: 'asymmetric',
    children: [
      {
        label: () => h(RouterLink, { to: '/crypto/rsa' }, { default: () => 'RSA加密' }),
        key: 'rsa'
      },
      {
        label: () => h(RouterLink, { to: '/crypto/ecc' }, { default: () => 'ECC加密' }),
        key: 'ecc'
      },
      {
        label: () => h(RouterLink, { to: '/crypto/ed25519' }, { default: () => 'Ed25519加密' }),
        key: 'ed25519'
      }
    ]
  },
  {
    label: '哈希算法',
    key: 'hash',
    children: [
      {
        label: () => h(RouterLink, { to: '/crypto/hash' }, { default: () => '哈希生成器' }),
        key: 'hash'
      }
    ]
  },
  {
    label: '编码解码',
    key: 'codec',
    children: [
      {
        label: () => h(RouterLink, { to: '/crypto/jwt' }, { default: () => 'JWT编解码' }),
        key: 'jwt'
      },
      {
        label: () => h(RouterLink, { to: '/crypto/base64' }, { default: () => 'Base64编解码' }),
        key: 'base64'
      },
      {
        label: () => h(RouterLink, { to: '/crypto/url' }, { default: () => 'URL编解码' }),
        key: 'url'
      }
    ]
  }
]
</script>

<style scoped>
.crypto-container {
  padding: 20px;
}

.content {
  margin-top: 20px;
}
</style> 
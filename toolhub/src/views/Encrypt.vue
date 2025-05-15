<template>
  <div class="encrypt-view">
    <n-tabs type="line" animated>
      <!-- 对称加密 -->
      <n-tab-pane name="symmetric" :tab="$t('encrypt.symmetric')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <aes-encrypt />
          </n-grid-item>
          <n-grid-item>
            <chacha20-encrypt />
          </n-grid-item>
          <n-grid-item>
            <des-encrypt />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 非对称加密 -->
      <n-tab-pane name="asymmetric" :tab="$t('encrypt.asymmetric')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <rsa-encrypt />
          </n-grid-item>
          <n-grid-item>
            <ecc-encrypt />
          </n-grid-item>
          <n-grid-item>
            <ed25519-encrypt />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 哈希算法 -->
      <n-tab-pane name="hash" :tab="$t('encrypt.hash')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <sha-hash />
          </n-grid-item>
          <n-grid-item>
            <bcrypt-hash />
          </n-grid-item>
          <n-grid-item>
            <argon2-hash />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 密钥交换 -->
      <n-tab-pane name="keyExchange" :tab="$t('encrypt.keyExchange')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <diffie-hellman />
          </n-grid-item>
          <n-grid-item>
            <ecdh />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 数字签名 -->
      <n-tab-pane name="signature" :tab="$t('encrypt.signature')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <rsa-sign />
          </n-grid-item>
          <n-grid-item>
            <ecdsa-sign />
          </n-grid-item>
          <n-grid-item>
            <ed25519-sign />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <!-- 编码与解码 -->
      <n-tab-pane name="encoding" :tab="$t('encrypt.encoding')">
        <n-grid :cols="2" :x-gap="16" :y-gap="16">
          <n-grid-item>
            <base64-encode />
          </n-grid-item>
          <n-grid-item>
            <hex-encode />
          </n-grid-item>
          <n-grid-item>
            <url-encode />
          </n-grid-item>
          <n-grid-item>
            <html-encode />
          </n-grid-item>
          <n-grid-item>
            <jwt-encode />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { NGrid, NGridItem, NTabs, NTabPane } from 'naive-ui'
import AesEncrypt from '@/components/encrypt/AesEncrypt.vue'
import ChaCha20Encrypt from '@/components/encrypt/ChaCha20Encrypt.vue'
import DesEncrypt from '@/components/encrypt/DesEncrypt.vue'
import RsaEncrypt from '@/components/encrypt/RsaEncrypt.vue'
import EccEncrypt from '@/components/encrypt/EccEncrypt.vue'
import Ed25519Encrypt from '@/components/encrypt/Ed25519Encrypt.vue'
import ShaHash from '@/components/encrypt/ShaHash.vue'
import BcryptHash from '@/components/encrypt/BcryptHash.vue'
import Argon2Hash from '@/components/encrypt/Argon2Hash.vue'
import DiffieHellman from '@/components/encrypt/DiffieHellman.vue'
import Ecdh from '@/components/encrypt/Ecdh.vue'
import RsaSign from '@/components/encrypt/RsaSign.vue'
import EcdsaSign from '@/components/encrypt/EcdsaSign.vue'
import Ed25519Sign from '@/components/encrypt/Ed25519Sign.vue'
import Base64Encode from '@/components/encrypt/Base64Encode.vue'
import HexEncode from '@/components/encrypt/HexEncode.vue'
import UrlEncode from '@/components/encrypt/UrlEncode.vue'
import HtmlEncode from '@/components/encrypt/HtmlEncode.vue'
import JwtEncode from '@/components/encrypt/JwtEncode.vue'
</script>

<style scoped>
.encrypt-view {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 
<script setup lang="ts">
import { TranslationOutlined } from '@ant-design/icons-vue';
import { setLocale, currentLanguage } from '@/i18n';
const changeLang = (e: { key: string | number }) => {
  setLocale(e.key as 'zh-CN' | 'en-US');
};
</script>

<template>
  <div class="flex items-center">
    <a-dropdown>
      <TranslationOutlined />
      <template #overlay>
        <a-menu @click="changeLang" :selectedKeys="[currentLanguage]">
          <a-menu-item key="zh-CN">中文</a-menu-item>
          <a-menu-item key="en-US">English</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

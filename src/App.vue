<script setup lang="ts">
import { storeToRefs } from 'pinia';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';

import { useThemeStore } from '@/store/modules/theme';
import { usePageTitle } from '@/hooks/modules/usePageTitle';

usePageTitle();

const { locale } = useI18n();
const themeStore = useThemeStore();
const { themeConfig } = storeToRefs(themeStore);

const antLocale = computed(() => (locale.value === 'zh-CN' ? zhCN : enUS));
</script>

<template>
  <a-config-provider :theme="themeConfig" :locale="antLocale">
    <RouterView />
  </a-config-provider>
</template>

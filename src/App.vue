<script setup lang="ts">
import { storeToRefs } from 'pinia';
import enUS from 'tdesign-vue-next/es/locale/en_US';
import zhCN from 'tdesign-vue-next/es/locale/zh_CN';
import type { GlobalConfigProvider } from 'tdesign-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';

import { useThemeStore } from '@/store/modules/theme';
import { useUserStore } from '@/store';
import { usePageTitle } from '@/hooks/modules/usePageTitle';
import { isUndefined } from 'lodash-es';

usePageTitle();

const { locale } = useI18n();
const themeStore = useThemeStore();
const userStore = useUserStore();
const { currentTheme } = storeToRefs(themeStore);

const tdLocale = computed(
  () => (locale.value === 'zh-CN' ? zhCN : enUS) as unknown as GlobalConfigProvider,
);
const watermark = computed(() => {
  const { userId, nickname } = userStore.user || {};
  if (isUndefined(userId)) return '';
  return `${nickname}(${userId})`;
});
</script>

<template>
  <t-config-provider :global-config="tdLocale">
    <t-watermark
      :watermark-content="{
        text: watermark,
        fontColor: currentTheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        fontSize: 14,
      }"
      :x="80"
      :y="80"
    >
      <RouterView />
    </t-watermark>
  </t-config-provider>
</template>

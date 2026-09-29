<script setup lang="ts">
import { CaretDownSmallIcon, EarthIcon } from 'tdesign-icons-vue-next';
import type { DropdownOption } from 'tdesign-vue-next';

import { setLocale, currentLanguage, localeList, t, type SupportedLocale } from '@/i18n';

const langOptions = computed(() =>
  localeList.map((item) => ({
    content: item.label,
    value: item.value,
    active: item.value === currentLanguage.value,
  })),
);

const changeLang = (item: DropdownOption) => {
  const lang = item.value as SupportedLocale;
  if (!lang || lang === currentLanguage.value) return;
  setLocale(lang);
};
</script>

<template>
  <t-dropdown trigger="click" :options="langOptions" @click="changeLang">
    <t-button
      variant="text"
      type="button"
      class="locale"
      :aria-label="t('语言')"
      :title="t('语言')"
    >
      <EarthIcon size="16px" />
      <CaretDownSmallIcon size="16px" />
    </t-button>
  </t-dropdown>
</template>

<style scoped lang="less">
.locale.t-button {
  height: 24px;
  padding: 0 4px;
  font-size: 14px;
  color: var(--td-text-color-secondary);
  background: transparent;
  border: 0;
  box-shadow: none;

  &:hover,
  &:focus,
  &:focus-visible,
  &:active {
    color: var(--td-text-color-primary);
    background: transparent;
    border: 0;
    box-shadow: none;
  }
}

.locale :deep(.t-button__text) {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}
</style>

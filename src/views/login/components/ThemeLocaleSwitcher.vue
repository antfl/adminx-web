<script setup lang="ts">
import { EarthIcon, CaretDownSmallIcon } from 'tdesign-icons-vue-next';
import type { DropdownOption } from 'tdesign-vue-next';

import { setLocale, currentLanguage, localeList, type SupportedLocale } from '@/i18n';

const langOptions = computed(() =>
  localeList.map((item) => ({
    content: item.label,
    value: item.value,
    active: item.value === currentLanguage.value,
  })),
);

const changeLang = (item: DropdownOption) => {
  setLocale(item.value as SupportedLocale);
};

const currentLangLabel = computed(() => {
  return localeList.find((item) => item.value === currentLanguage.value)?.label;
});
</script>

<template>
  <t-dropdown trigger="click" :options="langOptions" @click="changeLang">
    <button type="button" class="switcher__trigger">
      <EarthIcon />
      <span>{{ $t('语言') }}({{ currentLangLabel }})</span>
      <CaretDownSmallIcon />
    </button>
  </t-dropdown>
</template>

<style scoped lang="less">
.switcher__trigger {
  display: inline-flex;
  gap: 2px;
  align-items: center;
  padding: 0;
  margin: 0;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  color: var(--td-text-color-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;

  &:hover {
    color: var(--td-text-color-primary);
  }
}
</style>

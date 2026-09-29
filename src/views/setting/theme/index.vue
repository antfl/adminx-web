<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { storeToRefs } from 'pinia';

import { normalizeHex } from '@/utils/brandColor';
import { useThemeStore } from '@/store/modules/theme';

const route = useRoute();
const themeStore = useThemeStore();
const { primaryColor } = storeToRefs(themeStore);
const recentColors = useLocalStorage<string[]>('theme-recent-colors', []);

const palette = [
  '#FFB900',
  '#FF8C00',
  '#F7630C',
  '#CA5010',
  '#DA3B01',
  '#EF6950',
  '#D13438',
  '#FF4343',
  '#E74856',
  '#E81123',
  '#EA005E',
  '#C30052',
  '#E3008C',
  '#BF0077',
  '#C239B3',
  '#9A0089',
  '#0078D4',
  '#0063B1',
  '#8E8CD8',
  '#6B69D6',
  '#8764B8',
  '#744DA9',
  '#B146C2',
  '#881798',
  '#0099BC',
  '#2D7D9A',
  '#00B7C3',
  '#038387',
  '#00B294',
  '#018574',
  '#00CC6A',
  '#10893E',
  '#7A7574',
  '#5D5A58',
  '#68768A',
  '#515C6B',
  '#567C73',
  '#486860',
  '#498205',
  '#107C10',
  '#767676',
  '#4C4A48',
  '#69797E',
  '#4A5459',
  '#647C64',
  '#525E54',
  '#847545',
  '#7E735F',
];

const currentHex = computed(() => normalizeHex(primaryColor.value));

const recentList = computed(() => {
  const list = recentColors.value.map((item) => normalizeHex(item)).filter(Boolean);
  if (currentHex.value && !list.includes(currentHex.value)) {
    return [currentHex.value, ...list].slice(0, 6);
  }
  return list.slice(0, 6);
});

const isActive = (value: string) => currentHex.value === normalizeHex(value);

const checkColor = (hex: string) => {
  const value = parseInt(hex.slice(1), 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  const lightness = (red * 299 + green * 587 + blue * 114) / 1000;
  return lightness > 160 ? '#1a1a1a' : '#fff';
};

const remember = (hex: string) => {
  recentColors.value = [
    hex,
    ...recentColors.value.filter((item) => normalizeHex(item) !== hex),
  ].slice(0, 6);
};

const applyColor = (value: string, saveRecent = true) => {
  const hex = normalizeHex(value);
  if (!hex) return;
  if (hex !== currentHex.value) themeStore.setPrimaryColor(hex);
  if (saveRecent) remember(hex);
};

const onPickerVisible = (visible: boolean) => {
  if (!visible && currentHex.value) remember(currentHex.value);
};
</script>

<template>
  <h1 class="page-title">{{ route.meta.title }}</h1>
  <section class="panel">
    <header class="panel__head">
      <t-icon name="palette" size="18px" />
      <span>{{ $t('主题色') }}</span>
    </header>

    <h2 class="panel__label">{{ $t('最近使用的颜色') }}</h2>
    <div class="swatches recent">
      <button
        v-for="color in recentList"
        :key="color"
        type="button"
        class="swatch"
        :class="{ active: isActive(color) }"
        :style="{ background: color }"
        :aria-label="color"
        @click="applyColor(color)"
      >
        <t-icon v-if="isActive(color)" name="check" :style="{ color: checkColor(color) }" />
      </button>
    </div>

    <h2 class="panel__label">{{ $t('预设颜色') }}</h2>
    <div class="swatches palette">
      <button
        v-for="color in palette"
        :key="color"
        type="button"
        class="swatch"
        :class="{ active: isActive(color) }"
        :style="{ background: color }"
        :aria-label="color"
        @click="applyColor(color)"
      >
        <t-icon v-if="isActive(color)" name="check" :style="{ color: checkColor(color) }" />
      </button>
    </div>

    <footer class="panel__foot">
      <span>{{ $t('自定义颜色') }}</span>
      <t-popup trigger="click" placement="top-right" @visible-change="onPickerVisible">
        <t-button variant="outline">{{ $t('选择颜色') }}</t-button>
        <template #content>
          <t-color-picker-panel
            :value="primaryColor"
            format="HEX"
            :enable-alpha="false"
            :color-modes="['monochrome']"
            @change="(value: string) => applyColor(value, false)"
          />
        </template>
      </t-popup>
    </footer>
  </section>
</template>

<style scoped lang="less">
.page-title {
  margin: 0 0 16px;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--td-text-color-primary);
}

.panel {
  max-width: 720px;
  padding: 16px 20px 0;
  background: var(--td-bg-color-container);
  border: 1px solid var(--td-component-stroke);
  border-radius: var(--td-radius-medium);
}

.panel__head {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: var(--td-text-color-primary);
}

.panel__label {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 400;
  color: var(--td-text-color-secondary);
}

.swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recent {
  margin-bottom: 24px;
}

.palette {
  display: grid;
  grid-template-columns: repeat(8, 40px);
  margin-bottom: 20px;
}

.swatch {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  cursor: pointer;
  border: 1px solid rgb(0 0 0 / 8%);
  border-radius: 4px;

  &:hover {
    outline: 1px solid var(--td-text-color-placeholder);
    outline-offset: 1px;
  }

  &.active {
    outline: 2px solid var(--td-text-color-primary);
    outline-offset: 1px;
  }
}

.panel__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  margin: 0 -20px;
  color: var(--td-text-color-primary);
  border-top: 1px solid var(--td-component-stroke);
}
</style>

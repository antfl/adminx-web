<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.currentTheme === 'dark');
</script>

<template>
  <button
    type="button"
    class="theme-tabs"
    :class="{ dark: isDark }"
    :aria-label="isDark ? $t('切换亮色') : $t('切换暗色')"
    :title="isDark ? $t('切换亮色') : $t('切换暗色')"
    @click="themeStore.toggleTheme()"
  >
    <span class="theme-tabs__block"></span>
    <span class="item" :class="{ active: !isDark }">
      <t-icon name="sunny" size="12px" />
    </span>
    <span class="item" :class="{ active: isDark }">
      <t-icon name="moon" size="12px" />
    </span>
  </button>
</template>

<style scoped lang="less">
.theme-tabs {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex: none;
  width: 48px;
  height: 24px;
  padding: 2px;
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: var(--td-bg-color-component);
  border: 1px solid var(--td-component-stroke);
  border-radius: var(--td-radius-default);

  &.dark .theme-tabs__block {
    left: 26px;
  }
}

.theme-tabs__block {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: var(--td-bg-color-container);
  border-radius: calc(var(--td-radius-default) - 1px);
  box-shadow: var(--td-shadow-1);
  transition: left 0.24s cubic-bezier(0.38, 0, 0.24, 1);
}

.item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 18px;
  color: var(--td-text-color-placeholder);
  pointer-events: none;

  &.active {
    color: var(--td-brand-color);
  }
}
</style>

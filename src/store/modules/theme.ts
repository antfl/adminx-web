import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { watch, computed } from 'vue';
import config from '@/config/index.json';
import { applyBrandColor } from '@/utils/brandColor';

export const useThemeStore = defineStore('theme', () => {
  const mode = useLocalStorage('theme-mode', 'light');
  const primaryColor = useLocalStorage('primary-color', config.themeColor);

  const currentTheme = computed<'light' | 'dark'>(() => (mode.value === 'dark' ? 'dark' : 'light'));

  const toggleTheme = () => {
    mode.value = currentTheme.value === 'dark' ? 'light' : 'dark';
  };

  const setPrimaryColor = (color: string) => {
    primaryColor.value = color;
  };

  watch(
    [currentTheme, primaryColor],
    () => {
      document.documentElement.setAttribute('theme-mode', currentTheme.value);
      applyBrandColor(primaryColor.value);
    },
    { immediate: true },
  );

  return {
    currentTheme,
    primaryColor,
    toggleTheme,
    setPrimaryColor,
  };
});

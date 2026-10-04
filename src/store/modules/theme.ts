import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { watch, computed } from 'vue';
import config from '@/config/index.json';
import { applyBrandColor } from '@/utils/brandColor';

export const useThemeStore = defineStore('theme', () => {
  const mode = useLocalStorage('theme-mode', 'light');
  const primaryColor = useLocalStorage('primary-color', config.themeColor);

  const currentTheme = computed<'light' | 'dark'>(() => (mode.value === 'dark' ? 'dark' : 'light'));

  const applyThemeMode = (next: 'light' | 'dark') => {
    mode.value = next;
    document.documentElement.setAttribute('theme-mode', next);
    applyBrandColor(primaryColor.value);
  };

  const toggleTheme = () => {
    const next = currentTheme.value === 'dark' ? 'light' : 'dark';
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof document.startViewTransition !== 'function') {
      applyThemeMode(next);
      return;
    }
    try {
      document.startViewTransition(() => applyThemeMode(next));
    } catch {
      applyThemeMode(next);
    }
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

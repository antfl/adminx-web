import { defineStore } from 'pinia';
import { theme } from 'ant-design-vue';
import type { ThemeConfig } from 'ant-design-vue/es/config-provider/context';
import { useDebounceFn, useLocalStorage, usePreferredDark } from '@vueuse/core';
import { watch, computed, type ComputedRef } from 'vue';
import config from '@/config/index.json';
export type ThemeMode = 'light' | 'dark' | 'auto';
const { defaultAlgorithm, darkAlgorithm, defaultSeed } = theme;

export const useThemeStore = defineStore('theme', () => {
  // 持久化主题模式（支持 light、dark、auto）
  const themeMode = useLocalStorage<ThemeMode>('theme-mode', config.themeMode);

  // 持久化主色调
  const primaryColor = useLocalStorage('primary-color', config.themeColor);

  // 获取系统深色模式偏好
  const prefersDark = usePreferredDark();

  // 计算实际应用的主题（auto 模式下跟随系统）
  const currentTheme = computed<'light' | 'dark'>(() => {
    if (themeMode.value === 'auto') {
      return prefersDark.value ? 'dark' : 'light';
    }
    return themeMode.value;
  });

  // 计算主题配置
  const themeConfig = computed<ThemeConfig>(() => ({
    algorithm: currentTheme.value === 'dark' ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: primaryColor.value,
      borderRadius: 2,
    },
  }));

  // 生成 CSS 变量对象
  const cssVars = () => {
    const mapToken =
      currentTheme.value === 'dark' ? darkAlgorithm(defaultSeed) : defaultAlgorithm(defaultSeed);

    const excludeUnits = ['zIndex', 'fontWeight', 'opacity', 'scale'];
    const vars: Record<string, string> = {};

    Object.entries(mapToken).forEach(([key, value]) => {
      const varName = `--${key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}`;
      let varValue = value;

      if (typeof value === 'number' && !excludeUnits.some((k) => key.includes(k))) {
        varValue = `${value}px`;
      }
      vars[varName] = String(varValue);
    });

    localStorage.setItem('bgThemeColor', vars['--color-bg-elevated']);

    // 添加主色调变量
    vars['--color-primary'] = primaryColor.value;
    return vars;
  };

  // 应用主题到 DOM
  const applyTheme = () => {
    const root = document.documentElement;
    const vars = cssVars();

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // 设置 data-theme
    root.setAttribute('data-theme', currentTheme.value);
  };

  // 切换主题模式
  const toggleTheme = (mode?: ThemeMode) => {
    if (mode) {
      themeMode.value = mode;
      return;
    }

    // 循环切换
    const modes = ['light', 'dark', 'auto'] as const;
    const currentIndex = modes.indexOf(themeMode.value);
    themeMode.value = modes[(currentIndex + 1) % modes.length];
  };

  // 设置主色
  const setPrimaryColor = useDebounceFn((color: string) => {
    primaryColor.value = color;
  }, 500);

  const themeChangeCallbacks = new Set<() => void>();
  const themeChange = (callback: () => void) => {
    themeChangeCallbacks.add(callback);
    return () => {
      themeChangeCallbacks.delete(callback);
    };
  };

  // 监听主题相关变化并应用
  watch(
    [currentTheme, primaryColor],
    () => {
      applyTheme();
      themeChangeCallbacks.forEach((cb) => cb());
    },
    { immediate: true },
  );

  return {
    themeChange,
    themeMode: themeMode as ComputedRef<ThemeMode>,
    currentTheme: currentTheme as ComputedRef<'light' | 'dark'>,
    primaryColor: primaryColor as ComputedRef<string>,
    themeConfig,
    toggleTheme,
    setPrimaryColor,
  };
});

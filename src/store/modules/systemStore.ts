import { defineStore } from 'pinia';

export type themeType = 'light' | 'dark';

export type layoutType = 'classic' | 'unbounded';
type MenuMode = 'vertical' | 'horizontal' | 'inline';

export const useSystemStore = defineStore('system', () => {
  const themeStr: themeType | null = localStorage.getItem('theme') as themeType;
  const theme = ref<themeType>(themeStr ?? 'light');
  const collapsed = localStorage.getItem('collapsed') === 'true';
  const isCollapsed = ref(collapsed);

  const layoutConfig = computed(() => {
    return {
      // 经典
      classic: {
        tabs: {
          style: '',
        },
        collapsed: true,
        menu: {
          style: 'overflow-y-auto h-[calc(100vh-64px)]',
          mode: 'inline' as MenuMode,
        },
      },
      // 无界
      unbounded: {
        tabs: {
          style: '',
        },
        collapsed: false,
        menu: {
          style: '',
          mode: 'horizontal' as MenuMode,
        },
      },
    };
  });

  const layoutStr: layoutType | null = localStorage.getItem('layout') as layoutType;
  const currentLayout = ref<layoutType>(layoutStr ?? 'classic');

  const layout = computed(() => {
    return layoutConfig.value[currentLayout.value];
  });

  const setTheme = (value: themeType) => {
    localStorage.setItem('theme', value);
    theme.value = value;
  };

  const toggleCollapsed = () => {
    localStorage.setItem('collapsed', `${!isCollapsed.value}`);
    isCollapsed.value = !isCollapsed.value;
  };

  const setLayout = (value: layoutType) => {
    localStorage.setItem('layout', value);
    currentLayout.value = value;
  };

  const setCollapsed = (value: boolean) => {
    isCollapsed.value = value;
  };

  return {
    theme,
    isCollapsed,
    setTheme,
    layout,
    setLayout,
    currentLayout,
    toggleCollapsed,
    setCollapsed,
  };
});

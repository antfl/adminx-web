import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { useScreenSize } from '@/hooks/modules/useScreenSize';

export type LayoutType = 'CLASSIC' | 'UNBOUNDED';
type MenuMode = 'vertical' | 'horizontal' | 'inline';

const layoutConfig = {
  CLASSIC: {
    collapsed: true,
    menu: {
      style: 'overflow-y-auto h-[calc(100vh_-_var(--header-height))]',
      mode: 'inline' as MenuMode,
    },
  },
  UNBOUNDED: {
    collapsed: false,
    menu: {
      style: '',
      mode: 'horizontal' as MenuMode,
    },
  },
};

export const useSystemStore = defineStore('system', () => {
  const isCollapsed = useStorage('collapsed', false);
  const currentLayout = useStorage<LayoutType>('layout', 'CLASSIC');

  const layout = computed(() => layoutConfig[currentLayout.value]);

  const { onChange } = useScreenSize();
  const unregister = onChange((isMobile: boolean) => {
    if (isMobile) {
      currentLayout.value = 'UNBOUNDED';
      isCollapsed.value = true;
    }
  });

  const toggleCollapsed = () => (isCollapsed.value = !isCollapsed.value);
  const setLayout = (value: LayoutType) => (currentLayout.value = value);
  const setCollapsed = (value: boolean) => (isCollapsed.value = value);

  onUnmounted(() => {
    unregister();
  });

  return {
    isCollapsed,
    layout,
    currentLayout,
    setLayout,
    toggleCollapsed,
    setCollapsed,
  };
});

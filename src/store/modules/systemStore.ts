import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';

export const useSystemStore = defineStore('system', () => {
  const isCollapsed = useStorage('collapsed', false);

  const toggleCollapsed = () => {
    isCollapsed.value = !isCollapsed.value;
  };

  return {
    isCollapsed,
    toggleCollapsed,
  };
});

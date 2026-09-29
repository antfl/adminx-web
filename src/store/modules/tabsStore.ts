import { defineStore } from 'pinia';

import { t } from '@/i18n';
import router from '@/router';

type RecentTab = {
  path: string;
  title: string;
};

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<RecentTab[]>([]);
  const activeTab = ref('/');

  tabs.value.push({ path: '/', title: t('首页') });

  const addTab = (route: { path: string; meta?: { title?: unknown } }) => {
    const title = route.meta?.title;
    if (!title) return;

    const existingTab = tabs.value.find((tab) => tab.path === route.path);
    if (existingTab) {
      activeTab.value = route.path;
      return;
    }

    tabs.value.push({
      path: route.path,
      title: String(title),
    });
    activeTab.value = route.path;
  };

  const setActiveTab = async (path: string) => {
    const tabExists = tabs.value.some((tab) => tab.path === path);
    activeTab.value = tabExists ? path : '/';

    if (router.currentRoute.value.path !== path) {
      await router.push(path);
    }
  };

  return {
    tabs,
    activeTab,
    addTab,
    setActiveTab,
  };
});

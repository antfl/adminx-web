import { HomeOutlined } from '@ant-design/icons-vue';
import { defineStore } from 'pinia';

import { t } from '@/i18n';
import router from '@/router';
import { MenuTab } from '@/types/meun';

export const useTabsStore = defineStore('tabs', () => {
  const tabs = ref<MenuTab[]>([]);
  const activeTab = ref('');
  const homeTab = ref<MenuTab>({
    path: '/home',
    title: t('首页'),
    closable: false,
    icon: HomeOutlined,
  });

  // 初始化首页
  if (!tabs.value.length) {
    tabs.value.push(homeTab.value);
    activeTab.value = homeTab.value.path;
  }

  // 添加新标签（不激活）
  const addTab = (route: any) => {
    if (!route.meta.title) return;

    // 如果标签已存在，只更新激活状态
    const existingTab = tabs.value.find((t: any) => t.path === route.path);
    if (existingTab) {
      activeTab.value = route.path;
      return;
    }

    // 添加新标签
    tabs.value.push({
      path: route.path,
      title: route.meta?.title,
      closable: route.path !== '/home',
      icon: route.meta?.icon,
    });

    // 只更新激活状态，不进行路由跳转
    activeTab.value = route.path;
  };

  /** 移除标签 */
  const removeTab = async (path: string) => {
    if (path === '/home') return;

    const removeIndex = tabs.value.findIndex((t: any) => t.path === path);
    if (removeIndex === -1) return;

    tabs.value.splice(removeIndex, 1);

    // 如果移除的是当前激活标签，需要激活另一个标签并进行路由跳转
    if (activeTab.value === path) {
      // 尝试激活最近访问的标签
      const newActiveTab = tabs.value[removeIndex] || tabs.value[removeIndex - 1] || homeTab.value;

      // 直接进行路由跳转
      await router.push(newActiveTab.path);
    }
  };

  /** 设置当前激活标签并进行路由跳转 */
  const setActiveTab = async (path: string) => {
    // 确保标签存在
    const tabExists = tabs.value.some((t) => t.path === path);

    // 更新激活状态
    activeTab.value = tabExists ? path : '/home';

    // 只有在当前路由不是目标路由时才跳转
    if (router.currentRoute.value.path !== path) {
      await router.push(path);
    }
  };

  /**
   * tab 排序
   * @param newIndex 目标位置
   * @param oldIndex 开始位置
   */
  const draggableTabs = (newIndex: number, oldIndex: number) => {
    const currRow = tabs.value.splice(oldIndex, 1)[0];
    tabs.value.splice(newIndex, 0, currRow);
  };

  return {
    tabs,
    activeTab,
    homeTab,
    addTab,
    removeTab,
    setActiveTab,
    draggableTabs,
  };
});

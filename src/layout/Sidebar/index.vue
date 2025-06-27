<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useSystemStore } from '@/store/modules/systemStore';
import { useTabsStore } from '@/store/modules/tabsStore';

import MenuRecursive from './MenuRecursive.vue';

const tabsStore = useTabsStore();
const systemStore = useSystemStore();

const activeTab = computed(() => tabsStore.activeTab);
const router = useRouter();
const menuRoutes = computed(() => {
  return router.options.routes;
});
const handleMenuClick = ({ key }: { key: string | number }) => {
  tabsStore.setActiveTab(key as string);
  router.push(key as string);
};
</script>

<template>
  <a-menu
    class="[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    :theme="systemStore.theme"
    :mode="systemStore.layout.menu.mode"
    :inline-collapsed="systemStore.isCollapsed"
    :class="systemStore.layout.menu.style"
    :selectedKeys="[activeTab]"
    @click="handleMenuClick"
  >
    <MenuRecursive :routes="menuRoutes" />
  </a-menu>
</template>

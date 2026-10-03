<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { filterRoutes } from '@/utils/router';
import { usePermissionStore } from '@/store/modules/permission';
import { useSystemStore } from '@/store/modules/systemStore';
import { useTabsStore } from '@/store/modules/tabsStore';
import { cloneDeep } from 'lodash-es';

import MenuRecursive from './MenuRecursive.vue';

const router = useRouter();
const route = useRoute();
const tabsStore = useTabsStore();
const systemStore = useSystemStore();
const permissionStore = usePermissionStore();
const activeTab = computed(() => tabsStore.activeTab);
const menuRoutes = computed(() => filterRoutes(cloneDeep(permissionStore.menuRoutes)));

interface CustomMenuItem {
  key: string;
  children?: CustomMenuItem[];
}

const routeMap = ref<Map<string, any>>(new Map());
const expanded = ref<string[]>([]);

const handleMenuChange = (value: string | number) => {
  const path = String(value);
  const target = routeMap.value.get(path);

  if (target?.meta?.externalUrl) {
    window.open(target.meta.externalUrl, '_blank');
    return;
  }

  tabsStore.setActiveTab(path);
  router.push(path);
};

const resolvePath = (path: string, basePath: string) => {
  const normalizedBase = basePath.replace(/\/+$/, '');
  const normalizedPath = (path || '').replace(/^\/+/, '');

  if (!normalizedBase) return `/${normalizedPath}`;
  if (!normalizedPath) return normalizedBase;

  return `${normalizedBase}/${normalizedPath}`;
};

function indexRoutes(routes: any[], basePath: string): CustomMenuItem[] {
  return routes
    .map((item) => {
      if (item.meta?.directlyShowChildren && item.children) {
        return indexRoutes(item.children, basePath);
      }

      const fullPath = resolvePath(item.path, basePath);
      routeMap.value.set(fullPath, item);

      const menuItem: CustomMenuItem = { key: fullPath };
      if (item.children?.length) {
        menuItem.children = indexRoutes(item.children, fullPath);
      }
      return menuItem;
    })
    .flat();
}

const menuItems = computed(() => indexRoutes(menuRoutes.value, ''));

const findParentKeys = (
  items: CustomMenuItem[],
  targetKey: string,
  parents: string[] = [],
): string[] => {
  for (const item of items) {
    if (item.key === targetKey) return parents;
    if (item.children) {
      const found = findParentKeys(item.children, targetKey, [...parents, item.key]);
      if (found.length) return found;
    }
  }
  return [];
};

const updateExpanded = () => {
  if (!activeTab.value || !menuItems.value.length) return;
  expanded.value = findParentKeys(menuItems.value, activeTab.value);
};

watch(() => route.path, updateExpanded);
onMounted(updateExpanded);
</script>

<template>
  <t-menu
    :value="activeTab"
    v-model:expanded="expanded"
    :collapsed="systemStore.isCollapsed"
    class="aside-menu"
    @change="handleMenuChange"
  >
    <MenuRecursive :routes="menuRoutes" />
  </t-menu>
</template>

<style scoped lang="less">
.aside-menu {
  flex: 1;
  min-height: 0;
  overflow: auto;
  border: 0;
}

html[theme-mode='dark'] .aside-menu {
  :deep(.t-menu__item.t-is-active:not(.t-is-opened)) {
    color: var(--td-brand-color);
    background-color: color-mix(in srgb, var(--td-brand-color) 16%, var(--td-bg-color-container));
  }

  :deep(.t-menu__item.t-is-active:not(.t-is-opened) .t-icon) {
    color: var(--td-brand-color);
  }
}
</style>

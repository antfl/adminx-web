<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { MenuOutlined } from '@ant-design/icons-vue';
import { filterRoutes } from '@/utils/router';
import { usePermissionStore } from '@/store/modules/permission';
import { useSystemStore } from '@/store/modules/systemStore';
import { useTabsStore } from '@/store/modules/tabsStore';
import { cloneDeep } from 'lodash-es';

const router = useRouter();
const route = useRoute();
const tabsStore = useTabsStore();
const systemStore = useSystemStore();
const permissionStore = usePermissionStore();
const activeTab = computed(() => tabsStore.activeTab);
const menuRoutes = computed(() => filterRoutes(cloneDeep(permissionStore.menuRoutes)));

interface CustomMenuItem {
  key: string;
  label?: any;
  icon?: any;
  children?: CustomMenuItem[];
  [key: string]: any;
}

const routeMap = ref<Map<string, any>>(new Map());
const openKeys = ref<string[]>([]);

const handleMenuClick = ({ key }: { key: string | number }) => {
  const path = key as string;
  const route = routeMap.value.get(path);

  if (route?.meta?.externalUrl) {
    window.open(route.meta.externalUrl, '_blank');
    return;
  }

  tabsStore.setActiveTab(key as string);
  router.push(key as string);
};

const resolvePath = (path: string, basePath: string) => {
  const normalizedBase = basePath.replace(/\/+$/, '');
  const normalizedPath = (path || '').replace(/^\/+/, '');

  if (!normalizedBase) return `/${normalizedPath}`;
  if (!normalizedPath) return normalizedBase;

  return `${normalizedBase}/${normalizedPath}`;
};

function convertRoutesToMenuItems(routes: any[], basePath: string): CustomMenuItem[] {
  return routes
    .map((route) => {
      if (route.meta?.directlyShowChildren && route.children) {
        return convertRoutesToMenuItems(route.children, basePath);
      }

      const fullPath = resolvePath(route.path, basePath);
      routeMap.value.set(fullPath, route);

      const menuItem: any = {
        key: fullPath,
        label: route.meta?.title,
      };

      if (route.meta?.icon) {
        menuItem.icon = () => h(route.meta.icon);
      }

      if (route.children && route.children.length > 0) {
        menuItem.children = convertRoutesToMenuItems(route.children, fullPath);
      }

      return menuItem;
    })
    .flat();
}

const menuItems = computed(() => {
  return convertRoutesToMenuItems(menuRoutes.value, '');
});

const findParentKeys = (
  items: CustomMenuItem[],
  targetKey: string,
  parents: string[] = [],
): string[] => {
  if (!items) return [];

  for (const item of items) {
    if (!item) continue;

    const key = item.key as string;
    if (key === targetKey) {
      return parents;
    }

    if (item.children) {
      const found = findParentKeys(item.children, targetKey, [...parents, key]);
      if (found.length) {
        return found;
      }
    }
  }

  return [];
};

const updateOpenKeys = () => {
  if (!activeTab.value || !menuItems.value) return;

  openKeys.value = findParentKeys(menuItems.value, activeTab.value);
};

watch(
  () => route.path,
  () => {
    updateOpenKeys();
  },
);

onMounted(() => {
  updateOpenKeys();
});

const handleOpenChange = (keys: string[]) => {
  openKeys.value = keys;
};
</script>

<template>
  <a-menu
    class="[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    :items="menuItems"
    :mode="systemStore.layout.menu.mode"
    :inline-collapsed="systemStore.isCollapsed"
    :class="systemStore.layout.menu.style"
    :selectedKeys="[activeTab]"
    :openKeys="openKeys"
    @click="handleMenuClick"
    @update:openKeys="handleOpenChange"
  >
    <template #overflowedIndicator>
      <MenuOutlined />
    </template>
  </a-menu>
</template>

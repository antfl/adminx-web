<script setup lang="ts">
import { useRouter } from 'vue-router';
import { MenuOutlined } from '@ant-design/icons-vue';
import { filterRoutes } from '@/utils/router';
import { usePermissionStore } from '@/store/modules/permission';
import { useSystemStore } from '@/store/modules/systemStore';
import { useTabsStore } from '@/store/modules/tabsStore';
import { MenuProps } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

const router = useRouter();
const tabsStore = useTabsStore();
const systemStore = useSystemStore();
const permissionStore = usePermissionStore();
const activeTab = computed(() => tabsStore.activeTab);
const menuRoutes = computed(() => filterRoutes(cloneDeep(permissionStore.menuRoutes)));

const routeMap = ref<Map<string, any>>(new Map());

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

function convertRoutesToMenuItems(routes: any[], basePath: string): MenuProps['items'] {
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
</script>

<template>
  <a-menu
    class="[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    :items="menuItems"
    :mode="systemStore.layout.menu.mode"
    :inline-collapsed="systemStore.isCollapsed"
    :class="systemStore.layout.menu.style"
    :selectedKeys="[activeTab]"
    @click="handleMenuClick"
  >
    <template #overflowedIndicator>
      <MenuOutlined />
    </template>
  </a-menu>
</template>

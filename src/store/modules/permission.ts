import { defineStore } from 'pinia';
import { FrownOutlined } from '@ant-design/icons-vue';
import { constantRoutes } from '@/router/routes';
import type { RouteRaw } from '@/types/router';
import { useLocalStorage } from '@vueuse/core';
import { defineAsyncComponent } from 'vue';
import { Menu } from '@/types/meun';

interface PermissionState {
  menuRoutes: RouteRaw[];
  permissions: Set<string>;
  areRoutesAdded: boolean;
}

// 使用 VueUse 的 localStorage 管理权限持久化
const permissionStorage = useLocalStorage<string[]>('permission:keys', [], {
  serializer: {
    read: (v) => (v ? JSON.parse(v) : []),
    write: (v) => JSON.stringify(v),
  },
});

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    menuRoutes: [],
    permissions: new Set(permissionStorage.value),
    areRoutesAdded: false,
  }),

  actions: {
    // 设置路由已添加状态
    setRoutesAdded(added: boolean) {
      this.areRoutesAdded = added;
    },

    // 设置权限数据
    setPermissions(menus: Menu[], permissions: string[]) {
      // 动态转换菜单为路由
      const dynamicRoutes = this.transformMenusToRoutes(menus);
      // 合并静态路由
      this.menuRoutes = [...constantRoutes, ...dynamicRoutes];

      // 存储权限点并更新持久化
      this.permissions = new Set(permissions);
      permissionStorage.value = permissions;
      this.areRoutesAdded = false;
    },

    // 将后端菜单转换为前端路由
    transformMenusToRoutes(menus: Menu[]): RouteRaw[] {
      return menus.map((menu) => {
        // 处理动态导入
        const component = menu.component
          ? defineAsyncComponent(() => import(/* @vite-ignore */ `@/views/${menu.component}.vue`))
          : undefined;

        const route: RouteRaw = {
          path: menu.path,
          name: menu.name,
          component,
          meta: {
            title: menu.titleZh,
            icon: FrownOutlined,
            cache: menu.cache,
            hidden: menu.hidden,
            permission: menu.permission,
          },
          children: menu.children?.length ? this.transformMenusToRoutes(menu.children) : [],
        };

        return route;
      });
    },

    // 检查是否有权限
    hasPermission(permission: string): boolean {
      return this.permissions.has(permission);
    },

    // 清空权限
    clearPermissions() {
      this.menuRoutes = [];
      this.permissions.clear();
      permissionStorage.value = [];
    },
  },
});

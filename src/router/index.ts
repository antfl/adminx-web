import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore, useTabsStore } from '@/store';
import { type RouteRaw } from '@/types/router';
import { t } from '@/i18n';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: () => import('@/views/profile/password-reset/index.vue'),
      meta: {
        hidden: true,
        title: t('重置密码'),
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        hidden: true,
        title: t('🍃 登录 / 注册'),
      },
    },
  ],
});

const convertRoute = (parentPath = '', route: RouteRaw): RouteRecordRaw => {
  const fullPath = parentPath + route.path;

  return {
    ...route,
    children: route.children?.map((child) =>
      convertRoute(`${fullPath}${fullPath.endsWith('/') ? '' : '/'}`, child),
    ),
  } as RouteRecordRaw;
};

// 全局路由守卫
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore();
  const tabsStore = useTabsStore();
  const permissionStore = usePermissionStore();

  if (!userStore.isAuthenticated) {
    if (['Login', 'PasswordReset'].includes(to.name as string)) {
      return next();
    }
    return next({ name: 'Login', query: { redirect: to.fullPath } });
  }

  if (to.name === 'Login') {
    return next('/');
  }

  if (!userStore.user) {
    try {
      const result = await userStore.getUserInfo();
      if (!result) {
        return next({ name: 'Login' });
      }
      await userStore.getPermissions();
    } catch {
      next({ name: 'Login' });
      return;
    }
  }

  if (!permissionStore.areRoutesAdded) {
    permissionStore.menuRoutes.forEach((route: RouteRaw) => {
      const convertedRoute = convertRoute('', route);
      router.addRoute(convertedRoute);
    });

    permissionStore.setRoutesAdded(true);
    return next(to.fullPath);
  }

  tabsStore.addTab(to);
  next();
});

export default router;

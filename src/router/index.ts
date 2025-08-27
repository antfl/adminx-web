import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore, useTabsStore } from '@/store';
import { type RouteRaw } from '@/types/router';
import { t } from '@/i18n';
import { isBindGithub } from '@/api/user/third-party';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/password-reset',
      name: 'PasswordReset',
      component: () => import('@/views/profile/password-reset/index.vue'),
      meta: {
        hidden: true,
        access: 'public',
        title: t('重置密码'),
      },
    },
    {
      path: '/create-account',
      name: 'CreateAccount',
      component: () => import('@/views/profile/create-account/index.vue'),
      meta: {
        hidden: true,
        access: 'public',
        title: t('用户信息'),
      },
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        hidden: true,
        access: 'public',
        title: t('Admin x - 一个全场景企业级后台管理模板'),
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
    if (to.meta?.access === 'public') {
      return next();
    }

    const location = { name: 'Login', query: {} };
    if (to.fullPath && to.fullPath !== '/') {
      location.query = { redirect: to.fullPath };
    }

    return next(location);
  }

  // 绑定 GitHub 账号登录
  if (isBindGithub(to.fullPath)) {
    const { code, provider } = to.query;
    return next({
      path: '/profile',
      query: {
        code,
        provider,
      },
    });
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

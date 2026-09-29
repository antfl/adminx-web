import { AppIcon } from 'tdesign-icons-vue-next';

import { t } from '@/i18n';
import Layout from '@/layout/Layout.vue';

export const systemList = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/menu',
    meta: { title: t('系统管理'), icon: AppIcon },
    component: Layout,
    children: [
      {
        path: 'menu',
        name: 'Menu',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: { title: t('菜单管理') },
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: { title: t('用户管理') },
      },
      {
        path: 'dictionary',
        name: 'Dictionary',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: { title: t('字典管理') },
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: { title: t('角色管理') },
      },
      {
        path: 'icons',
        name: 'Icons',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: { title: t('图标管理') },
      },
    ],
  },
];

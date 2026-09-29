import Layout from '@/layout/Layout.vue';
import { t } from '@/i18n';
import {
  BugIcon,
  HomeIcon,
  RelativityIcon,
  InfoCircleIcon,
  UserIcon,
} from 'tdesign-icons-vue-next';
import { systemList } from '@/router/system';
import { monitorList } from '@/router/monitor';
import { settingList } from '@/router/setting';
import { externalList } from '@/router/external';
import { RouteRaw } from '@/types/router';

export const constantRoutes: RouteRaw[] = [
  {
    path: '/',
    component: Layout,
    redirect: { name: 'Home' },
    meta: { directlyShowChildren: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: {
          title: t('首页'),
          icon: HomeIcon,
        },
      },
      {
        path: 'readme',
        name: 'Readme',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: {
          icon: RelativityIcon,
          title: t('请阅读我'),
        },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: {
          title: t('数据看板'),
          icon: BugIcon,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: {
          icon: UserIcon,
          title: t('个人中心'),
        },
      },
    ],
  },
  ...systemList,
  ...monitorList,
  ...settingList,
  ...externalList,
  {
    path: '/exception',
    component: Layout,
    meta: {
      hidden: true,
    },
    children: [
      {
        path: '404',
        meta: { title: '404', icon: InfoCircleIcon },
        component: () => import('@/views/error/404.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/exception/404',
    meta: {
      hidden: true,
    },
  },
];

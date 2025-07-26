import Layout from '@/layout/Layout.vue';
import { t } from '@/i18n';
import {
  BugOutlined,
  HomeOutlined,
  NodeIndexOutlined,
  FrownOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import { articleList } from '@/router/article';
import { systemList } from '@/router/system';
import { monitorList } from '@/router/monitor';
import { settingList } from '@/router/setting';
import { externalList } from '@/router/external';
import { RouteRaw } from '@/types/router';

export const constantRoutes: RouteRaw[] = [
  {
    path: '/',
    component: Layout,
    meta: { directlyShowChildren: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: t('首页'),
          icon: HomeOutlined,
          footer: true,
        },
      },
      {
        path: 'readme',
        name: 'Readme',
        component: () => import('@/views/readme/index.vue'),
        meta: {
          icon: NodeIndexOutlined,
          title: t('请阅读我'),
        },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          footer: true,
          title: t('数据看板'),
          icon: BugOutlined,
        },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/views/profile/index.vue'),
        meta: {
          icon: UserOutlined,
          title: t('个人中心'),
        },
      },
    ],
  },
  ...articleList,
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
        meta: { title: '404', icon: FrownOutlined },
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

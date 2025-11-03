import { ShareAltOutlined } from '@ant-design/icons-vue';
import { t } from '@/i18n';
import Layout from '@/layout/Layout.vue';
import WebView from '@/views/iframe/index.vue';

export const externalList = [
  {
    path: '/web-view',
    name: 'WebView',
    meta: { title: t('三方连接'), icon: ShareAltOutlined },
    component: Layout,
    children: [
      {
        path: 'juejin',
        name: 'JueJin',
        meta: {
          title: t('内嵌 - 掘金'),
          iframeUrl: 'https://juejin.cn/user/3237402792170343',
        },
        component: WebView,
      },
      {
        path: 'github',
        name: 'GitHub',
        meta: {
          title: t('跳转 - GitHub'),
          externalUrl: 'https://github.com/antfl',
        },
        component: { render: () => null },
      },
      {
        path: 'antd',
        name: 'Antd',
        meta: {
          title: t('跳转 - Ant Design Vue'),
          externalUrl: 'https://www.antdv.com/components/icon-cn',
        },
        component: { render: () => null },
      },
    ],
  },
];

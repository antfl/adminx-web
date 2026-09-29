import { SecuredIcon } from 'tdesign-icons-vue-next';
import { t } from '@/i18n';
import Layout from '@/layout/Layout.vue';

export const monitorList = [
  {
    path: '/monitor',
    name: 'Monitor',
    redirect: '/monitor/scheduled-task',
    component: Layout,
    meta: { title: t('系统监控'), icon: SecuredIcon },
    children: [
      {
        path: 'scheduled-task',
        name: 'ScheduledTask',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: { title: t('定时任务') },
      },
      {
        path: 'log',
        name: 'OperationLog',
        component: () => import('@/views/common/TitlePage.vue'),
        meta: { title: t('操作日志') },
      },
    ],
  },
];

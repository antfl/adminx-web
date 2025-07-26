import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';

import { userLogin, type UserLogin } from '@/api/user/auth';
import { t } from '@/i18n';
import { useUserStore } from '@/store';

export const useAuth = () => {
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  /** 账号登录 */
  const accountLogin = async (data: UserLogin) => {
    const res = await userLogin(data);
    userStore.setToken(res.data.token);
    const redirect = route.query.redirect as string;
    await router.replace({
      path: redirect || '/',
    });
    message.success(t('登录成功'));
  };

  /** 退出登录 */
  const signOut = async () => {
    userStore.logout();
    await router.push({
      path: '/login',
      query: {
        redirect: router.currentRoute.value.fullPath,
      },
    });
  };

  return {
    accountLogin,
    signOut,
  };
};

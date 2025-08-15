import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';

import { qqUserLogin, userLogin, type UserLogin } from '@/api/user/auth';
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

  /** QQ 登录 */
  const qqLogin = async (code: string) => {
    const res = await qqUserLogin(code);
    userStore.setToken(res.data.token);
    await router.replace({
      path: '/',
    });
    message.success({ content: t('登录成功'), key: code });
  };

  /** 退出登录 */
  const signOut = async () => {
    userStore.logout();
    const location = { name: 'Login', query: {} };
    if (route.fullPath && route.fullPath !== '/') {
      location.query = { redirect: route.fullPath };
    }
    await router.push(location);
  };

  return {
    qqLogin,
    accountLogin,
    signOut,
  };
};

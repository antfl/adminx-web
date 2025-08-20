import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';

import {
  qqUserLogin,
  ThirdPartyLogin,
  authThirdParty,
  userLogin,
  type UserLogin,
} from '@/api/user/auth';
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

  /** 三方账号登录 */
  const thirdPartyLogin = async (params: ThirdPartyLogin) => {
    const destroy = message.loading({ content: '登录中', duration: 20 });
    const res = await authThirdParty(params).finally(() => {
      destroy();
    });
    if (res.data.token) {
      userStore.setToken(res.data.token);
      await router.replace({
        path: '/',
      });
      message.success({ content: t('登录成功') });
      return;
    }

    if (res.data.openId) {
      await router.push({
        name: 'UserInfo',
        query: {
          openId: res.data.openId,
        },
      });
    }
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
    thirdPartyLogin,
    accountLogin,
    signOut,
  };
};

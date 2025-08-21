import { defineStore } from 'pinia';
import { usePermissionStore } from '@/store/modules/permission';

import { fetchPermissions, User } from '@/api/user';
import { userInfo } from '@/api/user';

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value);

  /**
   * 清空用户信息
   */
  const clear = () => {
    const permissionStore = usePermissionStore();
    permissionStore.clearPermissions();
    permissionStore.setRoutesAdded(false);
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
  };

  /**
   * 设置 Token
   * @param newToken
   */
  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem('token', newToken);
  };

  /**
   * 获取用户信息
   */
  const getUserInfo = async () => {
    if (!token.value) return false;
    try {
      loading.value = true;
      const res = await userInfo();
      user.value = res.data;
      return true;
    } catch {
      clear();
      return false;
    } finally {
      loading.value = false;
    }
  };

  /**
   * 获取权限信息
   */
  const getPermissions = async () => {
    const { data } = await fetchPermissions();
    const permissionStore = usePermissionStore();
    permissionStore.setPermissions(data.menus, [...data.permissions]);
  };

  return {
    user,
    token,
    isAuthenticated,
    setToken,
    clear,
    getUserInfo,
    getPermissions,
  };
});

import { defineStore } from 'pinia';
import { usePermissionStore } from '@/store/modules/permission';

export interface SessionUser {
  userId: number;
  nickname: string;
  avatar: string;
}

const mockUser: SessionUser = {
  userId: 1,
  nickname: '管理员',
  avatar: '',
};

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<SessionUser | null>(null);
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
   * 使用本地模拟用户
   */
  const getUserInfo = async () => {
    if (!token.value) return false;
    loading.value = true;
    user.value = { ...mockUser };
    loading.value = false;
    return true;
  };

  /**
   * 使用静态菜单，不再请求权限接口
   */
  const getPermissions = async () => {
    const permissionStore = usePermissionStore();
    permissionStore.setPermissions([], []);
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

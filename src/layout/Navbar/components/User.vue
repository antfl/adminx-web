<script setup lang="ts">
import { useAuth } from '@/hooks/modules/useAuth';
import { t } from '@/i18n';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';
import type { DropdownOption } from 'tdesign-vue-next';

const userStore = useUserStore();
const auth = useAuth();

const avatar = computed(() => userStore.user?.avatar);
const nickname = computed(() => userStore.user?.nickname || '管理员');
const initial = computed(() => nickname.value.trim().charAt(0));
const router = useRouter();
const options = computed(() => [
  { content: t('个人中心'), value: 'Profile' },
  { content: t('退出登录'), value: 'logout' },
]);

const handleClick = (item: DropdownOption) => {
  if (item.value === 'logout') {
    auth.logout();
  }
  if (item.value === 'Profile') {
    router.push({ path: '/profile' });
  }
};
</script>

<template>
  <t-dropdown :options="options" @click="handleClick">
    <t-button variant="text" type="button" class="account">
      <t-avatar class="avatar" :image="avatar || undefined" size="28px">{{ initial }}</t-avatar>
      <span>{{ nickname }}</span>
    </t-button>
  </t-dropdown>
</template>

<style scoped lang="less">
.account.t-button {
  height: auto;
  padding: 0;
  background: transparent;
  border: 0;
  box-shadow: none;

  &:hover,
  &:focus,
  &:focus-visible,
  &:active {
    background: transparent;
    border: 0;
    box-shadow: none;
  }
}

.account,
.account :deep(.t-button__text) {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.avatar {
  color: var(--td-text-color-anti);
  background: var(--td-brand-color);
}
</style>

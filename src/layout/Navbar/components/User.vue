<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';

import { useAuth } from '@/hooks/modules/useAuth';
import { t } from '@/i18n';
import { useUserStore } from '@/store';

const userStore = useUserStore();
const auth = useAuth();

const avatar = computed(() => userStore.user?.avatar);
const username = computed(() => userStore.user?.username);

const handleClick = ({ key }: { key: string | number }) => {
  if (key === 'signOut') {
    auth.signOut();
  }

  if (key === 'Profile') {
    // TODO: Navigate to profile page
  }
};
</script>

<template>
  <a-flex class="ml-44px" align="center">
    <div class="mr-8px">{{ username }}</div>
    <a-dropdown>
      <a-avatar :src="avatar" :size="44">
        <template #icon>
          <UserOutlined />
        </template>
      </a-avatar>
      <template #overlay>
        <a-menu @click="handleClick">
          <a-menu-item key="Profile">{{ t('个人中心') }}</a-menu-item>
          <a-menu-item key="signOut">{{ t('退出') }}</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-flex>
</template>

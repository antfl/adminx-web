<script setup lang="ts">
import Avatar from '@/components/Avatar/index.vue';
import { useAuth } from '@/hooks/modules/useAuth';
import { t } from '@/i18n';
import { useUserStore } from '@/store';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const auth = useAuth();

const avatar = computed(() => userStore.user?.avatar);
const nickname = computed(() => userStore.user?.nickname);
const router = useRouter();
const handleClick = ({ key }: { key: string | number }) => {
  if (key === 'logout') {
    auth.logout();
  }

  if (key === 'Profile') {
    router.push({
      path: '/profile',
    });
  }
};
</script>

<template>
  <a-flex class="md:ml-44px" align="center">
    <div class="mr-8px">{{ nickname }}</div>
    <a-dropdown>
      <Avatar :src="avatar" :size="36" />
      <template #overlay>
        <a-menu @click="handleClick">
          <a-menu-item key="Profile">{{ t('个人中心') }}</a-menu-item>
          <a-menu-item key="logout">{{ t('退出') }}</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </a-flex>
</template>

<script setup lang="ts">
import { userActive, ActiveUser } from '@/api/user';

const isLoading = ref(true);
const userList = ref<ActiveUser[]>([]);
const getData = async () => {
  isLoading.value = true;
  const res = await userActive();
  userList.value = res.data;
  isLoading.value = false;
};

getData();
</script>

<template>
  <a-card :loading="isLoading" title="活跃用户">
    <a-avatar-group :max-count="7">
      <a-tooltip
        v-for="user in userList"
        :title="`${user.nickname}（${user.operationCount}）`"
        placement="top"
      >
        <Avatar :src="user.avatar" />
      </a-tooltip>
    </a-avatar-group>
  </a-card>
</template>

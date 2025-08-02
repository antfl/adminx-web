<script setup lang="ts">
import { userRecent, RecentUser } from '@/api/user';

const isLoading = ref(true);
const userList = ref<RecentUser[]>([]);
const getData = async () => {
  isLoading.value = true;
  const res = await userRecent();
  userList.value = res.data;
  isLoading.value = false;
};

getData();
</script>

<template>
  <a-card :loading="isLoading" title="新增用户">
    <a-avatar-group :max-count="7">
      <a-tooltip v-for="user in userList" :title="user.nickname" placement="top">
        <Avatar :src="user.avatar" />
      </a-tooltip>
    </a-avatar-group>
  </a-card>
</template>

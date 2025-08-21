<script setup lang="ts">
import { useUserStore } from '@/store';
import { isUndefined } from 'lodash-es';

const userStore = useUserStore();
const watermark = computed(() => {
  const { userId, nickname } = userStore.user || {};
  if (isUndefined(userId)) {
    return '';
  }
  return `${nickname}(${userId})`;
});
</script>

<template>
  <a-watermark
    :content="watermark"
    :gap="[60, 60]"
    :font="{
      fontSize: 14,
      color: 'rgba(255, 255, 255, .01)',
    }"
  >
    <slot />
  </a-watermark>
</template>

<script setup lang="ts">
import ECharts from '@/components/ECharts/index.vue';

import { dailyStats } from '@/api/system/logs';
import { createOption } from './schema';

const option = ref();
const isLoading = ref(true);
const getDailyStats = async () => {
  option.value = null;
  isLoading.value = true;
  const res = await dailyStats();
  option.value = createOption(res.data);
  isLoading.value = false;
};

onMounted(() => {
  getDailyStats();
});
</script>

<template>
  <a-spin :spinning="isLoading">
    <ECharts class="h-400px!" v-if="option" :option="option" />
  </a-spin>
</template>

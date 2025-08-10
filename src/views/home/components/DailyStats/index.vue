<script setup lang="ts">
import ECharts from '@/components/ECharts/index.vue';

import { dailyStats } from '@/api/system/logs';
import { createOption } from './schema';
import { useThemeStore } from '@/store/modules/theme';

const themeStore = useThemeStore();

const EChartsRef = ref();
const unregister = themeStore.themeChange(() => {
  EChartsRef.value.updateChart(createOption(option.value));
});

const option = ref();
const isLoading = ref(true);
const getDailyStats = async () => {
  option.value = null;
  isLoading.value = true;
  const res = await dailyStats();
  option.value = res.data;
  EChartsRef.value.updateChart(createOption(option.value));
  isLoading.value = false;
};

onMounted(() => {
  getDailyStats();
});

onUnmounted(() => {
  unregister();
});
</script>

<template>
  <a-spin :spinning="isLoading">
    <ECharts ref="EChartsRef" class="h-330px!" />
  </a-spin>
</template>

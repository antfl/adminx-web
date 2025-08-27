<script setup lang="ts">
import ECharts from '@/components/ECharts/index.vue';

import { moduleStats } from '@/api/system/logs';
import { createPie, handleLegendSelectChanged } from '@/components/ECharts/utils';
import { useThemeStore } from '@/store/modules/theme';

const { themeChange } = useThemeStore();

const EChartsRef = ref();
const unregister = themeChange(() => {
  EChartsRef.value.updateChart(createPie({ data: option.value, name: '模块统计' }));
});

const option = ref();
const isLoading = ref(true);
const getModuleStats = async () => {
  option.value = null;
  isLoading.value = true;
  const res = await moduleStats();
  option.value = res.data;
  EChartsRef.value.updateChart(createPie({ data: option.value, name: '模块统计' }));
  handleLegendSelectChanged(EChartsRef.value.getInstance());
  isLoading.value = false;
};

onMounted(() => {
  getModuleStats();
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

<script setup lang="ts">
import ECharts from '@/components/ECharts/index.vue';

import { moduleStats } from '@/api/system/logs';
import { createPie } from '@/components/ECharts/utils';

const option = ref();
const isLoading = ref(true);
const getModuleStats = async () => {
  option.value = null;
  isLoading.value = true;
  const res = await moduleStats();
  option.value = createPie({ data: res.data, name: '模块统计' });
  isLoading.value = false;
};

onMounted(() => {
  getModuleStats();
});
</script>

<template>
  <a-spin :spinning="isLoading">
    <ECharts class="h-400px!" v-if="option" :option="option" />
  </a-spin>
</template>

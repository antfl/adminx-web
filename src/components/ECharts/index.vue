<script lang="ts" setup>
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';

const props = defineProps({
  option: {
    type: Object,
    required: true,
  },
  autoUpdate: {
    type: Boolean,
    default: true,
  },
});

const chartContainerRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

const handleResize = debounce(() => chartInstance?.resize(), 50);

const initChart = () => {
  if (!chartContainerRef.value) return;

  try {
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }

    chartInstance = echarts.init(chartContainerRef.value);
    chartInstance.setOption(props.option);

    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.value);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    //
  }
};

const updateChart = (option: any) => {
  if (chartInstance) {
    chartInstance.setOption(option);
  }
};

watch(
  () => props.option,
  (newOption) => {
    if (props.autoUpdate) {
      updateChart(newOption);
    }
  },
);

defineExpose({
  updateChart,
});

onMounted(() => {
  nextTick(initChart);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;

  handleResize.cancel();

  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<template>
  <div ref="chartContainerRef" class="chart-container" />
</template>

<style scoped lang="less">
.chart-container {
  width: 100%;
  height: 310px;
  overflow: hidden;
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--border-radius-outer);

  > div,
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}
</style>

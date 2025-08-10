<script lang="ts" setup>
import * as echarts from 'echarts';
import { debounce } from 'lodash-es';

const props = defineProps({
  option: {
    type: Object,
    required: false,
  },
});

const chartContainerRef = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
let resizeObserver: ResizeObserver | null = null;

const handleResize = debounce(() => resize(), 50);

const initChart = () => {
  if (!chartContainerRef.value) return;

  try {
    if (chartInstance) {
      chartInstance.dispose();
      chartInstance = null;
    }

    chartInstance = echarts.init(chartContainerRef.value);
    if (props.option) {
      chartInstance.setOption(props.option);
    }

    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(chartContainerRef.value);
  } catch {
    //
  }
};

const updateChart = (option: any) => {
  if (chartInstance) {
    chartInstance.setOption(option, true);
    resize();
  }
};

const resize = () => {
  chartInstance?.resize();
};

defineExpose({
  updateChart,
  resize,
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

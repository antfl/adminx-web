<script setup lang="ts">
import { uniqueId, shuffle } from 'lodash-es';
import ECharts from '@/components/ECharts/index.vue';
import ScrollTable from '@/components/ScrollTable/index.vue';
import { doubleBar } from '@/views/dashboard/data/doubleBar';
import { lineBar } from '@/views/dashboard/data/lineBar';
import { pieData } from '@/views/dashboard/data/pieData';
import { columns, tableData } from '@/views/dashboard/data/scrollTable';
import { useThemeStore } from '@/store/modules/theme';

const { themeChange } = useThemeStore();

const getCardList = () => {
  return shuffle([
    {
      id: uniqueId('cards'),
      component: ScrollTable,
      props: {
        class: 'px-10px',
        columns,
        dataSource: tableData,
        rowHeight: 40,
        visibleRows: 5,
        scrollInterval: 2500,
        scrollSpeed: 0.6,
      },
    },
    {
      id: uniqueId('cards'),
      component: ECharts,
      props: { option: doubleBar() },
    },
    {
      id: uniqueId('cards'),
      component: ECharts,
      props: { option: pieData() },
    },
    {
      id: uniqueId('cards'),
      component: ECharts,
      props: { option: lineBar() },
    },
  ]);
};

const cardList = ref();

const unregister = themeChange(() => {
  cardList.value = getCardList();
});

onMounted(() => {
  cardList.value = getCardList();
});

onUnmounted(() => {
  unregister();
});
</script>

<template>
  <div class="m-10px">
    <a-row :gutter="[10, 10]">
      <a-col v-for="card in cardList" :key="card.id" :span="24" :xl="12">
        <component v-bind="card.props" :is="card.component" />
      </a-col>
    </a-row>
  </div>
</template>

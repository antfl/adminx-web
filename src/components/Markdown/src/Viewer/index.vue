<template>
  <Viewer :value="content" :plugins="plugins" />
</template>

<script setup lang="ts">
import { Viewer } from '@bytemd/vue-next';
import plugins from '@/components/Markdown/src/common/plugins';

defineOptions({
  name: 'MdViewer',
});

defineProps<{
  content: string;
}>();
</script>

<style lang="less">
@import url('@/components/Markdown/src/common/style.less');
</style>

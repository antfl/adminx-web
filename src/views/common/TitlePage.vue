<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <h1 class="page-title">{{ route.meta.title }}</h1>
</template>

<style scoped lang="less">
.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--td-text-color-primary);
}
</style>

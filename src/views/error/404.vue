<script setup lang="ts">
import icon404 from '@/assets/svg/404.svg';
</script>
<template>
  <div class="h-full flex flex-col justify-center items-center">
    <img class="h-300px" :src="icon404" alt="" />
    <div class="font-size-22px">{{ $t('找不到页面') }}</div>
  </div>
</template>

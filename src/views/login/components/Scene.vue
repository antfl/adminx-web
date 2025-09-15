<script setup lang="ts">
import sun from '@/assets/svg/sun.svg';
import moon from '@/assets/svg/little-moon.svg';
import { useThemeStore } from '@/store/modules/theme';

const themeStore = useThemeStore();
const currentEnv = computed(() => (themeStore.currentTheme === 'dark' ? moon : sun));
</script>

<template>
  <img
    class="pos-absolute right-30px top-30px size-30px"
    :class="themeStore.currentTheme === 'light' ? 'rotate-icon' : 'moon-filter-icon'"
    :src="currentEnv"
    alt=""
  />
</template>

<style scoped lang="less">
.moon-filter-icon {
  transition: filter 300ms;
  will-change: filter;
}

.moon-filter-icon {
  width: 25px;
  height: 25px;
  filter: drop-shadow(0 0 1em #ffd500);
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .rotate-icon {
    animation: rotate infinite 20s linear;
  }
}
</style>

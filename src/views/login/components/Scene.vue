<script setup lang="ts">
import sun from '@/assets/svg/sun.svg';
import moon from '@/assets/svg/little-moon.svg';
import tree from '@/assets/svg/tree.svg';
import crab from '@/assets/svg/crab.svg';
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
  <img
    class="tree-filter-icon hidden lg:flex pos-absolute left-50px bottom-0px h-117px"
    :src="tree"
    alt=""
  />
  <div class="crab-container pos-absolute right-100px bottom-0">
    <img class="crab crab-filter-icon size-30px" :src="crab" alt="" />
  </div>
</template>

<style scoped lang="less">
.crab-filter-icon,
.tree-filter-icon,
.moon-filter-icon {
  transition: filter 300ms;
  will-change: filter;
}

.moon-filter-icon {
  width: 25px;
  height: 25px;
  filter: drop-shadow(0 0 1em #ffd500);
}

.crab-filter-icon {
  filter: drop-shadow(0 0 1em #ef7d7d);
}

.tree-filter-icon {
  filter: drop-shadow(0 0 1em #a1dc5a);
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

.crab-container {
  animation: crabWalk 60s linear infinite;

  .crab {
    display: block;
    transform-origin: center;
    animation: crabMove 1.5s ease-in-out infinite;
  }
}

@keyframes crabWalk {
  0% {
    right: 100px;
    transform: scaleX(1);
  }

  50% {
    right: calc(100% - 150px);
    transform: scaleX(1);
  }

  50.01% {
    right: calc(100% - 150px);
    transform: scaleX(-1);
  }

  100% {
    right: 100px;
    transform: scaleX(-1);
  }
}

@keyframes crabMove {
  0%,
  100% {
    transform: rotate(-5deg);
  }

  20% {
    transform: rotate(5deg);
  }

  40% {
    transform: rotate(0deg);
  }

  50% {
    transform: rotate(0deg);
  }

  70% {
    transform: rotate(-5deg);
  }

  90% {
    transform: rotate(0deg);
  }
}
</style>

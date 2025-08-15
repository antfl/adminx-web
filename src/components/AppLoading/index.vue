<script setup lang="ts">
import { useAppLoading } from './useAppLoading';

onMounted(() => {
  useAppLoading();
});
</script>

<template>
  <div id="app-loading-container">
    <div class="bouncing-letters">
      <span class="letter" style="color: #333; animation-delay: 0s">A</span>
      <span class="letter" style="color: #333; animation-delay: 0.1s">d</span>
      <span class="letter" style="color: #333; animation-delay: 0.2s">m</span>
      <span class="letter" style="color: #333; animation-delay: 0.3s">i</span>
      <span class="letter" style="color: #333; animation-delay: 0.4s">n</span>
      <span class="letter" style="color: #333; animation-delay: 0.5s"> </span>
      <span class="letter" style="color: #1890ff; animation-delay: 0.6s">x</span>
    </div>
  </div>
</template>

<style scoped lang="less">
#app-loading-container {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.bouncing-letters {
  display: flex;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 12px;
  text-shadow: 0 2px 10px rgb(0 0 0 / 10%);
}

.letter {
  transform-origin: bottom;
  animation: bounce 0.8s ease infinite alternate;
}

@keyframes bounce {
  0% {
    transform: translateY(0) scaleY(1);
  }

  30% {
    transform: translateY(-20px) scaleY(1.05);
  }

  60% {
    transform: translateY(-10px) scaleY(0.95);
  }

  100% {
    transform: translateY(-25px) scaleY(1.05);
  }
}
</style>

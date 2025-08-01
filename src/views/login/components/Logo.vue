<script setup lang="ts">
import logoPath from '@/assets/images/logo.jpg';
</script>

<template>
  <div class="pos-fixed left-30px top-28px">
    <h1 class="flex items-center">
      <img class="size-30px rounded-5px" :src="logoPath" alt="Admin x" />
      <span class="ml-12px font-size-26px">
        <span class="color-[var(--color-text)]">Admin</span>
        <span class="color-[var(--color-primary)]"> x</span>
      </span>
    </h1>
  </div>
</template>

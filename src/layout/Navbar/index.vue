<script setup lang="ts">
import Fullscreen from '@/layout/Navbar/components/Fullscreen.vue';
import Notice from '@/layout/Navbar/components/Notice.vue';
import Github from '@/layout/Navbar/components/Github.vue';
import Reload from '@/layout/Navbar/components/Reload.vue';
import Search from '@/layout/Navbar/components/Search.vue';
import Theme from '@/layout/Navbar/components/Theme.vue';
import Translate from '@/layout/Navbar/components/Translate.vue';
import User from '@/layout/Navbar/components/User.vue';
import logoPath from '@/assets/images/logo.jpg';

import { useScreenSize } from '@/hooks/modules/useScreenSize';

const screenSize = useScreenSize();
const isMobile = computed(() => screenSize.isMobile.value);
</script>

<template>
  <div class="flex items-center justify-between px-20px">
    <div class="flex items-center">
      <div v-if="isMobile" class="w-50px">
        <slot></slot>
      </div>
      <h1 class="flex items-center font-500">
        <img
          class="size-28px rounded-5px hidden md:inline-block align-text-top"
          :src="logoPath"
          alt="Admin x"
        />
        <span class="ml-12px font-size-20px">
          <span>Admin</span>
          <span class="color-[var(--color-primary)]"> x</span>
        </span>
      </h1>
    </div>
    <div v-if="!isMobile" class="mx-55px overflow-hidden">
      <slot></slot>
    </div>
    <div class="flex items-center">
      <a-space class="hidden lg:flex font-size-16px" :size="32">
        <Github />
        <Notice />
        <Search />
        <Theme />
        <Reload />
        <Translate />
        <Fullscreen />
      </a-space>
      <User />
    </div>
  </div>
</template>

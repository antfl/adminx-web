<script setup lang="ts">
import { useRouter } from 'vue-router';

import LocaleSwitch from '@/components/LocaleSwitch/index.vue';
import ThemeSwitch from '@/components/ThemeSwitch/index.vue';
import logoPath from '@/assets/images/logo.svg';

import User from './components/User.vue';

defineProps<{
  recentOpen?: boolean;
}>();

defineEmits<{
  recentEnter: [];
  recentLeave: [];
}>();

const router = useRouter();
</script>

<template>
  <header class="header">
    <t-button
      variant="text"
      shape="square"
      class="hamburger"
      :aria-label="recentOpen ? $t('关闭菜单') : $t('打开菜单')"
      @mouseenter="$emit('recentEnter')"
      @mouseleave="$emit('recentLeave')"
    >
      <template #icon>
        <span class="burger" :class="{ open: recentOpen }" aria-hidden="true">
          <span class="burger-line"></span>
          <span class="burger-line"></span>
          <span class="burger-line"></span>
        </span>
      </template>
    </t-button>
    <div class="brand" @click="router.push('/')">
      <img class="logo" :src="logoPath" alt="" />
      <span class="brand-name">Admin<span class="accent">x</span></span>
    </div>
    <div class="grow"></div>
    <div class="actions">
      <ThemeSwitch />
      <LocaleSwitch />
    </div>
    <div class="account">
      <User />
    </div>
  </header>
</template>

<style scoped lang="less">
.header {
  z-index: 100;
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  background: var(--td-bg-color-container);
  border-bottom: 1px solid var(--td-component-stroke);
}

.hamburger :deep(.t-button__icon) {
  display: inline-flex;
}

.burger {
  position: relative;
  display: block;
  width: 18px;
  height: 18px;
}

.burger-line {
  position: absolute;
  left: 1px;
  width: 16px;
  height: 1.5px;
  background: currentcolor;
  border-radius: 1px;
  transform-origin: center;
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.2s ease;

  &:nth-child(1) {
    top: 4px;
  }

  &:nth-child(2) {
    top: 8.25px;
  }

  &:nth-child(3) {
    top: 12.5px;
  }
}

.burger.open .burger-line:nth-child(1) {
  transform: translateY(4.25px) rotate(45deg);
}

.burger.open .burger-line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0.15);
}

.burger.open .burger-line:nth-child(3) {
  transform: translateY(-4.25px) rotate(-45deg);
}

.brand {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  margin-left: 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--td-text-color-primary);
  cursor: pointer;
  user-select: none;
}

.brand-name {
  display: inline-flex;
  gap: 4px;
  align-items: baseline;
}

.logo {
  width: 24px;
  height: 24px;
  border-radius: 5px;
}

.accent {
  color: var(--td-brand-color);
}

html[theme-mode='dark'] .accent {
  color: var(--td-brand-color-9);
}

.grow {
  flex: 1;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.account {
  margin-left: 16px;
}
</style>

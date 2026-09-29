<script setup lang="ts">
import LoginForm from '@/views/login/components/LoginForm.vue';
import ThemeLocaleSwitcher from '@/views/login/components/ThemeLocaleSwitcher.vue';
import Logo from '@/views/login/components/Logo.vue';
</script>

<template>
  <div class="login-page">
    <Logo />
    <div class="login-page__center">
      <t-card class="login-card">
        <div class="login-card__bar">
          <ThemeLocaleSwitcher />
        </div>
        <h2 class="login-card__title">{{ $t('欢迎登录') }}</h2>
        <LoginForm />
      </t-card>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-page {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  user-select: none;
  filter: drop-shadow(50vw 50vh 50em var(--color-primary));

  :deep(.t-input),
  :deep(.t-input__wrap) {
    background-color: transparent;
  }
}

.login-page__center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 24px;
}

.login-card {
  z-index: 1;
  width: 400px;
  max-width: 100%;
}

.login-card__bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.login-card__title {
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--td-text-color-primary);
}
</style>

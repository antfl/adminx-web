<script setup lang="ts">
import LoginForm from '@/views/login/components/LoginForm.vue';
import RegisterForm from '@/views/login/components/RegisterForm.vue';
import ThemeLocaleSwitcher from '@/views/login/components/ThemeLocaleSwitcher.vue';
import Scene from '@/views/login/components/Scene.vue';
import Logo from '@/views/login/components/Logo.vue';

const isLogin = ref(true);
const toggleChange = () => {
  isLogin.value = !isLogin.value;
};
</script>

<template>
  <div class="login-container select-none w-screen h-screen pos-absolute">
    <div class="h-full flex items-center justify-center">
      <a-card class="filter-container pos-absolute w-375px pt-60px pb-10px px-10px">
        <ThemeLocaleSwitcher />
        <div class="font-size-24px mb-30px">
          <span>{{ isLogin ? '欢迎登录' : '欢迎注册' }} </span>
        </div>
        <LoginForm v-if="isLogin" @toggle="toggleChange" />
        <RegisterForm v-else @toggle="toggleChange" />
      </a-card>
    </div>
    <Logo />
    <Scene />
  </div>
</template>

<style scoped lang="less">
.login-container {
  overflow: hidden;
  filter: drop-shadow(50vw 50vh 50em var(--color-primary));

  :deep(.ant-checkbox-wrapper) {
    .ant-checkbox:not(.ant-checkbox-checked) {
      .ant-checkbox-inner {
        background-color: transparent;
      }
    }
  }

  :deep(.ant-btn-default),
  :deep(.ant-input-affix-wrapper),
  :deep(.ant-input) {
    background-color: transparent;
  }
}
</style>

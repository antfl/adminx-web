<script setup lang="ts">
import { message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';
import { useRoute } from 'vue-router';
import router from '@/router';
import { createUser } from '@/api/user/auth';
import { PASSWORD_REGEX } from '@/utils/regex';
import { useUserStore } from '@/store';
const route = useRoute();

const isLoading = ref(false);
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  openId: '',
});

// 密码一致性验证
const validatePasswordMatch = (_: Rule, value: string, callback: (message?: string) => void) => {
  if (value !== formData.password) {
    callback('两次输入的密码不一致');
  } else {
    callback();
  }
};

/**
 * 提交
 */
const handleSubmit = async () => {
  isLoading.value = true;
  const userStore = useUserStore();
  try {
    const openId = route.query.openId as string;
    const res = await createUser({
      ...formData,
      openId,
    });
    userStore.setToken(res.data.token);
    message.success('登录成功');
    await router.replace({
      path: '/',
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <a-page-header title="用户信息" @back="() => router.back()" />
  <div class="px-20px m-auto max-w-500px">
    <a-form @finish="handleSubmit" layout="vertical" size="large" :model="formData">
      <a-form-item
        name="username"
        label="用户名"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="formData.username" placeholder="请输入用户名"></a-input>
      </a-form-item>
      <a-form-item
        name="password"
        label="密码"
        :rules="[
          { required: true, message: '请输入密码' },
          {
            pattern: PASSWORD_REGEX,
            message: '必须包含小写字母、大写字母、数字和特殊符号(6-32位)',
          },
        ]"
      >
        <a-input-password
          :maxlength="32"
          v-model:value="formData.password"
          placeholder="请输入密码"
        ></a-input-password>
      </a-form-item>
      <a-form-item
        label="确认密码"
        name="confirmPassword"
        :rules="[
          { required: true, message: '请再次输入密码' },
          {
            validator: validatePasswordMatch,
          },
        ]"
      >
        <a-input-password
          :maxlength="32"
          v-model:value="formData.confirmPassword"
          placeholder="确认密码"
        ></a-input-password>
      </a-form-item>
      <a-form-item class="mt-36px">
        <a-button class="w-full" type="primary" html-type="submit" :loading="isLoading">
          确认
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

import { sendMailCode, passwordReset } from '@/api/user/auth';
import { isValidEmail } from '@/utils/validate';
import router from '@/router';
import { PASSWORD_REGEX } from '@/utils/regex';
const isLoading = ref(false);
const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  captchaId: '',
  code: '',
});

// 密码一致性验证
const validatePasswordMatch = (_: Rule, value: string, callback: (message?: string) => void) => {
  if (value !== formData.password) {
    callback('两次输入的密码不一致');
  } else {
    callback();
  }
};

const sendLoading = ref(false);
const captchaId = ref('');
const countdown = ref(0); // 倒计时秒数
let countdownTimer: NodeJS.Timeout | null = null;

// 从本地存储恢复倒计时状态
onMounted(() => {
  const savedEndTime = localStorage.getItem('captchaEndTime');
  if (savedEndTime) {
    const endTime = parseInt(savedEndTime);
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

    if (remaining > 0) {
      countdown.value = remaining;
      startCountdown();
    } else {
      localStorage.removeItem('captchaEndTime');
    }
  }
});

// 清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});

// 开始倒计时
const startCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }

  countdownTimer = setInterval(() => {
    countdown.value--;

    if (countdown.value <= 0) {
      clearInterval(countdownTimer!);
      countdownTimer = null;
      localStorage.removeItem('captchaEndTime');
    }
  }, 1000);
};

const getMailCode = async () => {
  // 倒计时中不允许重复发送
  if (countdown.value > 0) return;

  if (!formData.email.trim()) {
    message.warn('请输入邮箱');
    return;
  }
  if (!isValidEmail(formData.email)) {
    message.warn('请输入有效邮箱');
    return;
  }

  sendLoading.value = true;
  try {
    const { data } = await sendMailCode(formData.email, 'PASSWORD-RESET');
    message.success('验证码已发送');
    captchaId.value = data.captchaId;

    // 设置 60 秒倒计时
    countdown.value = 60;
    // 保存倒计时结束时间到本地存储
    const endTime = Date.now() + 60000;
    localStorage.setItem('captchaEndTime', endTime.toString());

    startCountdown();
  } finally {
    sendLoading.value = false;
  }
};

/**
 * 修改密码
 */
const handleSubmit = async () => {
  isLoading.value = true;
  formData.captchaId = captchaId.value;
  try {
    await passwordReset(formData);
    message.success('修改成功');
    await router.replace({ name: 'Login' });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <a-page-header title="重置密码" @back="() => router.back()" />
  <div class="px-20px m-auto max-w-500px">
    <a-form @finish="handleSubmit" layout="vertical" size="large" :model="formData">
      <a-form-item name="email" label="邮箱" :rules="[{ required: true, message: '请输入邮箱' }]">
        <a-input v-model:value="formData.email" placeholder="请输入邮箱"></a-input>
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
      <a-form-item
        label="验证码"
        name="code"
        :rules="[{ required: true, message: '请输入验证码' }]"
      >
        <div class="flex gap-12px">
          <a-input
            v-model:value="formData.code"
            placeholder="请输入验证码"
            :maxlength="8"
          ></a-input>
          <a-button
            @click="getMailCode"
            :loading="sendLoading"
            class="min-w-150px"
            :disabled="countdown > 0"
          >
            {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
          </a-button>
        </div>
      </a-form-item>
      <a-form-item class="mt-36px">
        <a-button class="w-full" type="primary" html-type="submit" :loading="isLoading">
          确认修改
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

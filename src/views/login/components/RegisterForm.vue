<script setup lang="ts">
import { message } from 'ant-design-vue';
import { sendMailCode, userRegister } from '@/api/user/auth';
import { isValidEmail } from '@/utils/validate';
import { PASSWORD_REGEX } from '@/utils/regex';

const checked = ref(false);
const isLoading = ref(false);
const formData = reactive({
  nickname: '',
  email: '',
  password: '',
  captchaId: '',
  code: '',
});

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

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
    const { data } = await sendMailCode(formData.email, 'REGISTER');
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
 * 注册
 */
const handleSubmit = async () => {
  if (!checked.value) {
    message.warn('请先同意服务协议和隐私权说明');
    return;
  }

  isLoading.value = true;
  formData.captchaId = captchaId.value;
  try {
    await userRegister(formData);
    message.success('注册成功');
    emit('toggle');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <a-form @finish="handleSubmit" :model="formData" size="large">
    <a-form-item name="nickname" :rules="[{ required: true, message: '请输入昵称' }]">
      <a-input v-model:value="formData.nickname" placeholder="请输入昵称"></a-input>
    </a-form-item>
    <a-form-item name="email" :rules="[{ required: true, message: '请输入邮箱' }]">
      <a-input v-model:value="formData.email" placeholder="请输入邮箱"></a-input>
    </a-form-item>
    <a-form-item
      name="password"
      :rules="[
        { required: true, message: '请输入密码' },
        {
          pattern: PASSWORD_REGEX,
          message: '必须包含小写字母、大写字母、数字和特殊符号(6-32位)',
        },
      ]"
    >
      <a-input-password
        v-model:value="formData.password"
        placeholder="请输入密码"
      ></a-input-password>
    </a-form-item>
    <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
      <a-space>
        <a-input v-model:value="formData.code" placeholder="请输入验证码"></a-input>
        <a-button
          @click="getMailCode"
          :loading="sendLoading"
          class="min-w-110px"
          :disabled="countdown > 0"
        >
          {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
        </a-button>
      </a-space>
    </a-form-item>
    <a-form-item class="mt-36px">
      <a-button class="w-full" type="primary" html-type="submit" :loading="isLoading">
        注册
      </a-button>
      <div class="mt-9px flex items-center">
        <span>已有账号？</span>
        <a-button class="px-0!" @click="emit('toggle')" type="link" size="small">点击登录</a-button>
      </div>
    </a-form-item>
  </a-form>
  <a-checkbox v-model:checked="checked">
    我已阅读并同意
    <a-button class="px-0" type="link" @click.stop>服务协议</a-button>
    <span> 和 </span>
    <a-button class="px-0" type="link" @click.stop>隐私权说明</a-button>
  </a-checkbox>
</template>

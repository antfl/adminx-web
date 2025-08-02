<script setup lang="ts">
import { message } from 'ant-design-vue';
import router from '@/router';
import { useAuth } from '@/hooks';
import { captcha } from '@/api/user/auth';
import qqIcon from '@/assets/images/qq.png';
import wxIcon from '@/assets/images/wx.png';
import githubIcon from '@/assets/images/github.png';
const checked = ref(false);
const auth = useAuth();
const isLoading = ref(false);
const formData = reactive({
  username: '',
  password: '',
  captchaId: '',
  code: '',
});

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

const captchaLoading = ref(true);
const captchaId = ref('');
const captchaImageBase64 = ref('');
const refreshCode = async () => {
  captchaLoading.value = true;
  const { data } = await captcha().finally(() => {
    captchaLoading.value = false;
  });
  captchaId.value = data.captchaId;
  captchaImageBase64.value = data.captchaImageBase64;
};

/**
 * 登录
 */
const handleSubmit = async () => {
  if (!checked.value) {
    message.warn('请先同意服务协议和隐私权说明');
    return;
  }

  isLoading.value = true;
  formData.captchaId = captchaId.value;
  await auth
    .accountLogin(formData)
    .catch(() => {
      refreshCode();
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const handleRegister = () => {
  emit('toggle');
};

const loginMethods = [
  {
    icon: qqIcon,
    name: 'QQ 登录',
  },
  {
    icon: wxIcon,
    name: '微信登录',
  },
  {
    icon: githubIcon,
    name: 'Github',
  },
];

onMounted(() => {
  refreshCode();
});
</script>

<template>
  <a-form @finish="handleSubmit" :model="formData" size="large">
    <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名或邮箱' }]">
      <a-input v-model:value="formData.username" placeholder="请输入用户名或邮箱"></a-input>
    </a-form-item>
    <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
      <a-input-password
        v-model:value="formData.password"
        placeholder="请输入密码"
      ></a-input-password>
    </a-form-item>
    <a-form-item name="code" :rules="[{ required: true, message: '请输入验证码' }]">
      <a-space>
        <a-input v-model:value="formData.code" placeholder="请输入验证码"></a-input>
        <a-button
          :loading="captchaLoading"
          @click="refreshCode"
          :style="{ backgroundImage: `url(${captchaImageBase64})` }"
          class="w-[110px]! bg-cover bg-center bg-no-repeat"
        ></a-button>
      </a-space>
    </a-form-item>
    <a-form-item class="mt-36px">
      <a-button class="w-full" type="primary" html-type="submit" :loading="isLoading">
        登录
      </a-button>
      <div class="mt-9px flex items-center justify-between">
        <div>
          <span>没有账号？</span>
          <a-button class="px-0!" @click="handleRegister" type="link" size="small"
            >点击注册
          </a-button>
        </div>
        <a-button
          class="px-0!"
          @click="router.push({ name: 'PasswordReset' })"
          type="link"
          size="small"
          >忘记密码？
        </a-button>
      </div>
    </a-form-item>
  </a-form>
  <a-checkbox v-model:checked="checked">
    我已阅读并同意
    <a-button class="px-0" type="link" @click.stop>服务协议</a-button>
    <span> 和 </span>
    <a-button class="px-0" type="link" @click.stop>隐私政策</a-button>
  </a-checkbox>
  <a-flex :gap="16" class="mt-34px" justify="center">
    <a v-for="item in loginMethods" class="flex justify-center">
      <img class="h-30px rd-3px" :src="item.icon" :alt="item.name" />
    </a>
  </a-flex>
</template>

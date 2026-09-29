<script setup lang="ts">
import { useAuth } from '@/hooks';
import { t } from '@/i18n';
import { isMockLogin } from '@/mocks/auth';
import { message } from '@/utils/message';

const checked = ref(true);
const auth = useAuth();
const isLoading = ref(false);
const formData = reactive({
  username: isMockLogin ? 'admin' : '',
  password: isMockLogin ? '123456' : '',
});

const handleSubmit = async () => {
  if (!checked.value) {
    message.warn(t('请先同意服务协议和隐私权说明'));
    return;
  }

  isLoading.value = true;
  await auth.accountLogin(formData).finally(() => {
    isLoading.value = false;
  });
};
</script>

<template>
  <t-form
    label-width="0"
    :required-mark="false"
    @submit="handleSubmit"
    :data="formData"
    size="large"
  >
    <t-form-item name="username" :rules="[{ required: true, message: t('请输入用户名或邮箱') }]">
      <t-input v-model="formData.username" :placeholder="t('请输入用户名或邮箱')"></t-input>
    </t-form-item>
    <t-form-item name="password" :rules="[{ required: true, message: t('请输入密码') }]">
      <t-input type="password" v-model="formData.password" :placeholder="t('请输入密码')"></t-input>
    </t-form-item>
    <t-form-item class="login-submit" style="margin-top: 16px">
      <t-button class="w-full" theme="primary" type="submit" :loading="isLoading">
        {{ t('登录') }}
      </t-button>
    </t-form-item>
  </t-form>
  <t-checkbox v-model="checked" class="agreement">
    <span>{{ t('我已阅读并同意') }}</span>
    <t-button class="agreement__link" variant="text" theme="primary" @click.stop>
      {{ t('服务协议') }}
    </t-button>
    <span>{{ t('和') }}</span>
    <t-button class="agreement__link" variant="text" theme="primary" @click.stop>
      {{ t('隐私政策') }}
    </t-button>
  </t-checkbox>
</template>

<style scoped lang="less">
.agreement {
  display: flex;
  align-items: flex-start;
  margin-top: 12px;

  :deep(.t-checkbox__input) {
    margin-top: 3px;
  }

  :deep(.t-checkbox__label) {
    line-height: 22px;
  }
}

.agreement__link {
  height: auto;
  padding: 0;
  margin: 0 4px;
  line-height: inherit;
  vertical-align: baseline;
}
</style>

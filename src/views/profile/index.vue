<script setup lang="ts">
import { useRoute } from 'vue-router';
import { keyBy } from 'lodash-es';

import { useUserStore } from '@/store';
import router from '@/router';
import { UpdateUser, updateUser } from '@/api/user';
import { message } from 'ant-design-vue';
import { avatarList } from '@/assets/avatar/icons';
import UploadFile from '@/components/Upload/File/index.vue';
import qqIcon from '@/assets/images/qq.png';
import wxIcon from '@/assets/images/wx.png';
import githubIcon from '@/assets/images/github.png';
import {
  bindList,
  bind,
  QQRedirectURL,
  GithubRedirectURL,
  CallbackType,
  ThirdPartyProvider,
} from '@/api/user/third-party';
import { t } from '@/i18n';
import Avatar from '@/components/Avatar/index.vue';

const route = useRoute();

const activeKey = ref('profile');

const GENDER_OPTIONS = [
  { value: 0, label: '未知' },
  { value: 1, label: '男' },
  { value: 2, label: '女' },
];

const userStore = useUserStore();

const formState = reactive<UpdateUser>({
  userId: userStore.user?.userId as number,
  gender: userStore.user?.gender as number,
  username: userStore.user?.username || '',
  nickname: userStore.user?.nickname || '',
  avatar: userStore.user?.avatar || '',
});

const isSubmit = ref(false);
const handleSubmit = async () => {
  isSubmit.value = true;
  await updateUser(formState).finally(() => {
    isSubmit.value = false;
  });
  await userStore.getUserInfo();
  message.success('操作成功');
};

const setAvatar = (avatar: string) => {
  formState.avatar = avatar;
};

const accountList = ref([
  {
    provider: ThirdPartyProvider.GITHUB,
    icon: githubIcon,
    name: 'GitHub 登录',
    bind: false,
    avatar: '',
    nickname: '',
    bindTime: '',
    disabled: false,
    href: GithubRedirectURL(CallbackType.BIND),
  },
  {
    provider: ThirdPartyProvider.QQ,
    icon: qqIcon,
    name: 'QQ 登录',
    bind: false,
    avatar: '',
    nickname: '',
    bindTime: '',
    disabled: false,
    href: QQRedirectURL(CallbackType.BIND),
  },
  {
    provider: ThirdPartyProvider.WECHAT,
    icon: wxIcon,
    name: '微信登录',
    bind: false,
    avatar: '',
    nickname: '',
    bindTime: '',
    href: '',
    disabled: true,
  },
]);

const isLoading = ref(false);
const getBindList = async () => {
  isLoading.value = true;
  const res = await bindList().finally(() => {
    isLoading.value = false;
  });
  const group = keyBy(res.data, 'provider');
  accountList.value.map((row) => {
    const data = group[row.provider];
    row.bind = !!data;
    row.avatar = data?.avatar;
    row.nickname = data?.nickname;
    row.bindTime = data?.bindTime;
  });
};

/**
 * 三方账号绑定回调
 */
const thirdPartyBindCallback = async () => {
  const { code, provider } = route.query as { code: string; provider: string };
  if (code && provider) {
    const destroy = message.loading({ content: '绑定中', key: code, duration: 10 });
    await bind({
      provider: provider,
      authCode: code,
    }).finally(() => {
      destroy();
      router.replace({
        path: '/profile',
      });
    });
    message.success({ content: t('绑定成功'), key: code });
    await getBindList();
  }
};

onMounted(async () => {
  await thirdPartyBindCallback();
});

const handleChange = (key: string) => {
  if (key === 'account') {
    getBindList();
  }
};
</script>

<template>
  <div class="m-10px">
    <a-card>
      <a-tabs @change="handleChange" v-model:activeKey="activeKey">
        <a-tab-pane key="profile" tab="个人中心">
          <a-form
            @finish="handleSubmit"
            class="max-w-600px"
            ref="formRef"
            :model="formState"
            :label-col="{ span: 4 }"
          >
            <a-form-item
              label="头像"
              name="avatar"
              :rules="[{ required: true, message: '请选择头像' }]"
            >
              <UploadFile @change="setAvatar">
                <Avatar class="cursor-pointer" shape="square" :src="formState.avatar" :size="60" />
              </UploadFile>
              <div class="mt-20px mb-30px">
                <a-space :size="[10, 10]" wrap>
                  <template v-for="avatar in avatarList" :key="avatar">
                    <div
                      class="size-50px border-solid border-2px opacity-60 cursor-pointer rounded-5px border-color-transparent"
                      :class="
                        formState.avatar === avatar.name
                          ? 'border-color-[var(--color-primary)]! opacity-100!'
                          : ''
                      "
                      @click="setAvatar(avatar.name)"
                    >
                      <img class="size-46px rounded-3px" :src="avatar.src" alt="" />
                    </div>
                  </template>
                </a-space>
              </div>
            </a-form-item>
            <a-form-item
              label="用户名"
              name="username"
              :rules="[{ required: true, message: '请输入用户名' }]"
            >
              <a-input v-model:value="formState.username"></a-input>
            </a-form-item>
            <a-form-item
              label="昵称"
              name="nickname"
              :rules="[{ required: true, message: '请输入昵称' }]"
            >
              <a-input v-model:value="formState.nickname"></a-input>
            </a-form-item>
            <a-form-item
              label="性别"
              name="gender"
              :rules="[{ required: true, message: '请选择性别' }]"
            >
              <a-select
                v-model:value="formState.gender"
                :options="GENDER_OPTIONS"
                placeholder="请选择性别"
              ></a-select>
            </a-form-item>
            <a-form-item label="密码">
              <a-flex :gap="8">
                <a-input disabled value="******"></a-input>
                <a-button @click="router.push({ name: 'PasswordReset' })">修改密码</a-button>
              </a-flex>
            </a-form-item>
            <a-form-item :wrapper-col="{ span: 20, offset: 4 }" class="mt-36px">
              <a-button html-type="submit" type="primary" :loading="isSubmit"> 保存修改</a-button>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="account" tab="第三方帐号绑定">
          <a-table
            bordered
            :loading="isLoading"
            size="middle"
            class="max-w-600px"
            :pagination="false"
            :data-source="accountList"
          >
            <a-table-column title="登录方式">
              <template #default="{ record }">
                <div
                  class="flex items-center"
                  :class="{
                    'opacity-20': record.disabled,
                  }"
                >
                  <img class="size-30px rd-3px mx-8px" :src="record.icon" alt="" />
                  <span>{{ record.name }}</span>
                </div>
              </template>
            </a-table-column>
            <a-table-column title="账号信息">
              <template #default="{ record }">
                <div v-if="!!record.avatar" class="flex items-center">
                  <Avatar :size="30" :src="record.avatar" />
                  <div class="ml-8px max-w-150px overflow-hidden">{{ record.nickname }}</div>
                </div>
              </template>
            </a-table-column>
            <a-table-column data-index="bindTime" title="绑定时间" />
            <a-table-column align="center" :width="90" title="操作">
              <template #default="{ record }">
                <a-button
                  :disabled="record.bind"
                  type="link"
                  :href="record.href"
                  :class="{
                    'opacity-20': record.disabled,
                  }"
                >
                  {{ record.bind ? '已绑定' : '绑定' }}
                </a-button>
              </template>
            </a-table-column>
          </a-table>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store';
import router from '@/router';
import { UpdateUser, updateUser } from '@/api/user';
import { message } from 'ant-design-vue';
import { avatarList } from '@/assets/avatar/icons';
import UploadFile from '@/components/Upload/File/index.vue';

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
</script>

<template>
  <div class="m-10px">
    <a-card>
      <div class="title-label mb-60px font-size-20px">个人中心</div>
      <a-form
        @finish="handleSubmit"
        class="max-w-500px"
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
    </a-card>
  </div>
</template>

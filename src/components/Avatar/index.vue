<script setup lang="ts">
import { avatarList } from '@/assets/avatar/icons';
import { viewFile, getFileToken } from '@/api/system/file';
import BOY_AVATAR_A from '@/assets/avatar/GIRL_AVATAR_F.svg';

const props = withDefaults(
  defineProps<{
    shape?: 'circle' | 'square';
    name?: string;
    size?: number | string;
    src?: string;
  }>(),
  {
    shape: 'circle',
    name: '',
    src: '',
    size: 44,
  },
);

const avatar = ref('');

const setAvatar = async (val: string) => {
  if (val) {
    const data = avatarList.find((item) => item.name === props.src);
    if (data) {
      return data.src;
    }
    if (val.includes('file-view:')) {
      return viewFile(props.src);
    }
    const res = await getFileToken(props.src);
    return viewFile(res.data);
  }
  return val;
};

watch(
  () => props.src,
  async () => {
    avatar.value = await setAvatar(props.src);
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <a-avatar :shape="shape" :src="avatar" :size="size">
    <template #icon>
      <img :src="BOY_AVATAR_A" alt="" />
    </template>
  </a-avatar>
</template>

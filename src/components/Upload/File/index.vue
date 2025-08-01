<script setup lang="ts">
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';
import request from '@/utils/request';

const emit = defineEmits(['change']);
const customRequest = async ({ file }: any) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await request.upload('/files/upload', file);
    emit('change', res.data);
  } catch (err) {
    message.error('请求失败');
  }
};

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('仅支持图片文件！');
    return false;
  }

  const isLt1M = file.size / 1024 / 1024 <= 1;
  if (!isLt1M) {
    message.warning('文件超过 1 MB');
  }

  return true;
};
</script>

<template>
  <a-upload :customRequest="customRequest" :showUploadList="false" :beforeUpload="beforeUpload">
    <slot>
      <a-button type="primary">
        <upload-outlined></upload-outlined>
        上传文件
      </a-button>
    </slot>
  </a-upload>
</template>

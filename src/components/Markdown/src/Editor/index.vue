<template>
  <div class="markdown-container">
    <Editor :value="modelValue" @change="handleChange" :plugins="plugins" :locale="lang" />
  </div>
</template>

<script setup lang="ts">
import { Editor } from '@bytemd/vue-next';
import lang from 'bytemd/locales/zh_Hans.json';
import plugins from '@/components/Markdown/src/common/plugins';

defineOptions({
  name: 'MdEditor',
});

defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleChange = (value: string) => {
  emit('update:modelValue', value);
};
</script>

<style lang="less">
@import url('@/components/Markdown/src/common/style.less');
</style>

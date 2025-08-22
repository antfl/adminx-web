<script lang="ts" setup>
import { t } from '@/i18n';
import type { PopconfirmProps } from 'ant-design-vue';

const attrs = useAttrs();
withDefaults(
  defineProps<{
    name?: string;
    title: string;
    placement?: PopconfirmProps['placement'];
    cancelText?: string;
    okText?: string;
  }>(),
  {
    name: '',
    title: '',
    placement: 'topLeft',
    cancelText: t('取消'),
    okText: t('确定'),
  },
);

const emit = defineEmits<{
  (e: 'confirm', payload: MouseEvent): void;
  (e: 'cancel', payload: MouseEvent): void;
}>();

const confirm = (e: MouseEvent) => {
  emit('confirm', e);
};

const cancel = (e: MouseEvent) => {
  emit('cancel', e);
};
</script>

<template>
  <a-popconfirm
    v-bind="attrs"
    :placement="placement"
    :title="title"
    :ok-text="okText"
    :cancel-text="cancelText"
    :okButtonProps="{
      danger: true,
    }"
    @confirm="confirm"
    @cancel="cancel"
  >
    <slot>
      <a-button danger type="link">{{ name }}</a-button>
    </slot>
  </a-popconfirm>
</template>

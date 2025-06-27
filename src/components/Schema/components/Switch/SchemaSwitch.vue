<script setup lang="ts">
import { useFormOptions } from '@/components/Schema/hooks/useFormOptions';
import type { FormItemProps } from '@/components/Schema/types';

const attrs = useAttrs();

interface Props extends FormItemProps {
  value?: boolean;
}

const props = withDefaults(defineProps<Props>(), {});

const emit = defineEmits<{
  (e: 'field-change', payload: { name: string; value: any }): void;
}>();

const { isView, viewSlot, viewValue } = useFormOptions(
  props,
  computed(() => props.value),
);

const handleChange = (value: boolean) => {
  emit('field-change', { name: props.name, value });
};

defineExpose({
  bindFieldName: props.name,
  scope: props.scope,
});
</script>

<template>
  <template v-if="isView">
    <slot v-if="viewSlot" :name="viewSlot"></slot>
    <template v-else>{{ viewValue }}</template>
  </template>
  <a-switch v-else @change="handleChange" :checked="value" v-bind="attrs"> </a-switch>
</template>

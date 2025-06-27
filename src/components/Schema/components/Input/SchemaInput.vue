<script setup lang="ts">
import { useFormOptions } from '@/components/Schema/hooks/useFormOptions';
import type { FormItemProps } from '@/components/Schema/types';

const attrs = useAttrs();

interface Props extends FormItemProps {
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {});
const { isView, viewSlot, viewValue } = useFormOptions(
  props,
  computed(() => props.value),
);

const emit = defineEmits<{
  (e: 'field-change', payload: { name: string; value: any }): void;
}>();

const handleChange = (value: any) => {
  emit('field-change', { name: props.name, value: value.target.value });
};
</script>

<template>
  <div>
    <template v-if="isView">
      <slot v-if="viewSlot" :name="viewSlot" :value="value"></slot>
      <template v-else>{{ viewValue }}</template>
    </template>
    <a-input v-else v-bind="attrs" @change="handleChange"> </a-input>
  </div>
</template>

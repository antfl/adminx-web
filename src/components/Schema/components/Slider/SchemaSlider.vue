<script setup lang="ts">
import { useFormOptions } from '@/components/Schema/hooks/useFormOptions';
import type { FormItemProps } from '@/components/Schema/types';

defineOptions({ name: 'SchemaSlider' });

interface Props extends FormItemProps {
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {});
const internalModel = ref(props.formData[props.name]);

const { isView, viewSlot, viewValue } = useFormOptions(props, internalModel);

const emit = defineEmits<{
  (e: 'field-change', payload: { name: string; value: any }): void;
}>();

const handleChange = (value: any) => {
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
  <a-slider v-else @change="handleChange" :value="value" />
</template>

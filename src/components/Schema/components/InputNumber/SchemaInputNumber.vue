<script setup lang="ts">
import { FORM_ITEM_EMIT_NAME } from '@/components/Schema/constants';
import { useFormOptions } from '@/components/Schema/hooks/useFormOptions';
import type { FormItemProps } from '@/components/Schema/types';

defineOptions({ name: 'SchemaInputNumber' });

interface Props extends FormItemProps {
  value?: string;
}

const props = withDefaults(defineProps<Props>(), {});
const internalModel = ref(props.formData[props.name]);

const { isView, viewSlot, viewValue } = useFormOptions(props, internalModel);

const emit = defineEmits([FORM_ITEM_EMIT_NAME]);
const handleChange = () => {
  emit(FORM_ITEM_EMIT_NAME, { ...props, internalModel });
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
  <a-input-number @change="handleChange" v-else v-model="internalModel">
    <template #prefix v-if="props?.itemProps?.decreaseIconSlot">
      <slot :name="props.itemProps.decreaseIconSlot"></slot>
    </template>
    <template #prefix v-if="props?.itemProps?.increaseIconSlot">
      <slot :name="props.itemProps.increaseIconSlot"></slot>
    </template>
    <template #prefix v-if="props?.itemProps?.prefixSlot">
      <slot :name="props.itemProps.prefixSlot"></slot>
    </template>
  </a-input-number>
</template>

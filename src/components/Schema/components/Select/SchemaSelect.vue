<script setup lang="ts">
import { OPTION_LABEL_KEY, OPTION_VALUE_KEY } from '@/components/Schema/constants';
import { useFormOptions } from '@/components/Schema/hooks/useFormOptions';
import type { FormItemProps } from '@/components/Schema/types';
import type { SelectProps } from 'ant-design-vue';

defineOptions({ name: 'SchemaSelect' });

interface Props extends FormItemProps {
  value?: SelectProps['value'];
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: OPTION_LABEL_KEY,
  valueKey: OPTION_VALUE_KEY,
});

const internalModel = ref(props.formData[props.name]);

const { isView, viewSlot, viewValue, options, isLoading, loadOptions } = useFormOptions(
  props,
  internalModel,
);

const emit = defineEmits<{
  (e: 'field-change', payload: { name: string; value: any }): void;
}>();

const handleChange = (value: SelectProps['value']) => {
  emit('field-change', { name: props.name, value });
};

onMounted(() => {
  loadOptions();
});

const attrs = useAttrs();

defineExpose({
  loadOptions,
  bindFieldName: props.name,
  scope: props.scope,
});
</script>

<template>
  <template v-if="isView">
    <slot v-if="viewSlot" :name="viewSlot"></slot>
    <template v-else>{{ viewValue }}</template>
  </template>
  <a-select v-bind="attrs" v-else :loading="isLoading" @change="handleChange" :value="value">
    <a-select-option
      v-for="item in options"
      :key="item[valueKey]"
      :value="item[valueKey]"
      v-bind="props?.itemProps?.optionProps"
    >
      {{ item[labelKey] }}
    </a-select-option>
  </a-select>
</template>

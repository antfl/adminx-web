<script setup lang="ts">
import { OPTION_LABEL_KEY, OPTION_VALUE_KEY } from '@/components/Schema/constants';
import { useFormOptions } from '@/components/Schema/hooks/useFormOptions';
import type { FormItemProps } from '@/components/Schema/types';

defineOptions({ name: 'SchemaSelect' });

interface Props extends FormItemProps {
  value?: string | number | boolean;
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

const handleChange = (value: any) => {
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
    <template #header v-if="props?.itemProps?.headerSlot">
      <slot :name="props.itemProps.headerSlot"></slot>
    </template>
    <template #footer v-if="props?.itemProps?.footerSlot">
      <slot :name="props.itemProps.footerSlot"></slot>
    </template>
    <template #prefix v-if="props?.itemProps?.prefixSlot">
      <slot :name="props.itemProps.prefixSlot"></slot>
    </template>
    <template #empty v-if="props?.itemProps?.emptySlot">
      <slot :name="props.itemProps.emptySlot"></slot>
    </template>
    <template #loading v-if="props?.itemProps?.loadingSlot">
      <slot :name="props.itemProps.loadingSlot"></slot>
    </template>
    <template #label v-if="props?.itemProps?.labelSlot">
      <slot :name="props.itemProps.labelSlot"></slot>
    </template>
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

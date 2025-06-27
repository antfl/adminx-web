<script setup lang="ts">
import { useFormOptions } from '@/components/Schema/hooks/useFormOptions';
import type { FormItemProps } from '@/components/Schema/types';

interface Props extends FormItemProps {
  value?: string | number | boolean;
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: 'label',
  valueKey: 'value',
  value: () => '',
});

const { isView, viewSlot, viewValue, options, loadOptions } = useFormOptions(
  props,
  computed(() => props.value),
);

const emit = defineEmits<{
  (e: 'field-change', payload: { name: string; value: any }): void;
}>();

const handleChange = (e: any) => {
  emit('field-change', { name: props.name, value: e.target.value });
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
  <div>
    <template v-if="isView">
      <slot v-if="viewSlot" :name="viewSlot"></slot>
      <template v-else>{{ viewValue }}</template>
    </template>
    <a-radio-group v-bind="attrs" v-else @change="handleChange" :value="value">
      <a-radio
        v-for="item in options"
        :key="item[valueKey]"
        :value="item[valueKey]"
        v-bind="props?.itemProps?.optionProps"
      >
        {{ item[labelKey] }}
      </a-radio>
    </a-radio-group>
  </div>
</template>

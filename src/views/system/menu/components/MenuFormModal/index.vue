<script setup lang="ts">
import { message } from 'ant-design-vue';

import { saveMenu } from '@/api/system/menu';
import { useComponentScanner } from '@/hooks';
import { t } from '@/i18n';
import { Menu } from '@/types/meun';

const { components } = useComponentScanner();

const formRef = ref();
const visible = ref(false);
const modalTile = ref('');
let callback: (...args: any[]) => any;
const showModal = ({ onSuccess }: { onSuccess: (...args: any[]) => any }) => {
  callback = onSuccess;
  modalTile.value = t('新增菜单');
  visible.value = true;
};

const isLoading = ref(false);

const formData = ref<Menu>({} as Menu);
const handleOk = async () => {
  isLoading.value = true;
  await saveMenu(formData.value).finally(() => {
    isLoading.value = false;
  });

  callback && callback();
  message.success(t('操作成功'));
  visible.value = false;
};

defineExpose({
  showModal,
});
</script>

<template>
  <a-modal v-model:open="visible" width="600px" :title="modalTile" @ok="handleOk">
    <a-form ref="formRef" :label-col="{ span: 5 }" :wrapperCol="{ span: 18 }" :model="formData">
      <a-form-item :label="t('所属')" name="parentId">
        <a-select :placeholder="t('请选择')" v-model:value="formData.parentId"></a-select>
      </a-form-item>
      <a-form-item :label="t('中文名称')" name="name">
        <a-input :placeholder="t('请输入')" v-model:value="formData.name"></a-input>
      </a-form-item>
      <a-form-item :label="t('英文名称')" name="title">
        <a-input :placeholder="t('请输入')" v-model:value="formData.title"></a-input>
      </a-form-item>
      <a-form-item :label="t('地址')" name="path">
        <a-input :placeholder="t('请输入')" v-model:value="formData.path"></a-input>
      </a-form-item>
      <a-form-item :label="t('顺序')" name="sortOrder">
        <a-input-number
          class="w-full"
          :placeholder="t('请输入')"
          v-model:value="formData.sortOrder"
        ></a-input-number>
      </a-form-item>
      <a-form-item :label="t('图标')" name="icon">
        <a-input :placeholder="t('请选择')" v-model:value="formData.icon"></a-input>
      </a-form-item>
      <a-form-item :label="t('组件')" name="component">
        <a-select :placeholder="t('请选择')" show-search v-model:value="formData.component">
          <a-select-option v-for="path in components" :key="path.filePath" :value="path.filePath"
            >{{ path.filePath }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="t('权限标识')" name="permission">
        <a-input :placeholder="t('请输入')" v-model:value="formData.permission"></a-input>
      </a-form-item>
      <a-form-item :label="t('类型')" name="menuType">
        <a-radio-group v-model:value="formData.menuType">
          <a-radio :value="1">{{ t('目录') }}</a-radio>
          <a-radio :value="2">{{ t('页面') }}</a-radio>
          <a-radio :value="3">{{ t('按钮') }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="t('页面配置')">
        <a-checkbox v-model:value="formData.hidden">{{ t('隐藏') }}</a-checkbox>
        <a-checkbox v-model:value="formData.cache">{{ t('缓存') }}</a-checkbox>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

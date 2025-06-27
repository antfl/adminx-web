<script setup lang="ts">
import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { ArticleCategory, saveArticleCategory } from '@/api/system/article';
import { t } from '@/i18n';

const formRef = ref();
const visible = ref(false);
const modalTile = ref('');
let callback: Function;
const showModal = ({ onSuccess, row }: { onSuccess: Function, row?: ArticleCategory }) => {
  formData.value = {} as ArticleCategory;
  callback = onSuccess;
  modalTile.value = row ? t('编辑分类') : t('新增分类');
  if (row) {
    formData.value = cloneDeep(row);
  }
  visible.value = true;
};

const isLoading = ref(false);

const formData = ref<ArticleCategory>({} as ArticleCategory);
const handleOk = async () => {
  isLoading.value = true;
  await saveArticleCategory(formData.value).finally(() => {
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
  <a-modal
    v-model:open="visible"
    width="600px"
    :title="modalTile"
    @ok="handleOk"
  >
    <a-form
      ref="formRef"
      :label-col="{ span: 5 }"
      :wrapperCol="{ span: 18 }"
      :model="formData"
    >
      <a-form-item :label="t('分类名称')" name="dictName">
        <a-input :placeholder="t('请输入')" v-model:value="formData.categoryName"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

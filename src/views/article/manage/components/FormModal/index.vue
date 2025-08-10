<script setup lang="ts">
import { message } from 'ant-design-vue';
import { cloneDeep, pick } from 'lodash-es';

import {
  Article,
  ArticleCategory,
  saveArticle,
  listCategory,
  detailArticle,
} from '@/api/article/article';
import { t } from '@/i18n';

const isLoading = ref(false);
const categoryList = ref<ArticleCategory[]>([]);
const formRef = ref();
const visible = ref(false);
const modalTile = ref('');
let callback: (...args: any[]) => any;
const showModal = async ({
  onSuccess,
  row,
}: {
  onSuccess: (...args: any[]) => any;
  row?: Article;
}) => {
  isLoading.value = true;
  formData.value = {} as Article;
  callback = onSuccess;
  modalTile.value = row ? t('编辑文章') : t('新增文章');
  visible.value = true;
  if (row) {
    formData.value = cloneDeep(row);
    const detail = await detailArticle(row.articleId + '');
    Object.assign(formData.value, pick(detail.data, 'content'));
  }
  const res = await listCategory();
  categoryList.value = res.data;
  isLoading.value = false;
};

const isSubmit = ref(false);
const formData = ref<Article>({} as Article);
const handleOk = async () => {
  await formRef.value.validate();
  isSubmit.value = true;
  await saveArticle(formData.value).finally(() => {
    isSubmit.value = false;
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
    width="800px"
    :title="modalTile"
    @ok="handleOk"
    :ok-button-props="{
      loading: isSubmit,
      disabled: isLoading,
    }"
  >
    <a-spin :spinning="isLoading">
      <a-form ref="formRef" :label-col="{ span: 4 }" :wrapperCol="{ span: 20 }" :model="formData">
        <a-form-item
          :label="t('文章标题')"
          name="title"
          :rules="[{ required: true, message: '请输入文章标题' }]"
        >
          <a-input :placeholder="t('请输入')" v-model:value="formData.title"></a-input>
        </a-form-item>
        <a-form-item
          :label="t('文章分类')"
          name="categoryId"
          :rules="[{ required: true, message: '请选择文章分类' }]"
        >
          <a-select
            :placeholder="t('请选择')"
            v-model:value="formData.categoryId"
            :options="categoryList"
            :fieldNames="{
              label: 'categoryName',
              value: 'categoryId',
            }"
          >
          </a-select>
        </a-form-item>
        <a-form-item
          :label="t('文章内容')"
          name="content"
          :rules="[
            { required: true, message: '请输入文章内容' },
            { min: 100, max: 20000, message: '文章内容必须包含 100 到 20000 字符' },
          ]"
        >
          <a-textarea :rows="11" :placeholder="t('请输入')" v-model:value="formData.content">
          </a-textarea>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

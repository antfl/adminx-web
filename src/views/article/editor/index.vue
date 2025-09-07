<script setup lang="ts">
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { CloseOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { MdEditor } from '@/components/Markdown';

import {
  Article,
  ArticleCategory,
  saveArticle,
  listCategory,
  detailArticle,
} from '@/api/article/article';
import { t } from '@/i18n';
import router from '@/router';

const route = useRoute();

const isLoading = ref(false);
const categoryList = ref<ArticleCategory[]>([]);
const formRef = ref();
const init = async () => {
  const { id } = route.query;
  isLoading.value = true;
  formData.value = {} as Article;
  if (id) {
    const detail = await detailArticle(id as string);
    Object.assign(formData.value, detail.data);
  }
  const res = await listCategory();
  categoryList.value = res.data;
  isLoading.value = false;
};

const isSubmit = ref(false);
const formData = ref<Article>({} as Article);
const submitForm = async () => {
  await formRef.value.validate();
  isSubmit.value = true;
  await saveArticle(formData.value).finally(() => {
    isSubmit.value = false;
  });
  message.success(t('操作成功'));
  handleBack();
};

const handleBack = () => {
  Modal.confirm({
    title: '确认关闭吗？',
    content: '该操作不会保存当前编辑内容',
    onOk() {
      router.back();
    },
  });
};

onMounted(() => {
  init();
});
</script>

<template>
  <div class="article-editor-container m-10px">
    <a-form ref="formRef" :model="formData" layout="inline" class="pos-relative mb-10px">
      <a-form-item name="title" :rules="[{ required: true }]">
        <a-input :placeholder="t('请输入文章标题')" v-model:value="formData.title"></a-input>
      </a-form-item>
      <a-form-item name="categoryId" :rules="[{ required: true }]">
        <a-select
          class="w-130px!"
          :placeholder="t('请选择文章分类')"
          v-model:value="formData.categoryId"
          :options="categoryList"
          :fieldNames="{
            label: 'categoryName',
            value: 'categoryId',
          }"
        >
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" :loading="isSubmit" @click="submitForm">发布</a-button>
      </a-form-item>
      <CloseOutlined
        class="p-10px pos-absolute right-0 top-50% transform -translate-y-50%"
        @click="handleBack"
      />
    </a-form>
    <a-spin :spinning="isLoading">
      <MdEditor v-model="formData.content" />
    </a-spin>
  </div>
</template>

<style scoped lang="less">
.article-editor-container {
  :deep(.ant-form-item-control) {
    > div:nth-child(2) {
      display: none !important;
    }
  }
}
</style>

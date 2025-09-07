<script setup lang="ts">
import { onMounted } from 'vue';

import { MdViewer } from '@/components/Markdown';
import { detailArticle } from '@/api/article/article';
const markdownContent = ref('');
const isLoading = ref(true);

const getDetail = async () => {
  isLoading.value = true;
  const res = await detailArticle('2498');
  markdownContent.value = res.data.content;
  isLoading.value = false;
};
onMounted(() => {
  getDetail();
});
</script>

<template>
  <div class="m-10px">
    <a-card>
      <a-spin :spinning="isLoading">
        <MdViewer :content="markdownContent" />
      </a-spin>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import {
  HeartFilled,
  StarFilled,
  MessageOutlined,
  ArrowLeftOutlined,
  ShareAltOutlined,
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';
import { useRoute } from 'vue-router';
import { useClipboard } from '@vueuse/core';
import { MdViewer } from '@/components/Markdown';
import { Article, detailArticle, InteractionType, toggleInteraction } from '@/api/article/article';
import router from '@/router';
import CommentComposer from '@/views/article/components/CommentComposer/index.vue';
import { omit } from 'lodash-es';

const route = useRoute();

const { copy } = useClipboard();

const articleData = ref<Article>({} as Article);
const isLoading = ref(false);
const handleInteraction = async (type: InteractionType) => {
  const res = await toggleInteraction({
    type,
    articleId: articleData.value?.articleId as number,
  });
  message.success(res.data);
  await getDetail();
};
const commentComposerRef = ref();
const getDetail = async () => {
  isLoading.value = true;
  const { params } = route;
  const res = await detailArticle(params.articleId as string);
  articleData.value = res.data;
  commentComposerRef.value.init(res.data);
  isLoading.value = false;
};

const handleBack = () => {
  router.back();
};

watch(
  () => route.params.articleId,
  () => {
    getDetail();
  },
  { immediate: true },
);

const targetElementRef = ref<HTMLElement | null>(null);
const handleComment = () => {
  if (targetElementRef.value) {
    targetElementRef.value.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
};

const handleShare = () => {
  const path = window.location.href;
  copy(path);
  message.success('已复制');
};

const setButtonProps = (active: boolean | undefined) => {
  const obj = {
    ghost: active,
    type: 'primary',
  };
  if (active) {
    return obj;
  }
  return omit(obj, 'type');
};
</script>

<template>
  <div class="m-10px">
    <a-card class="m-auto w-100% md:w-70%">
      <div class="pos-absolute top-150px">
        <div class="pos-sticky z-100 left-0 -translate-x-90px">
          <a-flex vertical :gap="16">
            <a-button
              class="mb-25px border-color-[var(--color-border-secondary)] shadow-none"
              @click="handleBack"
              size="large"
              shape="circle"
            >
              <ArrowLeftOutlined />
            </a-button>
            <a-badge color="#4d6bfe" :count="articleData?.likeCount" :offset="[-5, 5]">
              <a-button
                @click="handleInteraction(InteractionType.LIKE)"
                size="large"
                class="border-color-[var(--color-border-secondary)] shadow-none"
                shape="circle"
                v-bind="setButtonProps(articleData?.isLiked)"
              >
                <HeartFilled />
              </a-button>
            </a-badge>
            <a-badge color="#4d6bfe" :count="articleData?.favoriteCount" :offset="[-5, 5]">
              <a-button
                @click="handleInteraction(InteractionType.FAVORITE)"
                size="large"
                class="border-color-[var(--color-border-secondary)] shadow-none"
                shape="circle"
                v-bind="setButtonProps(articleData?.isFavorite)"
              >
                <StarFilled />
              </a-button>
            </a-badge>
            <a-badge color="#4d6bfe" :count="articleData?.commentCount" :offset="[-5, 5]">
              <a-button
                @click="handleComment"
                size="large"
                shape="circle"
                class="border-color-[var(--color-border-secondary)] shadow-none"
              >
                <MessageOutlined />
              </a-button>
            </a-badge>
            <a-button
              class="border-color-[var(--color-border-secondary)] shadow-none"
              size="large"
              shape="circle"
              @click="handleShare"
            >
              <ShareAltOutlined />
            </a-button>
          </a-flex>
        </div>
      </div>
      <div class="flex items-center mb-30px">
        <Avatar class="flex-shrink-0" :src="articleData?.avatar" :size="50" />
        <div class="ml-8px">
          <div class="font-size-16px">{{ articleData?.nickname }}</div>
          <div class="color-#666">{{ articleData?.createTime }}</div>
        </div>
      </div>
      <h1 class="mb-16px font-size-20px">{{ articleData?.title }}</h1>
      <a-badge-ribbon :text="articleData?.categoryName">
        <a-card :loading="isLoading">
          <MdViewer :content="articleData.content" />
        </a-card>
      </a-badge-ribbon>
      <div ref="targetElementRef">
        <a-divider orientation="left">
          <span>评论</span>
          <span class="ml-5px" v-if="articleData?.commentCount">
            {{ articleData?.commentCount }}
          </span>
        </a-divider>
        <CommentComposer @onChange="getDetail" ref="commentComposerRef" />
      </div>
    </a-card>
  </div>
</template>

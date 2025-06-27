<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue';

import { Comment } from '@/api/content';
import CommentInput from '@/components/CommentInput/index.vue';
import { t } from '@/i18n';

const props = withDefaults(
  defineProps<{
    isChild?: boolean;
    comment: Comment;
  }>(),
  {
    isChild: false,
    comment: () => ({}) as Comment,
  },
);

const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      text: string;
      done: (...args: any[]) => any;
      parentId?: number;
      replyToUserId?: number;
    },
  ): void;
}>();

const handleSubmit = ({
  text,
  done,
  replyToUserId,
}: {
  text: string;
  done: (...args: any[]) => any;
  parentId?: number;
  replyToUserId?: number;
}) => {
  const parentId = props.comment.id;
  emit('submit', { text, done, parentId, replyToUserId });
};

const handleClosed = (item: Comment) => {
  item.isComment = false;
};

const handleReply = (item: Comment) => {
  item.isComment = true;
};
</script>

<template>
  <a-flex>
    <a-avatar class="flex-shrink-0" :src="comment.userAvatar" :size="36">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
    <div class="flex-1 ml-8px">
      <div>
        <span class="font-size-16px mr-8px">{{ comment.userName }}</span>
        <a-tag v-if="comment.isOwn" :bordered="false" color="processing">作者</a-tag>
        <template v-if="isChild">
          <span>回复</span>
          <span class="ml-8px font-size-16px">{{ comment.replyTo }}</span>
        </template>
      </div>
      <div class="color-#666">
        {{ comment.createTime }}
      </div>
      <div class="mb-5px">{{ comment.content }}</div>
      <div>
        <CommentInput
          v-if="comment.isComment"
          @closed="handleClosed(comment)"
          @submit="(data) => handleSubmit({ ...data, replyToUserId: comment.userId })"
        />
        <a v-else @click="handleReply(comment)" type="link">{{ t('回复') }}</a>
        <ul v-if="comment?.replies?.length > 0" class="px-0 mt-8px">
          <li class="mb-16px" v-for="reply in comment.replies" :key="reply.id">
            <CommentRender
              @submit="(data) => handleSubmit({ ...data, replyToUserId: reply.userId })"
              :is-child="true"
              :comment="reply"
            />
          </li>
        </ul>
      </div>
    </div>
  </a-flex>
</template>

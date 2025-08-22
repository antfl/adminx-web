<script setup lang="ts">
import { SmileOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { fontIcons } from '@/components/CommentInput/fontIcons';
import clickOutside from '@/directives/clickOutside';
import { t } from '@/i18n';

const vClickOutside = clickOutside;

const text = ref('');

const emit = defineEmits<{
  (e: 'submit', payload: { text: string; done: () => void }): void;
  (e: 'closed'): void;
}>();

const isSubmit = ref(false);
const submit = () => {
  if (!text.value.trim()) {
    message.warn('评论不能为空');
    return;
  }
  isSubmit.value = true;
  emit('submit', {
    text: text.value,
    done: () => {
      text.value = '';
      isSubmit.value = false;
    },
  });
};

const insertIcon = (item: { icon: string }) => {
  text.value += item.icon;
};

const visibleIconSelector = ref(false);
const openChange = (visible: boolean) => {
  visibleIconSelector.value = visible;
};

const onClickOutside = () => {
  if (visibleIconSelector.value || text.value.trim()) return;
  emit('closed');
};
</script>

<template>
  <a-card
    v-click-outside="onClickOutside"
    class="hover:border-color-[var(--color-primary)] duration-300"
    :bodyStyle="{ padding: '8px' }"
  >
    <div class="mb-8px">
      <a-textarea
        :rows="5"
        show-count
        :maxlength="2000"
        class="rd-5px"
        v-model:value="text"
        :bordered="false"
        :placeholder="t('友好交流，理性讨论~')"
      >
      </a-textarea>
    </div>
    <div class="flex items-center justify-between">
      <div>
        <a-popover @openChange="openChange" placement="bottomLeft" trigger="click">
          <template #content>
            <a-row class="w-400px" :gutter="16">
              <a-col v-for="(item, index) in fontIcons" :key="index" :span="3">
                <div
                  @click="insertIcon(item)"
                  class="size-40px flex items-center justify-center rd-3px cursor-pointer font-size-26px border-1px border-solid border-color-transparent select-none duration-300 hover:bg-[var(--color-bg-container)] hover:border-color-[var(--color-border)]"
                >
                  {{ item.icon }}
                </div>
              </a-col>
            </a-row>
          </template>
          <SmileOutlined
            :class="visibleIconSelector ? 'color-[var(--color-primary)]!' : ''"
            class="font-size-20px hover:color-[var(--color-primary)]"
          />
        </a-popover>
      </div>
      <a-button ghost :loading="isSubmit" @click="submit" type="primary">{{ t('发送') }}</a-button>
    </div>
  </a-card>
</template>

<style scoped lang="less">
// 修改输入框的计数信息位置
.ant-input-textarea-show-count::after {
  position: absolute;
  right: 80px;
  bottom: -36px;
  z-index: 500;
}
</style>

<template>
  <div class="markdown-viewer-container">
    <div class="viewer-html" v-html="safeHtml"></div>
  </div>
</template>

<script lang="ts" setup>
import DOMPurify from 'dompurify';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
  features: {
    type: Object,
    default: () => ({
      toc: true, // 目录生成
      emoji: true, // emoji支持
      anchor: true, // 标题锚点
      sanitize: true, // XSS防护
    }),
  },
});

const SECURITY_CONFIG = {
  ALLOWED_TAGS: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'blockquote',
    'p',
    'a',
    'ul',
    'ol',
    'nl',
    'li',
    'b',
    'i',
    'strong',
    'em',
    'strike',
    'code',
    'hr',
    'br',
    'div',
    'table',
    'thead',
    'caption',
    'tbody',
    'tr',
    'th',
    'td',
    'pre',
    'span',
    'img',
  ],
  ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'target'],
};

// 初始化 Markdown-it
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动转换 URL 为链接
  typographer: true, // 优化排版
  breaks: true, // 转换 \n 为 <br>
});

const safeHtml = computed(() => {
  const rawHtml = md.render(props.content);
  return props.features.sanitize ? DOMPurify.sanitize(rawHtml, SECURITY_CONFIG) : rawHtml;
});
</script>

<style scoped lang="less">
.markdown-viewer-container {
  :deep(.viewer-html) {
    h1 {
      font-size: 32px;
    }

    h2 {
      margin-top: 1.5rem;
    }

    h4 {
      margin-top: 1.5rem;
    }

    blockquote {
      padding: 0 16px;
      margin: 32px 0;
      background-color: var(--color-border-secondary) !important;
      border-left: 3px solid var(--color-primary);
    }

    img {
      max-width: 100% !important;
      border-radius: var(--border-radius-outer);
    }

    p {
      line-height: 2.5rem;
      word-break: break-all;
    }
  }
}
</style>

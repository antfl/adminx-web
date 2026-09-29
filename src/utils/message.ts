import { MessagePlugin } from 'tdesign-vue-next';

type MessageContent = string | { content?: string; duration?: number };

const readContent = (content: MessageContent) =>
  typeof content === 'string' ? content : content.content || '';

export const message = {
  success(content: MessageContent) {
    return MessagePlugin.success(readContent(content));
  },
  error(content: MessageContent) {
    return MessagePlugin.error(readContent(content));
  },
  warn(content: MessageContent) {
    return MessagePlugin.warning(readContent(content));
  },
  warning(content: MessageContent) {
    return MessagePlugin.warning(readContent(content));
  },
  loading(content: MessageContent) {
    const duration = typeof content === 'string' ? 0 : (content.duration ?? 0) * 1000;
    const pending = MessagePlugin.loading({
      content: readContent(content),
      duration,
    });
    return () => MessagePlugin.close(pending);
  },
};

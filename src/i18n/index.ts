import { App, ref, readonly } from 'vue';
import { createI18n, type I18n, type Composer } from 'vue-i18n';

import { getLang, setLang, type SupportedLocale } from '@/utils/lang';

import deDE from './locales/de-DE.json';
import enUS from './locales/en-US.json';
import zhCN from './locales/zh-CN.json';

export type { SupportedLocale };

type TranslationDictionary = Record<string, string>;
type LocaleMessages = Record<SupportedLocale, TranslationDictionary>;

/** 语言状态 */
const currentLocale = ref<SupportedLocale>(getLang() || 'zh-CN');

if (typeof document !== 'undefined') {
  document.documentElement.lang = currentLocale.value;
}

export const localeList = [
  {
    value: 'zh-CN',
    label: '中文',
  },
  {
    value: 'en-US',
    label: 'English',
  },
  {
    value: 'de-DE',
    label: 'Deutsch',
  },
];

const hashToText = new Map<string, string>(Object.entries(zhCN));

/** 语言包以哈希为 key，运行时改成中文原文，这样 t('首页') 和 $t('首页') 都能命中。 */
const bindLocale = (pack: TranslationDictionary): TranslationDictionary => {
  const messages: TranslationDictionary = {};
  hashToText.forEach((source, hash) => {
    messages[source] = pack[hash] || source;
  });
  return messages;
};

const messages: LocaleMessages = {
  'zh-CN': bindLocale(zhCN),
  'en-US': bindLocale(enUS),
  'de-DE': bindLocale(deDE),
};

/** 创建 i18n 实例。语言包的 key 是中文原文的哈希，由 i18next-scanner 写入。 */
export const i18n: I18n = createI18n({
  legacy: false,
  locale: currentLocale.value,
  fallbackLocale: 'zh-CN',
  messages,
  missingWarn: false,
  fallbackWarn: false,
});

const globalI18n = i18n.global as unknown as Composer;

const HASH_KEY = /^[A-Z0-9]{12}$/;

export const t = (input: string): string => {
  if (!input) return input;
  const source = HASH_KEY.test(input) ? hashToText.get(input) || input : input;
  const result = globalI18n.t(source);
  return result || source;
};

/** 设置语言 */
export function setLocale(lang: SupportedLocale) {
  setLang(lang);
  currentLocale.value = lang;
  globalI18n.locale.value = lang;
  document.documentElement.lang = lang;
  window.location.reload();
}

/** 当前语言状态 */
export const currentLanguage = readonly(currentLocale);

/** 安装 i18n */
export function setupI18n(app: App) {
  app.use(i18n);
}

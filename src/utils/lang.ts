export type SupportedLocale = 'zh-CN' | 'en-US' | 'de-DE';

const supportedLocales = new Set<string>(['zh-CN', 'en-US', 'de-DE']);

export const getLang = (): SupportedLocale | null => {
  const lang = localStorage.getItem('lang');
  return lang && supportedLocales.has(lang) ? (lang as SupportedLocale) : null;
};

export const setLang = (lang: SupportedLocale) => {
  localStorage.setItem('lang', lang);
};

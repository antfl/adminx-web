import { generateNonce } from '@/utils';

const QQ_APP_ID = import.meta.env.VITE_QQ_APP_ID;
const QQ_REDIRECT_URI = encodeURIComponent(import.meta.env.VITE_QQ_REDIRECT_URI);

/**
 * QQ 登录页面
 */
export const qqLoginURL = () => {
  const state = generateNonce();
  return `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${QQ_APP_ID}&redirect_uri=${QQ_REDIRECT_URI}&state=${state}`;
};

/**
 * 解析 QQ 登录回调地址中的参数
 */
export const extractParams = () => {
  const currentUrl = window.location.href;

  try {
    // 解析主 URL 获取 redirect 参数
    const mainUrl = new URL(currentUrl);
    const redirectValue = mainUrl.searchParams.get('redirect');
    if (!redirectValue) return null;

    // 解码 redirect 参数中的特殊字符
    const decodedRedirect = decodeURIComponent(redirectValue);

    // 从解码后的字符串中提取查询参数部分
    const queryString = decodedRedirect.split('?')[1];
    if (!queryString) return null;

    // 解析查询参数
    const params = new URLSearchParams(queryString);
    return {
      code: params.get('code'),
    };
  } catch {
    return null;
  }
};

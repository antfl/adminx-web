import { generateNonce } from '@/utils';
import { useRoute } from 'vue-router';

const QQ_APP_ID = import.meta.env.VITE_QQ_APP_ID;
const QQ_REDIRECT_URI = encodeURIComponent(import.meta.env.VITE_QQ_REDIRECT_URI);

/**
 * QQ 登录页面
 */
export const qqLoginURL = () => {
  const route = useRoute();
  const redirect = route.query.redirect as string;
  const state = generateNonce();
  return `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${QQ_APP_ID}&redirect_uri=${QQ_REDIRECT_URI}&redirect_path=${redirect}&state=${state}`;
};

/**
 * 解析 QQ 登录回调地址中的参数
 */
export const extractParams = (url: string) => {
  // 解析主 URL 获取 redirect 参数
  const mainUrl = new URL(url);
  const redirectValue = mainUrl.searchParams.get('redirect');
  if (!redirectValue) return null;

  try {
    // 解码 redirect 参数中的特殊字符
    const decodedRedirect = decodeURIComponent(redirectValue);

    // 从解码后的字符串中提取查询参数部分
    const queryString = decodedRedirect.split('?')[1];
    if (!queryString) return null;

    // 解析查询参数
    const params = new URLSearchParams(queryString);
    return {
      code: params.get('code'),
      redirect: params.get('redirect_path'),
    };
  } catch {
    return null;
  }
};

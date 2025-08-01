import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_API_SECRET;

export const generateSignature = (
  urlParams: Record<string, any> = {},
  bodyParams: Record<string, any> = {},
  timestamp: number,
  nonce: string,
): string => {
  // 合并所有参数
  const allParams = { ...urlParams, ...bodyParams };

  // 处理值并排序
  const sortedEntries = Object.entries(allParams)
    .map(([key, value]) => [key, normalizeValue(value)])
    .sort((a, b) => (a[0] as string).localeCompare(b[0] as string));

  // 构建参数字符串
  const paramStr = sortedEntries.map(([key, value]) => `${key}=${value}`).join('&');

  // 拼接基础数据
  const parts = [];
  if (paramStr) parts.push(paramStr);
  parts.push(`timestamp=${timestamp}`, `nonce=${nonce}`);
  const rawData = parts.join('&');

  // 生成签名
  return CryptoJS.HmacSHA256(rawData, SECRET_KEY).toString(CryptoJS.enc.Hex);
};

// 值规范化函数
const normalizeValue = (value: any): string => {
  if (value == null) return '';

  if (Array.isArray(value)) {
    return value.map((item) => (item != null ? item.toString() : '')).join(',');
  }

  return value.toString();
};

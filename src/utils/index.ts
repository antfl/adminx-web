export const getLessVar = (name: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

/**
 * 生成随机 nonce (16 字节)
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

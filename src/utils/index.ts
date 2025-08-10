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

/**
 * 根据当前时间返回合适的问候语
 */
export const getTimeGreeting = () => {
  const hour = new Date().getHours(); // 获取当前小时 (0-23)

  if (hour >= 0 && hour < 5) {
    return '凌晨好，请注意休息！'; // 0:00 - 4:59
  } else if (hour >= 5 && hour < 8) {
    return '早上好！'; // 5:00 - 7:59
  } else if (hour >= 8 && hour < 12) {
    return '上午好！'; // 8:00 - 11:59
  } else if (hour >= 12 && hour < 14) {
    return '中午好！'; // 12:00 - 13:59
  } else if (hour >= 14 && hour < 18) {
    return '下午好！'; // 14:00 - 17:59
  } else {
    return '晚上好！'; // 18:00 - 23:59
  }
};

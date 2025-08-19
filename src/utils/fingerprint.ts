import CryptoJS from 'crypto-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { generateNonce } from '@/utils/index';

const SESSION_FINGERPRINT = 'device_fingerprint';
const SECRET_KEY = import.meta.env.VITE_API_SECRET;

/**
 * 设备指纹生成
 */
export const initDeviceFingerprint = async () => {
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  const fingerprint = {
    visitorId: result.visitorId,
    confidence: result.confidence.score,
    timestamp: Date.now(),
    nonce: generateNonce(),
    signature: '',
  };

  // 生成数字签名
  fingerprint.signature = generateSignature(fingerprint);
  localStorage.setItem(SESSION_FINGERPRINT, JSON.stringify(fingerprint));
};

/**
 * 获取设备指纹
 */
export const getFingerprint = (): string => {
  const stored = localStorage.getItem(SESSION_FINGERPRINT);
  if (!stored) {
    return '';
  }

  // 更新时间戳和签名
  const parsed = JSON.parse(stored);
  parsed.timestamp = Date.now();
  parsed.nonce = generateNonce();
  parsed.signature = generateSignature(parsed);

  // 更新本地存储
  localStorage.setItem(SESSION_FINGERPRINT, JSON.stringify(parsed));

  return Object.values(parsed).join('/');
};

// 生成 HMAC-SHA256 签名
const generateSignature = (data: Record<string, unknown>): string => {
  const payload = `${data.visitorId}|${data.timestamp}|${data.nonce}`;
  return CryptoJS.HmacSHA256(payload, SECRET_KEY).toString();
};

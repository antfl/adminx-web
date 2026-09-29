export interface ResponseData<T = unknown> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

/** 开发环境开启后，登录页预填账号 */
export const isMockLogin = import.meta.env.VITE_MOCK_LOGIN === 'true';

const ok = <T>(data: T): ResponseData<T> => ({
  code: 200,
  message: 'success',
  data,
  timestamp: Date.now(),
});

export const mockLoginResult = () =>
  ok({
    token: 'mock-token',
  });

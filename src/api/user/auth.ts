import { mockLoginResult, type ResponseData } from '@/mocks/auth';

export interface UserLogin {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

/** 模拟登录 */
export const userLogin = (_data: UserLogin): Promise<ResponseData<LoginResponse>> => {
  return Promise.resolve(mockLoginResult());
};

import request, { ResponseData } from '@/utils/request';

export interface UserLogin {
  username: string;
  password: string;
  captchaId: string;
  code: string;
}

export interface UserRegister extends Omit<UserLogin, 'username'> {
  email: string;
  nickname: string;
}

export interface UserPasswordReset extends Omit<UserLogin, 'username'> {
  email: string;
  confirmPassword: string;
}

export interface LoginResponse {
  token: string;
}

/** 用户注册 */
export const userRegister = (data: UserRegister) => {
  return request.post('/auth/register', data);
};

/** 账号登录 */
export const userLogin = (data: UserLogin): Promise<ResponseData<LoginResponse>> => {
  return request.post<LoginResponse>('/auth/login', data, { withToken: false });
};

/** QQ 登录 */
export const qqUserLogin = (code: string): Promise<ResponseData<LoginResponse>> => {
  return request.post<LoginResponse>('/auth/qq', { code }, { withToken: false });
};

/** 重置密码 */
export const passwordReset = (data: UserPasswordReset) => {
  return request.post('/auth/passwordReset', data);
};

/** 获取图片验证码 */
export const captcha = (): Promise<
  ResponseData<{ captchaId: string; captchaImageBase64: string }>
> => {
  return request.get('/auth/captcha');
};

/** 获取邮箱验证码 */
export const sendMailCode = (
  email: string,
  type: string,
): Promise<ResponseData<{ captchaId: string }>> => {
  return request.get(`auth/sendMailCode/${email}/${type}`);
};

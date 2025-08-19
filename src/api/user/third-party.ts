import request, { ResponseData } from '@/utils/request';

export enum ThirdPartyProvider {
  /**
   * Github 登录
   */
  GITHUB = 'GITHUB',

  /**
   * 微信登录
   */
  WECHAT = 'WECHAT',

  /**
   * QQ 登录
   */
  QQ = 'QQ',
}

export enum CallbackType {
  /**
   * 登录
   */
  LOGIN = 'LOGIN',

  /**
   * 绑定
   */
  BIND = 'BIND',
}

export interface BindingInfo {
  id: number;
  provider: string;
  bindTime: string;
  nickname: string;
  avatar: string;
}

export interface BindingRequest {
  provider: string;
  authCode: string;
}

export const bind = (data: BindingRequest): Promise<ResponseData> => {
  return request.post('/third-party/bind', data);
};

export const bindList = (): Promise<ResponseData<BindingInfo[]>> => {
  return request.get('/third-party/bindList');
};

/**
 * 因为 Github 不能设置多个回调地址，单独提供一个方法根据回调地址参数，判断是否为绑定
 */
export const isBindGithub = (path: string) => {
  return path.includes(`CallbackType=${CallbackType.BIND}`);
};

/**
 * GitHub 登录跳转地址
 */
export const GithubRedirectURL = (type: CallbackType) => {
  // 因为 Github 不能设置多个回调地址，所以通过 CallbackType 的值，在路由回调中判断，然后重定向到个人中心页面
  const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const GITHUB_REDIRECT_URI = encodeURIComponent(
    `${import.meta.env.VITE_GITHUB_REDIRECT_URI}?provider=${ThirdPartyProvider.GITHUB}&CallbackType=${type}`,
  );
  return `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}&scope=user:email`;
};

/**
 * QQ 登录跳转地址
 */
export const QQRedirectURL = (type: CallbackType) => {
  const QQ_APP_ID = import.meta.env.VITE_QQ_APP_ID;
  const QQ_REDIRECT_URI = encodeURIComponent(
    `${
      type === CallbackType.LOGIN
        ? import.meta.env.VITE_QQ_REDIRECT_URI
        : import.meta.env.VITE_QQ_REDIRECT_PROFILE_URI
    }?provider=${ThirdPartyProvider.QQ}`,
  );
  return `https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=${QQ_APP_ID}&redirect_uri=${QQ_REDIRECT_URI}`;
};

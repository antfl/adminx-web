import { message } from 'ant-design-vue';
import { v4 as uuidV4 } from 'uuid';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  CancelTokenSource,
} from 'axios';

import { useAuth } from '@/hooks';
import { useUserStore } from '@/store';

export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}
/** 请求KEY生成规则类型 */
export type TRequestKeyRules =
  | 'uuid'
  | 'default'
  | 'method:url:params'
  | 'method:url:data'
  | 'method:url';

export interface RequestConfig extends AxiosRequestConfig {
  // 是否显示全局错误提示
  showError?: boolean;
  // 是否携带 token
  withToken?: boolean;
  // 是否取消重复请求
  preventDuplicate?: boolean;
  // 自定义错误处理
  customErrorHandler?: (error: AxiosError) => void;
  /** 请求KEY生成规则 */
  requestKeyRules?: TRequestKeyRules;
  /** 限制时间 */
  limitTime?: number;
  /** 限制类型(默认为Throttle) */
  limitType?: 'Throttle' | 'Debounce';
  /** 限制请求提示内容 */
  limitMessage?: string;
}

// 请求取消控制器映射
const cancelTokenMap = new Map<string, CancelTokenSource>();
/** 请求限制队列 */
const limitQueue = new Map<string, number | NodeJS.Timeout>();

class Request {
  private instance: AxiosInstance;
  private baseConfig: RequestConfig = {
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    showError: true,
    withToken: true,
    preventDuplicate: false,
    limitType: 'Throttle',
    limitMessage: '请求已限制，请稍后再试!!!',
  };

  constructor(config?: RequestConfig) {
    // 合并配置
    this.instance = axios.create(Object.assign({}, this.baseConfig, config));

    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => this.requestInterceptor(config),
      (error: AxiosError) => this.requestErrorInterceptor(error),
    );

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => this.responseInterceptor(response),
      (error: AxiosError) => this.responseErrorInterceptor(error),
    );
  }

  /**
   * 请求拦截器
   * - 添加认证 Token
   * - 处理重复请求
   */
  private requestInterceptor(
    config: InternalAxiosRequestConfig,
  ): InternalAxiosRequestConfig | Promise<never> {
    const requestConfig = config as RequestConfig;

    // 处理限制请求
    if (typeof requestConfig.limitTime === 'number') {
      const limit = this.requestLimit(config);
      if (limit) return limit;
    }

    // 添加认证 Token
    if (requestConfig.withToken !== false) {
      const userStore = useUserStore();
      const token = userStore.token;
      if (token) {
        config.headers!['Authorization'] = `Bearer ${token}`;
      }
    }

    // 处理重复请求
    if (requestConfig.preventDuplicate) {
      const requestKey = this.generateRequestKey(config);

      // 如果存在相同请求，则取消前一个
      if (cancelTokenMap.has(requestKey)) {
        const source = cancelTokenMap.get(requestKey)!;
        source.cancel('重复请求被取消');
      }

      // 创建新的取消令牌
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;
      cancelTokenMap.set(requestKey, source);
    }

    return config;
  }

  /**
   * 限制请求
   * @param config 请求配置
   */
  private requestLimit(config: InternalAxiosRequestConfig) {
    const requestConfig = config as RequestConfig;
    const requestKey = this.generateRequestKey(requestConfig);
    const oldLimitToken = limitQueue.get(requestKey);
    const newLimitToken = setTimeout(() => {
      limitQueue.delete(requestKey);
      cancelTokenMap.delete(requestKey);
    }, requestConfig.limitTime);
    if (requestConfig.limitType === 'Debounce') {
      clearTimeout(oldLimitToken || 0);
      limitQueue.set(requestKey, newLimitToken);
    }
    if (requestConfig.limitType === 'Throttle' && !oldLimitToken) {
      limitQueue.set(requestKey, newLimitToken);
    }
    if (oldLimitToken) {
      const errorMessage = requestConfig.limitMessage;
      if (requestConfig?.showError !== false) {
        message.error({
          content: errorMessage,
          style: {
            userSelect: 'none',
          },
        });
      }
      return Promise.reject(
        new AxiosError(
          errorMessage,
          (-3).toString(),
          requestConfig as InternalAxiosRequestConfig<any>,
        ),
      );
    }
    return null;
  }
  /**
   * 请求错误拦截器
   */
  private requestErrorInterceptor(error: AxiosError): Promise<AxiosError> {
    return Promise.reject(error);
  }

  /**
   * 响应拦截器
   * - 统一处理响应数据
   * - 处理业务状态码
   */
  private responseInterceptor(response: AxiosResponse): AxiosResponse | Promise<never> {
    const config = response.config as RequestConfig;
    const requestKey = this.generateRequestKey(config);

    // 请求完成后移除取消令牌
    if (config.preventDuplicate && cancelTokenMap.has(requestKey)) {
      cancelTokenMap.delete(requestKey);
    }

    const data = response.data as ResponseData;

    // 处理业务错误
    if (data.code && data.code !== 200) {
      return this.handleBusinessError(data, config);
    }

    return response;
  }

  /**
   * 响应错误拦截器
   * - 统一处理 HTTP 错误
   * - 处理网络错误
   */
  private async responseErrorInterceptor(error: AxiosError): Promise<ResponseData> {
    const config = error.config as RequestConfig | undefined;
    const requestKey = config ? this.generateRequestKey(config) : '';

    // 请求完成后移除取消令牌
    if (config?.preventDuplicate && requestKey && cancelTokenMap.has(requestKey)) {
      cancelTokenMap.delete(requestKey);
    }
    // 处理限制请求的错误
    if (error.code === '-3') {
      if (config?.customErrorHandler) {
        config.customErrorHandler(error);
      }
      return Promise.reject({
        code: +error.code,
        message: error.message,
        data: null,
      });
    }

    await this.handleHttpError(error);

    // 处理取消的请求
    if (axios.isCancel(error)) {
      return Promise.reject({
        code: -1,
        message: '请求已取消',
        data: null,
      });
    }

    // 其他错误
    return this.handleUnknownError(error, config);
  }

  /**
   * 处理业务错误
   */
  private async handleBusinessError(data: ResponseData, config?: RequestConfig): Promise<never> {
    // 特殊状态码处理
    switch (data.code) {
      case 401: // 未授权
        return this.handleUnauthorizedError(data);
      case 403: // 禁止访问
        return this.handleForbiddenError(data);
      case 500: // 服务器错误
        return this.handleServerError(data);
      default:
        break;
    }

    // 显示错误消息
    if (config?.showError !== false) {
      message.error(data.message || '业务错误');
    }

    // 调用自定义错误处理
    if (config?.customErrorHandler) {
      config.customErrorHandler(new AxiosError(data.message, data.code.toString()));
    }

    return Promise.reject(data);
  }

  /**
   * 处理 HTTP 错误
   */
  private async handleHttpError(error: AxiosError, config?: RequestConfig): Promise<never> {
    const status = error.response?.status;
    let errorMessage = '请求错误';

    switch (status) {
      case 400:
        errorMessage = '请求参数错误';
        break;
      case 401:
        return this.handleUnauthorizedError();
      case 403:
        return this.handleForbiddenError();
      case 404:
        errorMessage = '请求资源不存在';
        break;
      case 405:
        errorMessage = '请求方法不被允许';
        break;
      case 408:
        errorMessage = '请求超时';
        break;
      case 500:
        errorMessage = '服务器内部错误';
        break;
      case 501:
        errorMessage = '服务未实现';
        break;
      case 502:
        errorMessage = '网关错误';
        break;
      case 503:
        errorMessage = '服务不可用';
        break;
      case 504:
        errorMessage = '网关超时';
        break;
      default:
        errorMessage = `连接错误 ${status}`;
    }

    // 显示错误消息
    if (config?.showError !== false) {
      message.error(errorMessage);
    }

    // 调用自定义错误处理
    if (config?.customErrorHandler) {
      config.customErrorHandler(error);
    }

    return Promise.reject({
      code: status,
      message: errorMessage,
      data: error.response?.data,
    });
  }

  /**
   * 处理网络错误
   */
  private async handleNetworkError(error: AxiosError, config?: RequestConfig): Promise<never> {
    const errorMessage = error.message.includes('timeout') ? '网络请求超时' : '网络连接异常';

    // 显示错误消息
    if (config?.showError !== false) {
      message.error(errorMessage);
    }

    // 调用自定义错误处理
    if (config?.customErrorHandler) {
      config.customErrorHandler(error);
    }

    return Promise.reject({
      code: -1,
      message: errorMessage,
      data: null,
    });
  }

  /**
   * 处理未知错误
   */
  private async handleUnknownError(error: AxiosError, config?: RequestConfig): Promise<never> {
    const errorMessage = '未知错误';
    // 显示错误消息
    if (config?.showError !== false) {
      message.error(errorMessage);
    }

    // 调用自定义错误处理
    if (config?.customErrorHandler) {
      config.customErrorHandler(error);
    }

    return Promise.reject({
      code: -2,
      message: errorMessage,
      data: null,
    });
  }

  /**
   * 处理未授权错误 (401)
   */
  private async handleUnauthorizedError(data?: ResponseData): Promise<never> {
    const auth = useAuth();

    // 退出登录
    await auth.signOut();
    return Promise.reject({
      code: 401,
      message: data?.message || '登录已过期，请重新登录',
      data: null,
    });
  }

  /**
   * 处理禁止访问错误 (403)
   */
  private async handleForbiddenError(data?: ResponseData): Promise<never> {
    message.error(data?.message || '没有权限访问此资源');

    return Promise.reject({
      code: 403,
      message: data?.message || '禁止访问',
      data: null,
    });
  }

  /**
   * 处理服务器错误 (500)
   */
  private async handleServerError(data: ResponseData): Promise<never> {
    message.error(data.message || '服务器内部错误');

    return Promise.reject({
      code: 500,
      message: data.message || '服务器错误',
      data: null,
    });
  }

  /**
   * 生成请求唯一键
   */
  // private generateRequestKey(config: AxiosRequestConfig): string {
  //   return `${config.method}-${config.url}-${JSON.stringify(config.params)}-${JSON.stringify(config.data)}`;
  // }
  private generateRequestKey(config: AxiosRequestConfig): string {
    const rule = (config as RequestConfig).requestKeyRules ?? 'default';
    if (rule === 'uuid') return uuidV4();
    const { url, method, params, data } = config;
    const _JSON = (d: any) => (d ? JSON.stringify(d) : 'null');
    switch (rule) {
      case 'method:url:params':
        return `${method}-${url}-${_JSON(params)}`;
      case 'method:url:data':
        return `${method}-${url}-${_JSON(data)}`;
      case 'method:url':
        return `${method}-${url}`;
      default:
        return `${method}-${url}-${_JSON(params)}-${_JSON(data)}`;
    }
  }

  /**
   * 取消所有正在进行的请求
   */
  public cancelAllRequests(): void {
    cancelTokenMap.forEach((source) => {
      source.cancel('所有请求已被取消');
    });
    cancelTokenMap.clear();
  }

  /**
   * 取消特定请求
   */
  public cancelRequest(key: string): void {
    if (cancelTokenMap.has(key)) {
      const source = cancelTokenMap.get(key)!;
      source.cancel('请求已被取消');
      cancelTokenMap.delete(key);
    }
  }

  /**
   * 通用请求方法
   */
  public async request<T = any>(config: RequestConfig): Promise<ResponseData<T>> {
    try {
      const response = await this.instance.request<ResponseData<T>>(config);
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * GET 请求
   */
  public get<T = any>(url: string, params?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config,
    });
  }

  /**
   * POST 请求
   */
  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config,
    });
  }

  /**
   * PUT 请求
   */
  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config,
    });
  }

  /**
   * DELETE 请求
   */
  public delete<T = any>(
    url: string,
    params?: any,
    config?: RequestConfig,
  ): Promise<ResponseData<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      params,
      ...config,
    });
  }

  /**
   * PATCH 请求
   */
  public patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...config,
    });
  }

  /**
   * 文件上传
   */
  public upload<T = any>(
    url: string,
    file: File,
    fieldName = 'file',
    config?: RequestConfig,
  ): Promise<ResponseData<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    return this.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
  }
}

/** 创建请求实例 */
const http = new Request({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default http;

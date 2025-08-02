import { PageParams, PageResult } from '@/types/global';
import request, { ResponseData } from '@/utils/request';
import { Menu } from '@/types/meun';

export interface User {
  userId: number;
  deptId: number;
  username: string;
  nickname: string;
  avatar: string;
  gender: number;
}

export interface RecentUser {
  nickname: string;
  avatar: string;
}

export interface ActiveUser {
  nickname: string;
  avatar: string;
  operationCount: number;
}

export interface PermissionData {
  menus: Menu[];
  permissions: string[];
}

export interface UpdateUser extends Omit<User, 'deptId'> {
  roleIds?: number[];
}

export const userPage = (data: PageParams): Promise<ResponseData<PageResult<User>>> => {
  return request.get('/user/page', data);
};

export const userInfo = (): Promise<ResponseData<User>> => {
  return request.get('/user/getUserInfo');
};

export const fetchPermissions = (): Promise<ResponseData<PermissionData>> => {
  return request.get('/user/permissions');
};

export const updateUser = (data: UpdateUser) => {
  return request.post('/user/updateUser', data);
};

export const userRecent = (): Promise<ResponseData<RecentUser[]>> => {
  return request.get('/user/recent');
};

export const userActive = (): Promise<ResponseData<ActiveUser[]>> => {
  return request.get('/user/active');
};

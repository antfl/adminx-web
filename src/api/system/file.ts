import request, { ResponseData } from '@/utils/request';

export const viewFile = (token: string) => {
  return `${import.meta.env.VITE_API_BASE_URL}/files/view/${token}`;
};

export const getFileToken = (fileId: string): Promise<ResponseData<string>> => {
  return request.get(`/files/getFileToken/${fileId}`);
};

import { PageParams, PageResult } from '@/types/global';
import request, { ResponseData } from '@/utils/request';

/**
 * 文章互动类型
 */
export enum InteractionType {
  /** like: 点赞 */
  LIKE = 'like',
  /** favorite: 收藏 */
  FAVORITE = 'favorite',
}

export interface Article {
  articleId: number;
  title: string;
  content: string;
  categoryId: string;
  categoryName: string;
  nickname: string;
  avatar: string;
  createUser: number | string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  createTime: string;
  isLiked: boolean;
  isFavorite: boolean;
}

export interface ArticleCategory {
  categoryId: number;
  categoryName: string;
  remark: string;
}

export const saveArticle = (data: Article) => {
  return request.post('/article/save', data);
};

export const articlePage = (
  data: PageParams & { title: string },
): Promise<ResponseData<PageResult<Article>>> => {
  return request.get('/article/page', data);
};

export const delArticle = (id: number) => {
  return request.delete(`/article/del/${id}`);
};

export const detailArticle = (id: string): Promise<ResponseData<Article>> => {
  return request.get(`/article/${id}`);
};

export const saveArticleCategory = (data: ArticleCategory) => {
  return request.post('/article/category/saveUpdate', data);
};

export const articleCategoryPage = (
  data: PageParams & { categoryName: string },
): Promise<ResponseData<PageResult<ArticleCategory>>> => {
  return request.get('/article/category/page', data);
};

export const delArticleCategory = (id: number) => {
  return request.delete(`/article/category/del/${id}`);
};

export const listCategory = (): Promise<ResponseData<ArticleCategory[]>> => {
  return request.get('/article/category/list');
};

export const toggleInteraction = (data: {
  articleId: number;
  type: string;
}): Promise<ResponseData<string>> => {
  return request.post('/interaction/toggle', data);
};

import { RouteRecordRaw } from 'vue-router';

export type RouteRaw = Omit<RouteRecordRaw, 'children'> & {
  children?: FilteredRoute[] | null;
  meta?: {
    hidden?: boolean;
  };
};

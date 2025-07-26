import { RouteRaw } from '@/types/router';

export const filterRoutes = (routes: RouteRaw[]) => {
  return routes.reduce((pre: RouteRaw[], cur: RouteRaw) => {
    if (!cur.meta?.hidden) {
      if (Array.isArray(cur.children) && cur.children.length > 0) {
        cur.children = filterRoutes(cur.children);
      } else {
        cur.children = null;
      }
      pre.push(cur);
    }
    return pre;
  }, []);
};

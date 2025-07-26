/** 菜单 */
export interface Menu {
  id?: number;
  parentId?: number;
  name: string;
  title: string;
  titleZh: string;
  titleEn: string;
  path: string;
  component: string;
  icon?: string;
  cache?: boolean;
  hidden?: boolean;
  redirect?: string;
  menuType: number;
  permission: string;
  sortOrder: number;
  status?: number;
  children: Menu[];
}

interface MenuTab {
  path: string;
  title: string;
  closable: boolean;
  icon: any;
}

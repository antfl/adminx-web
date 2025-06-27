import type { FormElemType } from '@/components/Schema/enums';

export type PropFunction<T> = T | ((params?: Record<string, any>) => T | any);

export interface ItemProps {
  /** 字段组件子组件属性 */
  optionProps?: Record<string, any>;
  /** 输入框头部内容，只对非 type="textarea" 有效 */
  suffixSlot?: string;
  /** 输入框尾部内容，只对非 type="textarea" 有效 */
  prefixSlot?: string;
  /** 输入框前置内容，只对非 type="textarea" 有效 */
  prependSlot?: string;
  /** 输入框后置内容，只对非 type="textarea" 有效 */
  appendSlot?: string;
  /** 下拉列表顶部的内容 */
  headerSlot?: string;
  /** 下拉列表底部的内容 */
  footerSlot?: string;
  /** 无选项时的列表 */
  emptySlot?: string;
  /** SELECT 组件自定义标签内容 */
  tagSlot?: string;
  /** SELECT 组件自定义 loading 内容 */
  loadingSlot?: string;
  /** SELECT 组件自定义标签内容 */
  labelSlot?: string;
  /** 自定义输入框按钮减少图标 */
  decreaseIconSlot?: string;
  /** 自定义输入框按钮增加图标 */
  increaseIconSlot?: string;
  /** 自定义 active 行为 */
  activeActionSlot?: string;
  /** 自定义 inactive 行为 */
  inactiveActionSlot?: string;
}

export interface FormItemChangeParams {
  loadOptions: (targetField: string, params?: Record<string, any>) => any;
  getInstanceByField: (targetField: string) => any;
  getPropsByField: (targetField: string) => FormItemConfig | undefined;
  formData: Record<string, any>;
  instance: any;

  [key: string]: any;
}

export interface FormItemConfig {
  name: string; // 字段名
  label?: string; // 字段描述
  component?: PropFunction<FormElemType | string>; // 字段组件
  mode?: PropFunction<string>; // 组件展示模式
  visible?: PropFunction<boolean>; // 组件隐藏
  rules?: PropFunction<any>; // 字段校验（优先级最高）
  required?: PropFunction<boolean>; // 字段必填（简要必填配置方式）
  options?: PropFunction<Record<string, any>[]>; // 所有选项类型组件的选项数据
  remoteOptions?: PropFunction<Promise<Record<string, any>[]>>; // 所有选项类型组件的远程选项数据
  valueKey?: string; // 选项值字段
  labelKey?: string; // 选项描述字段
  slot?: string; // 字段插槽（插槽在 el-form-item 组件里面）
  column?: Record<string, any>; // 字段布局（el-col）
  customSlot?: string; // 字段自定义插槽（插槽脱离 el-form-item 组件）
  viewSlot?: string; // VIEW 模式的插槽
  labelSlot?: string; // 字段描述插槽
  errorSlot?: string; // 字段错误提示插槽
  formItemProps?: Record<string, any>; // 字段组件父组件配置（ el-form-item）
  props?: Record<string, any>; // 字段组件配置
  itemProps?: ItemProps; // 字段组件配置子组件配置（比如下拉选择的 el-option、el-radio、el-checkbox 属性、插槽以及其他组件（el-input）的插槽）
  change?: (data: FormItemChangeParams) => void; // 字段值改变时触发
  format?: (data: any) => any; // 仅在 VIEW 模式下格式化展示的文本
  emptyText?: string; // VIEW 模式下为 undefined、null 时展示的默认文本
}

export interface FormItemProps extends FormItemConfig {
  formData: Record<string, any>; // 整个表单数据
  scope?: Record<string, any>; // 当前列数据
}

export interface FormConfig {
  trigger?: 'blur' | 'change';
  rules?: Record<string, any>; // 表单校验规则（优先级小于字段属性定义）
  layout?: Record<string, any>; // 表单布局配置（基于 ElRow & ElCol 组件实现）
  props?: Record<string, any>; // 表单属性用于 ElForm 组件
  emptyText?: string; // VIEW 模式下空值展示的文本（优先级小于字段属性定义）
}

export interface TableConfig {
  emptyText?: string; // 空值展示的文本（优先级小于列配置定义）
  formProps?: Record<string, any>;
  tableProps?: Record<string, any>;
  defaultSlot?: string;
  appendSlot?: string;
  emptySlot?: string;
}

export interface CellChangeParams {
  loadOptions: (event: {
    targetField: string;
    index?: number;
    params?: Record<string, any>;
  }) => any;
  getInstanceByField: (event: { targetField: string; index?: number }) => any;
  getPropsByField: (targetField: string) => ColumnItem | undefined;
  formData: Record<string, any>;
  instance: any;

  [key: string]: any;
}

export interface ColumnItem {
  name?: string; // 列字段名
  dataIndex: string; // 列字段名
  label?: string; // 列字段描述
  width?: string | number; // 列宽
  rules?: PropFunction<any>; // 字段校验（优先级最高）
  customSlot?: string; // 字段自定义插槽（插槽脱离 el-form-item 组件）
  slot?: string; // 字段插槽（插槽在 el-form-item 组件里面）
  props?: Record<string, any>; // el-table-column 配置
  formItemProps?: Record<string, any>; // 字段组件父组件配置（ el-form-item）
  component?: PropFunction<FormElemType | string | false>; // 单元格表单组件（如果返回 false 则不使用表单组件）
  format?: PropFunction<any>; // 格式化单元格的值
  change?: (data: CellChangeParams) => void; // 字段值改变时触发
  options?: PropFunction<Record<string, any>[]>; // 所有选项类型组件的选项数据
  remoteOptions?: PropFunction<Promise<Record<string, any>[]>>; // 所有选项类型组件的远程选项数据
  valueKey?: string; // 选项值字段
  labelKey?: string; // 选项描述字段
  required?: PropFunction<boolean>; // 字段必填（简要必填配置方式）
  emptyText?: string; // 为 undefined、null 时展示的默认文本
}

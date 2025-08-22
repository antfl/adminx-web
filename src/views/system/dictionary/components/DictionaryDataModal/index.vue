<script setup lang="ts">
import { PlusOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

import { Dict, deleteDictData, dictDataPage, DictItem } from '@/api/system/dictionary';
import ConfirmButton from '@/components/ConfirmButton/index.vue';
import { t } from '@/i18n';

import DictionaryDataFormModal from '../DictionaryDataFormModal/index.vue';

import type { TablePaginationConfig } from 'ant-design-vue';

const formRef = ref();
const visible = ref(false);
const modalTile = ref('');
let rowData: Dict;
const showModal = ({ row }: { row: Dict }) => {
  rowData = row;
  modalTile.value = t('字典数据');
  getDataSource();
  visible.value = true;
};

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条记录`,
});

const dataSource = ref<DictItem[]>([]);

const isLoading = ref(false);
const getDataSource = async () => {
  isLoading.value = true;
  const res = await dictDataPage({
    size: pagination.pageSize as number,
    current: pagination.current as number,
    itemLabel: formData.value.itemLabel,
    dictId: rowData.id,
  });
  dataSource.value = res.data.records;
  pagination.total = res.data.total;
  isLoading.value = false;
};

const columns = [
  {
    title: '名称',
    dataIndex: 'itemLabel',
    key: 'itemLabel',
  },
  {
    width: 100,
    title: '编码',
    dataIndex: 'itemValue',
    key: 'itemValue',
  },
  {
    width: 100,
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    customRender: ({ text }: { text: number }) => (text === 1 ? '启用' : '禁用'),
  },
  {
    width: 100,
    title: '顺序',
    dataIndex: 'sort',
    key: 'sort',
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
  },
];

const formData = ref<DictItem>({} as DictItem);

const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current;
  getDataSource();
};

const handleReset = () => {
  pagination.current = 1;
  formRef.value.resetFields();
  getDataSource();
};

const handleSearch = () => {
  pagination.current = 1;
  getDataSource();
};

const dictionaryDataFormModalRef = ref();
const handleAdd = () => {
  dictionaryDataFormModalRef.value.showModal({
    dictId: rowData.id,
    onSuccess: () => {
      getDataSource();
    },
  });
};

const editDictData = (row: DictItem) => {
  dictionaryDataFormModalRef.value.showModal({
    row,
    dictId: rowData.id,
    onSuccess: () => {
      getDataSource();
    },
  });
};

const delDictData = async (id: number) => {
  await deleteDictData(id);
  message.success('操作成功');
  await getDataSource();
};

defineExpose({
  showModal,
});
</script>

<template>
  <a-drawer v-model:open="visible" width="700px" :title="modalTile">
    <div class="mb-16px flex justify-between">
      <a-form ref="formRef" layout="inline" :model="formData">
        <a-form-item :label="t('字典名称')" name="itemLabel">
          <a-input :placeholder="t('请输入')" v-model:value="formData.itemLabel"></a-input>
        </a-form-item>
        <a-form-item>
          <a-button @click="handleSearch">
            <SearchOutlined />
          </a-button>
          <a-button class="ml-8px" @click="handleReset">
            <ReloadOutlined />
          </a-button>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="handleAdd">
        <PlusOutlined />
        {{ t('新增') }}
      </a-button>
    </div>
    <a-table
      :loading="isLoading"
      size="small"
      @change="handleTableChange"
      :pagination="pagination"
      rowKey="id"
      :data-source="dataSource"
      bordered
      :scroll="{ x: 600 }"
      :columns="columns"
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'status'">
          <a-tag :color="text === 1 ? 'processing' : 'error'" :bordered="false"
            >{{ text === 1 ? '启用' : '禁用' }}
          </a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-button @click="editDictData(record as DictItem)" type="link">{{ t('编辑') }}</a-button>
          <ConfirmButton
            @confirm="delDictData(record.id)"
            :name="t('删除')"
            :title="t('确定删除吗？')"
          />
        </template>
      </template>
    </a-table>

    <DictionaryDataFormModal ref="dictionaryDataFormModalRef" />
  </a-drawer>
</template>

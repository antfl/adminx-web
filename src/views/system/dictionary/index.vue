<script setup lang="ts">
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message, TablePaginationConfig } from 'ant-design-vue';
import { onMounted } from 'vue';

import { deleteDict, dictPage, Dict } from '@/api/system/dictionary';
import ConfirmButton from '@/components/ConfirmButton/index.vue';
import { t } from '@/i18n';

import DictionaryDataModal from './components/DictionaryDataModal/index.vue';
import DictionaryFormModal from './components/DictionaryFormModal/index.vue';

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条记录`,
});

const formState = reactive({
  dictName: '',
  dictCode: '',
});
const columns = [
  {
    width: 220,
    title: '名称',
    dataIndex: 'dictName',
    key: 'dictName',
  },
  {
    width: 220,
    title: '编码',
    dataIndex: 'dictCode',
    key: 'dictCode',
  },
  {
    width: 220,
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
  },
];
const dataSource = ref<Dict[]>([]);

const dictionaryFormModalRef = ref();
const handleAdd = () => {
  dictionaryFormModalRef.value.showModal({
    onSuccess: () => {
      getDataSource();
    },
  });
};

const editDictionary = (row: Dict) => {
  dictionaryFormModalRef.value.showModal({
    row,
    onSuccess: () => {
      getDataSource();
    },
  });
};

const dictionaryDataModalRef = ref();
const viewDictionaryData = (row: Dict) => {
  dictionaryDataModalRef.value.showModal({
    row,
  });
};

const initIng = ref(true);
const isLoading = ref(false);
const getDataSource = async () => {
  isLoading.value = true;
  const res = await dictPage({
    size: pagination.pageSize as number,
    current: pagination.current as number,
    dictName: formState.dictName,
    dictCode: formState.dictCode,
  });
  dataSource.value = res.data.records;
  pagination.total = res.data.total;
  isLoading.value = false;
  initIng.value = false;
};

const formRef = ref();
const handleReset = () => {
  pagination.current = 1;
  formRef.value.resetFields();
  getDataSource();
};

const handleSearch = () => {
  pagination.current = 1;
  getDataSource();
};

const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current;
  getDataSource();
};

const delDict = async (id: number) => {
  await deleteDict(id);
  message.success('操作成功');
  await getDataSource();
};

onMounted(() => {
  getDataSource();
});
</script>
<template>
  <div class="m-10px">
    <a-card>
      <a-form ref="formRef" :model="formState" layout="inline">
        <a-form-item :label="t('字典名称')" name="dictName">
          <a-input :placeholder="t('请输入')" v-model:value="formState.dictName" />
        </a-form-item>
        <a-form-item :label="t('字典编码')" name="dictCode">
          <a-input :placeholder="t('请输入')" v-model:value="formState.dictCode" />
        </a-form-item>
        <a-form-item>
          <a-button @click="handleReset">
            <ReloadOutlined />
            {{ t('重置') }}
          </a-button>
          <a-button @click="handleSearch" class="ml-8px" type="primary">
            <SearchOutlined />
            {{ t('搜索') }}
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card :loading="initIng" class="my-16px">
      <div class="mb-16px">
        <a-button @click="handleAdd" type="primary">
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
        :scroll="{ x: 1000 }"
        :columns="columns"
      >
        <template #bodyCell="{ text, column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="text === 1 ? 'processing' : 'error'" :bordered="false"
              >{{ text === 1 ? '启用' : '禁用' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="editDictionary(record as Dict)">{{ t('编辑') }}</a-button>
            <a-button type="link" @click="viewDictionaryData(record as Dict)">{{
              t('数据')
            }}</a-button>
            <ConfirmButton
              @confirm="delDict(record.id)"
              :name="t('删除')"
              :title="t('确定删除吗？')"
            />
          </template>
        </template>
      </a-table>
    </a-card>
    <DictionaryFormModal ref="dictionaryFormModalRef" />
    <DictionaryDataModal ref="dictionaryDataModalRef" />
  </div>
</template>

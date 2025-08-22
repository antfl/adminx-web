<script setup lang="ts">
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';

import { logPage, type Log } from '@/api/system/logs';
import { t } from '@/i18n';

import type { TablePaginationConfig } from 'ant-design-vue';

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条记录`,
});

const isLoading = ref(false);
const dataSource = ref<Log[]>([]);
const getDataSource = async () => {
  isLoading.value = true;
  const res = await logPage({
    current: pagination.current as number,
    size: pagination.pageSize as number,
  });
  dataSource.value = res.data.records;
  pagination.total = res.data.total;
  isLoading.value = false;
};

const columns = [
  {
    width: 60,
    title: '序号',
    customRender: ({ index }: { index: number }) => index + 1,
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
    customRender: () => 'admin',
  },
  {
    title: '模块',
    dataIndex: 'module',
    key: 'module',
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '请求方式',
    dataIndex: 'requestMethod',
    key: 'requestMethod',
  },
  {
    title: '耗时',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '操作时间',
    dataIndex: 'operationTime',
    key: 'operationTime',
    width: 150,
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
  },
];

const formState = ref({
  name: '',
});

const handleReset = () => {
  getDataSource();
};

const handleSearch = () => {
  getDataSource();
};

const handleTableChange = (pag: TablePaginationConfig) => {
  pagination.current = pag.current;
  getDataSource();
};

onMounted(async () => {
  await getDataSource();
});
</script>

<template>
  <div class="m-10px">
    <a-card>
      <a-form ref="formRef" :model="formState" layout="inline">
        <a-form-item :label="t('名称')" name="name">
          <a-input :placeholder="t('请输入')" v-model:value="formState.name" />
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
    <a-card class="my-16px">
      <a-table
        :loading="isLoading"
        size="small"
        :data-source="dataSource"
        bordered
        :pagination="pagination"
        :columns="columns"
        :scroll="{ x: 1200 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'duration'">
            <a-tag :bordered="false" :color="record.duration > 300 ? 'magenta' : 'processing'"
              >{{ record.duration }}ms</a-tag
            >
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link">{{ t('查看') }}</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

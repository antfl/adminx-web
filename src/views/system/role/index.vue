<script setup lang="ts">
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons-vue';

import { rolePage, type Role } from '@/api/system/role';
import { t } from '@/i18n';

import RoleFormModal from './components/RoleFormModal/index.vue';

const initIng = ref(true);
const isLoading = ref(false);
const dataSource = ref<Role[]>([]);
const getDataSource = async () => {
  isLoading.value = true;
  const res = await rolePage({ current: 1, size: 10 });
  dataSource.value = res.data.records;
  isLoading.value = false;
  initIng.value = false;
};

const columns = [
  {
    width: 50,
    title: '序号',
    customRender: ({ index }: { index: number }) => index + 1,
  },
  {
    title: '名称',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '编码',
    dataIndex: 'roleKey',
    key: 'roleKey',
  },
  {
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
    width: 150,
  },
];

const formState = ref({
  name: '',
});

const handleReset = () => {};

const handleSearch = () => {
  getDataSource();
};

const roleFormModalRef = ref();
const handleEdit = (record: Role) => {
  roleFormModalRef.value.showModal({
    row: record,
    onSuccess: () => {
      getDataSource();
    },
  });
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
    <a-card :loading="initIng" class="my-16px">
      <a-table
        :loading="isLoading"
        size="small"
        :data-source="dataSource"
        bordered
        :scroll="{ x: 1200 }"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :bordered="false" :color="record.status === 0 ? 'processing' : 'error'">
              {{ record.status === 0 ? '启用' : '停用' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button @click="handleEdit(record as Role)" type="link">{{ t('编辑') }}</a-button>
            <a-button danger type="link">{{ t('删除') }}</a-button>
          </template>
        </template>
      </a-table>
    </a-card>
    <!-- 编辑角色 -->
    <RoleFormModal ref="roleFormModalRef" />
  </div>
</template>

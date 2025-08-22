<script setup lang="ts">
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { message, TablePaginationConfig } from 'ant-design-vue';
import { TableColumnProps } from 'ant-design-vue';
import { Article, articlePage, delArticle } from '@/api/article/article';
import ConfirmButton from '@/components/ConfirmButton/index.vue';
import { t } from '@/i18n';
import router from '@/router';

const pagination = reactive<TablePaginationConfig>({
  current: 1,
  pageSize: 10,
  total: 0,
  showTotal: (total: number) => `共 ${total} 条记录`,
});

const formState = reactive({
  title: '',
  createUserName: '',
});

const columns: TableColumnProps[] = [
  {
    width: 200,
    title: '标题',
    dataIndex: 'title',
    key: 'title',
  },
  {
    width: 100,
    title: '分类',
    dataIndex: 'categoryName',
    key: 'categoryName',
  },
  {
    width: 170,
    title: '统计',
    dataIndex: 'statistics',
    key: 'statistics',
  },
  {
    width: 120,
    title: '创建人',
    dataIndex: 'createUserName',
    key: 'createUserName',
  },
  {
    width: 120,
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
  },
  {
    width: 120,
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  },
  {
    fixed: 'right',
    title: '操作',
    key: 'action',
    width: 200,
  },
];
const dataSource = ref<Article[]>([]);

const handleAdd = () => {
  router.push({ name: 'ArticleEditor' });
};

const handleEdit = (row: Article) => {
  router.push({ name: 'ArticleEditor', query: { id: row.articleId } });
};

const isLoading = ref(false);
const initIng = ref(true);
const getDataSource = async () => {
  isLoading.value = true;
  const res = await articlePage({
    size: pagination.pageSize as number,
    current: pagination.current as number,
    ...formState,
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

const handleDel = async (id: number) => {
  await delArticle(id);
  message.success('操作成功');
  await getDataSource();
};

const viewDetail = (row: Article) => {
  router.push({ path: `/article/detail/${row.articleId}` });
};

onMounted(() => {
  getDataSource();
});
</script>
<template>
  <div class="m-10px">
    <a-card>
      <a-form ref="formRef" :model="formState" layout="inline">
        <a-form-item :label="t('文章标题')" name="title">
          <a-input :placeholder="t('请输入')" v-model:value="formState.title" />
        </a-form-item>
        <a-form-item :label="t('创建人')" name="createUserName">
          <a-input :placeholder="t('请输入')" v-model:value="formState.createUserName" />
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
        :scroll="{ x: 1200 }"
        :columns="columns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'statistics'">
            <div class="text-center">
              <a-tag :bordered="false" class="text-center bg-transparent">
                <div class="color-[var(--color-primary)]">{{ record.likeCount }}</div>
                <div class="color-[var(--color-text-secondary)]">点赞</div>
              </a-tag>
              <a-tag :bordered="false" class="text-center bg-transparent">
                <div class="color-[var(--color-primary)]">{{ record.favoriteCount }}</div>
                <div class="color-[var(--color-text-secondary)]">收藏</div>
              </a-tag>
              <a-tag :bordered="false" class="text-center bg-transparent">
                <div class="color-[var(--color-primary)]">{{ record.commentCount }}</div>
                <div class="color-[var(--color-text-secondary)]">评论</div>
              </a-tag>
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" @click="handleEdit(record as Article)">{{ t('编辑') }}</a-button>
            <a-button type="link" @click="viewDetail(record as Article)">{{ t('详情') }}</a-button>
            <ConfirmButton
              @confirm="handleDel(record.articleId)"
              :name="t('删除')"
              :title="t('确定删除吗？')"
            />
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

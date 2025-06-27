<script setup lang="ts">
import { PlayCircleOutlined, LoadingOutlined, DoubleRightOutlined } from '@ant-design/icons-vue';

interface Task {
  name: string;
  status: 'normal' | 'active' | 'success' | 'exception';
  color: string;
  duration: string;
  percent: number;
  component: any;
}

const taskList = ref<Task[]>([
  {
    name: '同步系统用户',
    status: 'success',
    color: '#87d068',
    duration: '10:01',
    percent: 100,
    component: PlayCircleOutlined,
  },
  {
    name: '同步收藏数据',
    status: 'active',
    color: '#1677ff',
    duration: '08:01',
    percent: 70,
    component: LoadingOutlined,
  },
  {
    name: '同步热门文章',
    status: 'active',
    color: '#1677ff',
    duration: '09:11',
    percent: 93,
    component: LoadingOutlined,
  },
  {
    name: '同步热门商品',
    status: 'exception',
    color: '#ff5500',
    duration: '05:18',
    percent: 17,
    component: PlayCircleOutlined,
  },
]);
</script>

<template>
  <div class="p-16px">
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in taskList" :span="8">
        <a-card :title="item.name" hoverable>
          <template #extra>
            <icon :style="{ color: item.color }">
              <component :is="item.component" class="font-size-25px"></component>
            </icon>
          </template>
          <a-progress
            :steps="10"
            :stroke-color="item.color"
            :status="item.status"
            :percent="item.percent"
          />
          <div class="pt-20px flex justify-between">
            <div>任务用时：{{ item.duration }}</div>
            <a-button type="link">
              记录
              <DoubleRightOutlined />
            </a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped></style>

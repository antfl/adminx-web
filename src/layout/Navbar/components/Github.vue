<script setup lang="ts">
import { GithubOutlined } from '@ant-design/icons-vue';

// 定义代码仓库地址常量
const gitPathList = [
  {
    name: 'Github - Adminx web',
    path: 'https://github.com/antfl/adminx-web',
  },
  {
    name: 'Github - Adminx server',
    path: 'https://github.com/antfl/adminx-server',
  },
  {
    name: 'Gitee - Adminx web',
    path: 'https://gitee.com/antfl/adminx-web',
  },
  {
    name: 'Gitee - Adminx server',
    path: 'https://gitee.com/antfl/adminx-server',
  },
];

const handleMenuClick = (url: string) => {
  window.open(url, '_blank');
};
</script>

<template>
  <div class="flex items-center">
    <a-dropdown>
      <GithubOutlined class="text-lg cursor-pointer" />
      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="item in gitPathList"
            :key="item.name"
            @click="handleMenuClick(item.path)"
          >
            <span>{{ item.name }}</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>
  </div>
</template>

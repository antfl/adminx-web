<script setup lang="ts">
import { GithubOutlined } from '@ant-design/icons-vue';

// 定义代码仓库地址常量
const gitPathList = [
  {
    name: 'Github - Adminx web',
    path: 'https://github.com/byte-scheduler/admin-x-web',
  },
  {
    name: 'Github - Adminx server',
    path: 'https://github.com/byte-scheduler/admin-x-server',
  },
  {
    name: 'Gitee - Adminx web',
    path: 'https://gitee.com/byte-scheduler/admin-x-web',
  },
  {
    name: 'Gitee - Adminx server',
    path: 'https://gitee.com/byte-scheduler/admin-x-server',
  },
  {
    name: '点击链接加入群聊【Admin x 大暑版】',
    path: 'https://qm.qq.com/q/KCSI9GMiE8',
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

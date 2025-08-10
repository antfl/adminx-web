<script lang="ts" setup>
import { message } from 'ant-design-vue';

import ArcMenu from '@/components/ArcMenu/index.vue';
import DailyStats from './components/DailyStats/index.vue';
import ModuleStats from './components/ModuleStats/index.vue';
import NewUsers from './components/NewUsers/index.vue';
import ActiveUsers from './components/ActiveUsers/index.vue';
import { getTimeGreeting } from '@/utils';

interface MenuItem {
  name: string;
  icon: string;
}

const menus = [
  { name: '首页', icon: '🍅' },
  { name: '设置', icon: '🐳' },
  { name: '用户', icon: '🎉' },
  { name: '菜单', icon: '🐶' },
  { name: '退出', icon: '🐸' },
];

const handleMenuClick = (menu: MenuItem, index: number) => {
  message.success(`点击了：${menu.icon}${menu.name}(${index})`);
};

const initialPosition = {
  x: window.innerWidth - 100,
  y: window.innerHeight - 100,
};
</script>

<template>
  <div class="m-10px">
    <a-card>
      <div>
        <h1>首页</h1>
        <div class="mt-8px flex justify-between items-end font-size-16px">
          <p>
            <span>{{ getTimeGreeting() }}</span>
            <span>欢迎使用 Admin</span>
            <span class="ml-8px font-size-20px color-[var(--color-primary)]">x</span>
          </p>
        </div>
      </div>
    </a-card>
    <a-row class="mt-10px" :gutter="[10, 10]">
      <a-col :span="24" :xl="12">
        <ActiveUsers />
      </a-col>
      <a-col :span="24" :xl="12">
        <NewUsers />
      </a-col>
      <a-col :span="24" :xl="12">
        <DailyStats />
      </a-col>
      <a-col :span="24" :xl="12">
        <ModuleStats />
      </a-col>
    </a-row>
    <ArcMenu
      :menus="menus"
      :initialPosition="initialPosition"
      :draggable="true"
      :radius="120"
      :angle="130"
      :direction="230"
      @menu-click="handleMenuClick"
    />
  </div>
</template>

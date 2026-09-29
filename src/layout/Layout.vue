<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-vue-next';
import { useRouter } from 'vue-router';

import Navbar from './Navbar/index.vue';
import Sidebar from './Sidebar/index.vue';
import { useSystemStore } from '@/store/modules/systemStore';
import { useTabsStore } from '@/store/modules/tabsStore';

const systemStore = useSystemStore();
const tabsStore = useTabsStore();
const router = useRouter();
const route = useRoute();

const recentOpen = ref(false);
const recentMenus = computed(() => [...tabsStore.tabs].reverse());

let closeTimer = 0;
let drawerEl: HTMLElement | null = null;

const clearCloseTimer = () => window.clearTimeout(closeTimer);

const openRecent = () => {
  clearCloseTimer();
  recentOpen.value = true;
};

const scheduleCloseRecent = () => {
  clearCloseTimer();
  closeTimer = window.setTimeout(() => {
    recentOpen.value = false;
  }, 160);
};

const unbindDrawer = () => {
  if (!drawerEl) return;
  drawerEl.removeEventListener('mouseenter', openRecent);
  drawerEl.removeEventListener('mouseleave', scheduleCloseRecent);
  drawerEl = null;
};

const bindDrawer = async () => {
  await nextTick();
  const next = document.querySelector('.recent-drawer');
  if (!(next instanceof HTMLElement) || next === drawerEl) return;
  unbindDrawer();
  drawerEl = next;
  drawerEl.addEventListener('mouseenter', openRecent);
  drawerEl.addEventListener('mouseleave', scheduleCloseRecent);
};

watch(recentOpen, (open) => {
  if (open) bindDrawer();
  else unbindDrawer();
});

onUnmounted(() => {
  clearCloseTimer();
  unbindDrawer();
});

const openRecentPage = (path: string) => {
  recentOpen.value = false;
  if (path !== route.path) router.push(path);
};
</script>

<template>
  <div class="shell">
    <Navbar
      :recent-open="recentOpen"
      @recent-enter="openRecent"
      @recent-leave="scheduleCloseRecent"
    />
    <div class="shell-body">
      <aside class="aside" :class="{ slim: systemStore.isCollapsed }">
        <Sidebar />
        <button type="button" class="aside-fold" @click="systemStore.toggleCollapsed()">
          <ChevronRightIcon v-if="systemStore.isCollapsed" />
          <ChevronLeftIcon v-else />
          <span v-if="!systemStore.isCollapsed">{{ $t('收起') }}</span>
        </button>
      </aside>
      <main class="main">
        <div class="content" :class="{ flush: route.meta.iframeUrl }">
          <router-view v-slot="{ Component }">
            <component :is="Component" :key="route.fullPath" />
          </router-view>
        </div>
      </main>
      <t-drawer
        v-model:visible="recentOpen"
        class="recent-drawer"
        placement="left"
        size="720px"
        :header="$t('最近访问')"
        :footer="false"
        :close-btn="false"
        show-in-attached-element
        attach=".shell-body"
        drawer-class-name="recent-drawer"
        @close="recentOpen = false"
        @overlay-click="recentOpen = false"
      >
        <div v-if="recentMenus.length" class="recent-grid">
          <button
            v-for="item in recentMenus"
            :key="item.path"
            type="button"
            class="recent-item"
            :class="{ active: item.path === route.path }"
            @click="openRecentPage(item.path)"
          >
            {{ item.title }}
          </button>
        </div>
        <div v-else class="recent-empty">{{ $t('暂时还没有访问过') }}</div>
      </t-drawer>
    </div>
  </div>
</template>

<style scoped lang="less">
.shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--td-bg-color-page);
}

.shell-body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.aside {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  width: 232px;
  background: var(--td-bg-color-container);
  border-right: 1px solid var(--td-component-stroke);
  transition: width 0.2s ease;

  &.slim {
    width: 48px;

    :deep(.t-menu),
    :deep(.t-default-menu) {
      width: 48px;
    }
  }

  :deep(.t-default-menu) {
    background: transparent;
  }
}

.aside-fold {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  margin: 0;
  font: inherit;
  color: var(--td-text-color-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-top: 1px solid var(--td-component-stroke);
  border-radius: 0;

  &:hover {
    color: var(--td-text-color-primary);
    background: var(--td-bg-color-container-hover);
  }
}

.aside.slim .aside-fold {
  justify-content: center;
  width: 100%;
  padding: 0;
  margin: 0;
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.content {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: auto;

  &.flush {
    display: flex;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
  }
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px 16px;
}

.recent-item {
  display: block;
  width: 100%;
  padding: 10px 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  color: var(--td-text-color-primary);
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: var(--td-radius-default);

  &:hover,
  &.active {
    background: var(--td-bg-color-container-hover);
  }

  &.active {
    color: var(--td-brand-color);
  }
}

.recent-empty {
  padding: 12px 0;
  font-size: 13px;
  color: var(--td-text-color-placeholder);
}
</style>

<style lang="less">
.shell-body .recent-drawer.t-drawer {
  top: 0;
  height: 100%;
}

.shell-body .recent-drawer .t-drawer__header {
  padding: 20px 24px 8px;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
  border-bottom: 0;
}

.shell-body .recent-drawer .t-drawer__body {
  padding: 4px 24px 24px;
}

.shell-body .t-drawer__mask {
  top: 0;
  height: 100%;
}
</style>

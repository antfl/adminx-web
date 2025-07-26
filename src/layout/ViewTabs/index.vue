<script setup lang="ts">
import { CloseOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue';
import { isNumber, omit } from 'lodash-es';
import Sortable from 'sortablejs';

import ContextMenu from '@/layout/ViewTabs/ContextMenu.vue';
import { useSystemStore } from '@/store/modules/systemStore';
import { useTabsStore } from '@/store/modules/tabsStore';
import { MenuTab } from '@/types/meun';

const router = useRouter();
const tabsStore = useTabsStore();
const systemStore = useSystemStore();
const activeTab = computed(() => {
  return tabsStore.activeTab;
});
const handleChange = (key: string) => {
  handleClickOutside();
  tabsStore.setActiveTab(key);
  router.push(key);
};

const handleDel = (path: string) => {
  tabsStore.removeTab(path);
};

// 右键菜单相关状态
const showContextMenu = ref(false);
const contextMenuPosition = ref({ left: '0', top: '0' });
const currentContextTab = ref<any>(null);

/**
 * 右键菜单处理
 * @param tab 当前 tab
 * @param event MouseEvent
 */
const handleRightClick = (tab: any, event: MouseEvent) => {
  event.preventDefault();
  currentContextTab.value = tab;
  contextMenuPosition.value = {
    left: `${event.clientX}px`,
    top: `${event.clientY}px`,
  };
  showContextMenu.value = true;
};

/**
 * 关闭键菜单
 */
const closeContextMenu = () => {
  showContextMenu.value = false;
};

/**
 * 点击页面其他地方关闭菜单
 */
const handleClickOutside = () => {
  if (showContextMenu.value) {
    closeContextMenu();
  }
};

let sortable: Sortable | null = null;
const initDraggableTabs = () => {
  const tabsRef: HTMLElement | null = document.querySelector(
    '.view-tabs-container  .ant-tabs-nav-list',
  );
  if (tabsRef) {
    sortable = Sortable.create(tabsRef, {
      animation: 180,
      onEnd({ newIndex, oldIndex }: Sortable.SortableEvent) {
        if (isNumber(newIndex) && isNumber(oldIndex)) {
          tabsStore.draggableTabs(newIndex, oldIndex);
        }
      },
    });
  }
};

onMounted(() => {
  initDraggableTabs();
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  sortable?.destroy();
  document.removeEventListener('click', handleClickOutside);
});

const setTabProps = (tab: MenuTab) => {
  const isActive = tab.path === activeTab.value;
  const obj = {
    ghost: isActive,
    type: 'primary',
  };
  if (isActive) {
    return obj;
  }
  return omit(obj, 'type');
};
</script>

<template>
  <div class="view-tabs-container flex items-center px-8px h-40px pos-sticky z-9 top-0">
    <a-button
      v-if="systemStore.layout.collapsed"
      @click="systemStore.toggleCollapsed"
      class="w-40px hidden md:flex items-center justify-center mr-8px"
    >
      <component :is="systemStore.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
    </a-button>
    <a-tabs
      class="w-0 flex-auto"
      v-model:activeKey="activeTab"
      tab-position="top"
      :tabBarGutter="8"
      :tabBarStyle="{
        margin: '0',
        height: '36px',
      }"
    >
      <a-tab-pane v-for="tab in tabsStore.tabs" :key="tab.path">
        <template #tab>
          <a-button
            :draggable="true"
            @click.stop="handleChange(tab.path)"
            @contextmenu.prevent="handleRightClick(tab, $event)"
            :class="`pl-10px ${tab.closable ? 'pr-5px' : 'pr-10px'}`"
            v-bind="setTabProps(tab)"
          >
            <component class="mr-0!" :is="tab.icon" />
            <span class="tab-title">{{ tab.title }}</span>
            <CloseOutlined
              class="ml-3px! mr-0! p-[4px_7px] duration-300 hover:scale-130"
              v-if="tab.closable"
              @click.stop="handleDel(tab.path)"
            />
          </a-button>
        </template>
      </a-tab-pane>
    </a-tabs>

    <!-- 右键菜单 -->
    <ContextMenu
      v-if="showContextMenu"
      @close="closeContextMenu"
      :current-context-tab="currentContextTab"
      :style="contextMenuPosition"
    />
  </div>
</template>

<style scoped lang="less">
.view-tabs-container {
  background-color: var(--color-bg-container) !important;
  border-bottom: 1px solid var(--color-border-secondary);

  :deep(.ant-tabs-ink-bar) {
    display: none;
  }

  :deep(.ant-tabs-nav-more) {
    color: var(--color-text);
  }

  :deep(.ant-tabs-nav) {
    &::before {
      display: none;
    }
  }
}
</style>

<style lang="less">
// 设置 tab 栏超出部分的菜单样式
.ant-tabs-dropdown {
  .ant-tabs-dropdown-menu {
    max-height: 70vh !important;
    padding: 3px !important;
    border: 1px solid var(--color-border-secondary);

    .ant-tabs-dropdown-menu-item {
      padding: 0 !important;
      border-radius: var(--border-radius-outer);
    }
  }

  .ant-btn {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    box-shadow: none;

    .tab-title {
      display: inline-block;
      width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      white-space: nowrap;
    }
  }
}
</style>

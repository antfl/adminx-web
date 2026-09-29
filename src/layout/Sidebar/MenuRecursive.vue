<script setup>
const props = defineProps({
  routes: {
    type: Array,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
});

const resolvePath = (path) => {
  const normalizedBase = props.basePath.replace(/\/+$/, '');
  const normalizedPath = (path || '').replace(/^\/+/, '');

  if (!normalizedBase) return `/${normalizedPath}`;
  if (!normalizedPath) return normalizedBase;

  return `${normalizedBase}/${normalizedPath}`;
};
</script>

<template>
  <template v-for="route in routes" :key="resolvePath(route.path)">
    <template v-if="route.meta?.directlyShowChildren">
      <MenuRecursive :routes="route.children" :base-path="resolvePath(route.path)" />
    </template>

    <template v-else>
      <t-menu-item v-if="!route.children?.length" :value="resolvePath(route.path)">
        <template v-if="route.meta?.icon" #icon>
          <component :is="route.meta.icon" />
        </template>
        {{ route.meta?.title }}
      </t-menu-item>

      <t-submenu v-else :value="resolvePath(route.path)" :title="route.meta?.title">
        <template v-if="route.meta?.icon" #icon>
          <component :is="route.meta.icon" />
        </template>
        <MenuRecursive :routes="route.children" :base-path="resolvePath(route.path)" />
      </t-submenu>
    </template>
  </template>
</template>

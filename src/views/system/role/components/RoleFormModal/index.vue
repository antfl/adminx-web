<script setup lang="ts">
import { message } from 'ant-design-vue';

import { Role, rolePermissions, setRoleMenus } from '@/api/system/role';
import { t } from '@/i18n';
import { Menu } from '@/types/meun';

const formRef = ref();
const visible = ref(false);
const modalTile = ref('');
const menuTree = ref([]);
const permissionKeys = ref([]);
let callback: (...args: any[]) => any;
const roleId = ref();
const showModal = async ({ row, onSuccess }: { row: Role; onSuccess: (...args: any[]) => any }) => {
  menuTree.value = [];
  permissionKeys.value = [];
  roleId.value = row.roleId;
  const res = await rolePermissions(row.roleId);
  menuTree.value = res.data.menuTree;
  permissionKeys.value = res.data.permissionKeys;
  callback = onSuccess;
  modalTile.value = t('编辑');
  visible.value = true;
};

const isLoading = ref(false);

const formData = ref<Menu>({} as Menu);
const handleOk = async () => {
  isLoading.value = true;
  await setRoleMenus({ roleId: roleId.value, menuIds: permissionKeys.value });
  callback && callback();
  message.success(t('操作成功'));
  visible.value = false;
};

defineExpose({
  showModal,
});
</script>

<template>
  <a-modal v-model:open="visible" width="600px" :title="modalTile" @ok="handleOk">
    <a-form ref="formRef" :label-col="{ span: 5 }" :wrapperCol="{ span: 18 }" :model="formData">
    </a-form>
    <a-tree
      class="max-h-60vh overflow-y-auto"
      defaultExpandAll
      v-model:checkedKeys="permissionKeys"
      checkable
      :fieldNames="{
        key: 'id',
        title: 'titleZh',
      }"
      :tree-data="menuTree"
    >
    </a-tree>
  </a-modal>
</template>

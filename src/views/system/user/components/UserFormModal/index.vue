<script setup lang="ts">
const formData = reactive({
  name: '',
  age: '',
  address: '',
  nickname: '',
});

let callback: (data: any) => void;
const visible = ref(false);
const modalTile = ref('');
const showModal = ({ title, onSuccess }: { title: string; onSuccess: (data: any) => void }) => {
  callback = onSuccess;
  modalTile.value = title;
  visible.value = true;
};

const handleOk = () => {
  callback(formData);
  visible.value = false;
};

defineExpose({
  showModal,
});
</script>

<template>
  <a-modal v-model:open="visible" width="400px" :title="modalTile" @ok="handleOk">
    <a-form :model="formData" layout="vertical">
      <a-form-item label="姓名">
        <a-input v-model:value="formData.name"></a-input>
      </a-form-item>
      <a-form-item label="昵称">
        <a-input v-model:value="formData.nickname"></a-input>
      </a-form-item>
      <a-form-item label="年龄">
        <a-input v-model:value="formData.age"></a-input>
      </a-form-item>
      <a-form-item label="地址">
        <a-input v-model:value="formData.address"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

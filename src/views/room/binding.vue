<template>
  <div>
    <el-transfer v-model="modelValue" :data="transferData" :titles="transferTitles" />
    <el-button type="primary" class="mt20" @click="emitToParent">保存</el-button>
  </div>
</template>

<script setup lang="tsx" name="binding">
import { defineProps, ref, watch, defineEmits } from "vue";

const props = defineProps({
  initialData: Array,
  initialValue: Array,
  initialTitles: Array
});

// 创建响应式变量
const modelValue = ref(props.initialValue);
const transferData = ref(props.initialData);
const transferTitles = ref(props.initialTitles);

// 监听 initialData 的变化，并更新 transferData
watch(
  () => props.initialData,
  newValue => {
    transferData.value = newValue;
    console.log(transferData.value, "ddddstransferData.value");
  }
);
// 监听 initialValue 的变化，并更新 transferData
watch(
  () => props.initialValue,
  newValue => {
    modelValue.value = newValue;
    console.log(modelValue.value);
  }
);

const emitToParent = () => {
  console.log(modelValue.value, "ddd");
  // 触发名为 'childClick' 的自定义事件，并传递需要的参数
  emit("childClick", modelValue.value);
};
const emit = defineEmits(["childClick"]);
</script>

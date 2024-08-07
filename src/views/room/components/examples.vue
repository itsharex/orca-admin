<template>
  <el-drawer v-model="drawer2" direction="rtl">
    <template #header>
      <h4>示例</h4>
    </template>
    <template #default>
      <div style="margin-top: 50%; text-align: center">
        <img src="@/assets/images/notData@2x.png" />
        <div class="noData">暂无数据</div>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">关闭</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const drawer2 = ref(false);

function cancelClick() {
  drawer2.value = false;
}
function confirmClick() {
  drawer2.value = false;
}
const props = defineProps({
  visible: Boolean
});
const emit = defineEmits(["update:visible"]);
// 监听外部值的变化，更新内部值
watch(
  () => props.visible,
  newValue => {
    drawer2.value = newValue;
  }
);
watch(
  () => drawer2.value,
  newValue => {
    emit("update:visible", newValue);
  }
);
</script>

<style scoped>
.noData {
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #8b8e9a;
  text-align: center;
}
</style>

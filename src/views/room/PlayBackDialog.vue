<template>
  <el-dialog v-model="dialogTableVisible" title="添加视频" width="800">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="录播模板" name="first">
        <el-input v-model="input1" style="width: 240px" size="large" placeholder="视频名称" :suffix-icon="Search" />
        <el-table :data="gridData" ref="multipleTableRef">
          <el-table-column type="selection" width="55" />
          <el-table-column property="date" label="视频名称" width="300" />
          <el-table-column property="name" label="时长" width="200" />
          <el-table-column property="address" label="大小" width="200" show-overflow-tooltip /> </el-table
      ></el-tab-pane>
      <el-tab-pane label="直播回放" name="second">Config</el-tab-pane>
      <el-tab-pane label="本地视频" name="third">Role</el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import { Search } from "@element-plus/icons-vue";
const props = defineProps({
  visible: Boolean
});
const input1 = ref("");
const emit = defineEmits(["update:visible"]);
// 使用 dialogTableVisible 来存储组件内部的值
const dialogTableVisible = ref(props.visible);

// 监听外部值的变化，更新内部值
watch(
  () => props.visible,
  newValue => {
    dialogTableVisible.value = newValue;
  }
);

// 监听内部值的变化，触发更新外部值的事件
watch(
  () => dialogTableVisible.value,
  newValue => {
    emit("update:visible", newValue);
  }
);
const activeName = ref("first");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
const gridData = [
  {
    date: "2016-05-02",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District"
  },
  {
    date: "2016-05-04",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District"
  },
  {
    date: "2016-05-01",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District"
  },
  {
    date: "2016-05-03",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District"
  }
];
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
</style>

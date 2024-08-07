<template>
  <div class="table-box p10">
    <el-tabs v-model="active" class="chanel-tabs" @tab-click="handleClick">
      <el-tab-pane label="时间维度" name="time"><TimeData /></el-tab-pane>
      <el-tab-pane label="渠道维度" name="chanel"><ChannelData /></el-tab-pane>
      <el-tab-pane label="直播维度" name="living"><LivingData /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="channelData">
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import TimeData from "./components/timeData.vue";
import ChannelData from "./components/channelData.vue";
import LivingData from "./components/livingData.vue";
const active = ref("time");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>
<style lang="scss" scoped>
.chanel-tabs {
  :deep(.el-tabs__header) {
    background-color: #fff;
  }
  :deep(.el-tabs__nav) {
    padding-left: 15px;
  }
}
</style>

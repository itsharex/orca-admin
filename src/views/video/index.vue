<template>
  <div class="table-box p10">
    <el-tabs v-model="activeName" class="video-tabs" @tab-click="handleClick">
      <el-tab-pane label="本地视频" name="video">
        <LocalVideo />
      </el-tab-pane>
      <el-tab-pane label="直播视频" name="live">
        <Live />
      </el-tab-pane>
      <el-tab-pane label="录播模板" name="template">
        <Templet />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import type { TabsPaneContext } from "element-plus";
import Templet from "./components/templet.vue";
import Live from "./components/live.vue";
import LocalVideo from "./components/localVideo.vue";
const activeName = ref("video");

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
</script>
<style lang="scss" scoped>
.table-box {
  height: calc(100vh - 170px);
}
.video-tabs {
  :deep(.el-tabs__header) {
    background-color: #fff;
  }
  :deep(.el-tabs__nav) {
    padding-left: 20px;
  }
}
</style>

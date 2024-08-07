<template>
  <div class="tool-bar-lf" :style="{ '--width': isCollapse ? '65px' : '142px' }">
    <!-- <CollapseIcon id="collapseIcon" /> -->
    <div class="logo flx-center">
      <img v-show="isCollapse" class="logo-img-mobile" src="@/assets/images/logo.png" alt="logo" />
      <img v-show="!isCollapse" class="logo-img-pc" src="@/assets/images/logo@2x.png" alt="logo" />
      <!-- <span v-show="!isCollapse" class="logo-text">{{ title }}</span> -->
    </div>
    <!-- <Breadcrumb v-show="globalStore.breadcrumb" id="breadcrumb" /> -->
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/stores/modules/global";
// import CollapseIcon from "./components/CollapseIcon.vue";
// import Breadcrumb from "./components/Breadcrumb.vue";
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.isCollapse);
</script>

<style scoped lang="scss">
.tool-bar-lf {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 52px; /* 容器高度 */
  overflow: hidden;
  white-space: nowrap;
  .logo {
    box-sizing: border-box;
    width: var(--width);
    height: 55px;
    position: relative;
    .logo-img-mobile {
      width: 40px;
      object-fit: contain;
      margin-right: 6px;
    }
    .logo-img-pc {
      position: absolute;
      top: 0;
      left: 0;
      width: 142px;
      object-fit: contain;
      margin-right: 6px;
    }
    .logo-text {
      font-size: 21.5px;
      font-weight: bold;
      color: var(--el-aside-logo-text-color);
      white-space: nowrap;
    }
  }
}
</style>

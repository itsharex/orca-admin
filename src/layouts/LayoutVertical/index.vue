<!-- 纵向布局 -->
<template>
  <el-container class="layout">
    <el-header class="orca-header">
      <ToolBarLeft />
      <ToolBarRight />
    </el-header>
    <el-container>
      <el-aside>
        <div class="aside-box" :style="{ width: isCollapse ? '65px' : '180px', '--pl': isCollapse ? '0px' : '13px' }">
          <el-scrollbar>
            <el-menu
              :router="false"
              :default-active="activeMenu"
              :collapse="isCollapse"
              :unique-opened="accordion"
              :collapse-transition="false"
            >
              <SubMenu :menu-list="menuList" />
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <Main />
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="layoutVertical">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";
import { useGlobalStore } from "@/stores/modules/global";
import Main from "@/layouts/components/Main/index.vue";
import ToolBarLeft from "@/layouts/components/Header/ToolBarLeft.vue";
import ToolBarRight from "@/layouts/components/Header/ToolBarRight.vue";
import SubMenu from "@/layouts/components/Menu/SubMenu.vue";

// const title = import.meta.env.VITE_GLOB_APP_TITLE;

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const accordion = computed(() => globalStore.accordion);
const isCollapse = computed(() => globalStore.isCollapse);
const menuList = computed(() => authStore.showMenuListGet);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
</script>

<style scoped lang="scss">
@import "./index.scss";
.orca-header {
  margin: 0 0;
  padding: 0 0 !important;
  border-top: 0px;
}
</style>

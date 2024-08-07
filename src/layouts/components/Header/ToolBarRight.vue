<template>
  <div class="tool-bar-ri">
    <div v-show="show" class="user-money flx-center mr12 pl6 pr6">
      <img src="@/assets/images/money.png" alt="" />
      <span>余额</span>
      <span>0.00</span>
      <el-icon size="8"><ArrowRight /></el-icon>
    </div>
    <div class="header-icon">
      <!-- <AssemblySize id="assemblySize" /> -->
      <!-- <Language id="language" /> -->
      <!-- <SearchMenu id="searchMenu" /> -->
      <!-- <ThemeSetting id="themeSetting" /> -->
      <!-- <Message id="message" /> -->
      <!-- <Fullscreen id="fullscreen" /> -->
    </div>
    <Avatar />
    <span class="username sle">{{ username }}</span>
  </div>
</template>

<script setup lang="ts">
// import AssemblySize from "./components/AssemblySize.vue";
// import Language from "./components/Language.vue";
// import SearchMenu from "./components/SearchMenu.vue";
// import ThemeSetting from "./components/ThemeSetting.vue";
// import Message from "./components/Message.vue";
// import Fullscreen from "./components/Fullscreen.vue";
import { useUserStore } from "@/stores/modules/user";
import { useRoute } from "vue-router";
import Avatar from "./components/Avatar.vue";
const userStore = useUserStore();
const route = useRoute();
const show = computed(() => route.path === "/bill/index");
const username = computed(() => userStore.userInfo.name);
</script>

<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    max-width: 90px;
    margin: 0 20px 0 6px;
    font-size: 15px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #5c5e66;
  }

  .user-money {
    height: 28px;
    background: linear-gradient(270deg, #ffecf0 0%, #fff5ed 100%);
    border-radius: 14px;
    img {
      width: 16px;
      height: 16px;
    }
    span {
      &:nth-of-type(1) {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #5c5e66;
        margin: 0 4px;
      }
      &:nth-of-type(2) {
        font-family: DIN, DIN;
        font-weight: 500;
        font-size: 12px;
        color: #3370ff;
        margin-right: 4px;
      }
    }
  }
}
</style>

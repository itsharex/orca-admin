<template>
  <div class="table-box p10">
    <el-card body-style="padding: 0;">
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="activeIndex" @select="openChange">
            <el-menu-item v-for="(item, index) in menuList" :key="item.value" :index="item.value.toString()">
              <SvgIcon
                :name="item.icon"
                :icon-style="{
                  width: '16px',
                  height: '16px',
                  filter: `drop-shadow(1000px 0 0 ${activeIndex == index + 1 ? '#3370ff' : '#333333'})`,
                  transform: 'translate(-1000px)'
                }"
              ></SvgIcon>
              <!-- 那个菜单选中，那个图标变色 -->
              <span class="ml10">{{ item.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main v-if="activeIndex == '1'">
          <CustTitle>
            <template #icon>
              <span class="icon-tips"></span>
            </template>
            <template #title>通用</template>
          </CustTitle>
          <Universal />
        </el-main>
        <el-main v-if="activeIndex == '2'">
          <CustTitle>
            <template #icon>
              <span class="icon-tips"></span>
            </template>
            <template #title>礼物</template>
          </CustTitle>
          <Gift />
        </el-main>
        <el-main v-if="activeIndex == '3'">
          <CustTitle>
            <template #icon>
              <span class="icon-tips"></span>
            </template>
            <template #title>机器人</template>
          </CustTitle>
          <Robot />
        </el-main>
        <el-main v-if="activeIndex == '4'">
          <CustTitle>
            <template #icon>
              <span class="icon-tips"></span>
            </template>
            <template #title>敏感词库</template>
          </CustTitle>
          <Sensitive />
        </el-main>
        <el-main v-if="activeIndex == '5'">
          <CustTitle>
            <template #icon>
              <span class="icon-tips"></span>
            </template>
            <template #title>免审词库</template>
          </CustTitle>
          <Exempt />
        </el-main>
        <el-main v-if="activeIndex == '6'">
          <CustTitle>
            <template #icon>
              <span class="icon-tips"></span>
            </template>
            <template #title>支付</template>
          </CustTitle>
          <Pay />
        </el-main>
      </el-container>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="setting">
import { reactive } from "vue";
import Universal from "./components/Universal.vue";
import Gift from "../gift/index.vue";
import Robot from "../robot/index.vue";
import Exempt from "@/views/exempt/index.vue";
import Sensitive from "@/views/sensitive/index.vue";
import Pay from "./components/Pay.vue";
import { useRoute } from "vue-router";
const route = useRoute();
const menuList = reactive([
  {
    name: "通用",
    value: 1,
    icon: "setting"
  },
  {
    name: "礼物",
    value: 2,
    icon: "gift"
  },
  {
    name: "机器人",
    value: 3,
    icon: "robot"
  },
  {
    name: "敏感词库",
    value: 4,
    icon: "sensitive"
  },
  {
    name: "免审词库",
    value: 5,
    icon: "exempt"
  },
  {
    name: "支付",
    value: 6,
    icon: "pay"
  }
]);
const activeIndex = ref("1");
const openChange = (index: any) => {
  activeIndex.value = index;
};
onActivated(() => {
  if (route.query.active) {
    activeIndex.value = route.query.active.toString();
  }
});
</script>
<style scoped lang="scss">
@import "./index.scss";
.el-container {
  height: calc(100vh - 115px);
  overflow: auto;
}
</style>

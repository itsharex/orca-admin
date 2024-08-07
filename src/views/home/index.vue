<template>
  <div class="table-box p10" style="">
    <div class="account-content flx-align-center mb20">
      <img src="@/assets/images/account.png" alt="" />
      <div class="account-info">
        <div class="account-tips">您的 [账户余额] 不足、[开通收款账号] 未完成，为避免影响经验，建议您及时处理</div>
        <div class="account-list">
          <div class="mb8 mt20">
            <span>1. 账户余额</span>
            <span class="ml8 cursor-pointer" @click="toPath('/bill/index')">前去充值</span>
          </div>
          <div>
            <span>2. 开通收款账户：微信支付</span>
            <span class="ml8 cursor-pointer" @click="toPath('/setting/index')">前往开通</span>
          </div>
        </div>
      </div>
    </div>
    <CustTitle>
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="kanban" :icon-style="{ width: '15px', height: '15px' }"></SvgIcon>
        </div>
      </template>
      <template #title>
        数据概览
        <span class="title-tips">({{ currentYear }}年{{ currentMonth }}月)</span>
      </template>
    </CustTitle>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">开播次数</span>
              <div class="card-bg card-bg-1">
                <SvgIcon name="broadcasting" :icon-style="{ width: '24px', height: '24px', color: '#3370ff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="outputliveNum" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">观看直播人数</span>
              <div class="card-bg card-bg-2">
                <SvgIcon name="watching_live" :icon-style="{ width: '24px', height: '24px', color: '#ca8eff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="outputliveUv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">观看点播人数</span>
              <div class="card-bg card-bg-3">
                <SvgIcon name="watching_demand" :icon-style="{ width: '24px', height: '24px', color: '#2bd18f' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="outputplayUv" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">云存储</span>
              <div class="card-bg card-bg-4">
                <SvgIcon name="cloud_stora" :icon-style="{ width: '24px', height: '24px', color: '#70bbff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="outputstorage">
              <template #suffix>MB</template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <CustTitle class="mt20">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="kanban" :icon-style="{ width: '14px', height: '14px' }"></SvgIcon>
        </div>
      </template>
      <template #title>最近直播</template>
    </CustTitle>
    <el-row :gutter="20" class="live-data">
      <el-col :span="12">
        <el-card>
          <span v-if="liveRoomList.length == 0" class="el-table__empty-text">
            <div class="table-empty flx-center">
              <img src="@/assets/images/notData@2x.png" alt="notData" />
              <div>暂无数据</div>
            </div>
          </span>
          <el-row v-else>
            <el-col
              v-for="(item, index) in liveRoomList"
              :key="item"
              :span="24"
              :class="{ mb20: index != liveRoomList.length - 1 }"
            >
              <div class="live-content flx-justify-between">
                <img v-if="item.cover" :src="item.cover" alt="" />
                <img v-else src="@/assets/images/default@2x.png" alt="" />
                <div class="live-info flx-center">
                  <div class="live-title sle">
                    {{ item.name }}
                  </div>
                  <div class="live-desc flx-align-center mt8 mb8">
                    <div v-if="item.videoType == 1" class="live-bg live-bg-1 flx-center">
                      <SvgIcon name="liveing" :icon-style="{ width: '14px', height: '14px' }"></SvgIcon>
                    </div>
                    <div v-if="item.videoType == 2" class="live-bg live-bg-2 flx-center">
                      <SvgIcon name="video" :icon-style="{ width: '14px', height: '14px' }"></SvgIcon>
                    </div>
                    <div class="live-type ml4">{{ item.videoType == 1 ? "实况直播" : "录播直播" }}</div>
                    <el-divider direction="vertical" />
                    <div class="live-time">{{ item.livingTime }}</div>
                  </div>
                  <div class="live-status" v-if="item.permissionType == 1">免费</div>
                  <div class="live-status" v-if="item.permissionType == 2">密码 {{ item.permissionJson }}</div>
                  <div class="live-status" v-if="item.permissionType == 3">{{ `¥ ${item.permissionJson}` }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="card content-box">
            <ECharts :option="option" :key="eChartsKeys" style="height: calc(100vh - 570px)" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="home">
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { useTransition } from "@vueuse/core";
import { getOverviewData, getLatestRoom, getLatestDay } from "@/api/modules/home";
import { useRouter } from "vue-router";
const router = useRouter();
const option: ECOption = {
  title: {
    text: "开播次数统计"
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  color: ["#3370FF"],
  legend: {
    textStyle: {
      color: "#5C5E66"
    }
  },
  grid: {
    left: "1%",
    right: "1%",
    bottom: "2%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisLabel: {
        color: "#5C5E66"
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      axisLabel: {
        color: "#8B8E9A"
      }
    }
  ],
  series: [
    {
      name: "开播次数",
      type: "bar",
      barWidth: "35px",
      emphasis: {
        focus: "series"
      },
      itemStyle: {
        borderRadius: [8, 8, 0, 0]
      },
      data: []
    }
  ]
};
const eChartsKeys = ref(0);
// 数据看板
const liveNum = ref(0);
const liveUv = ref(0);
const playUv = ref(0);
const storage = ref(0);
const liveRoomList = ref([]);
// 当前年月
const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth() + 1);
// 开播次数
const outputliveNum = useTransition(liveNum, {
  duration: 1500
});
// 观看直播人数
const outputliveUv = useTransition(liveUv, {
  duration: 1500
});
// 观看点播人数
const outputplayUv = useTransition(playUv, {
  duration: 1500
});
// 云存储
const outputstorage = useTransition(storage, {
  duration: 1500
});
// 获取数据看板
const getStatistics = async () => {
  const res = await getOverviewData();
  const data = res.data as any;
  liveNum.value = data.liveNum;
  liveUv.value = data.liveUv;
  playUv.value = data.playUv;
  storage.value = data.storage ? Number(data.storage / 1048576).toFixed(0) * 1 : 0;
};
// 获取今日开播房间列表
const getLiveRoomList = async () => {
  const res = await getLatestRoom();
  liveRoomList.value = res.data || [];
};
// 获取统计数据
const getLatestDayData = async () => {
  const res = await getLatestDay();
  option.xAxis[0].data = (res.data || []).map(item => item.date);
  option.series[0].data = (res.data || []).map(item => item.liveNum);
  eChartsKeys.value += 1;
};
onActivated(() => {
  eChartsKeys.value += 1;
});
const toPath = (path: any) => {
  if (path === "/setting/index") {
    router.push({ path, query: { active: 6 } });
  } else {
    router.push(path);
  }
};
onMounted(() => {
  getStatistics();
  getLiveRoomList();
  getLatestDayData();
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

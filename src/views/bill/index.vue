<template>
  <div class="table-box p10">
    <div class="bill-info flx-justify-between p12 mb20">
      <div class="bill-lf">
        <div class="bill-img flx-center">
          <img src="@/assets/images/money.png" alt="" />
        </div>
        <div class="bill-money ml20">
          <span class="mb8">账户余额</span>
          <el-statistic :value="0.0" :precision="2" />
        </div>
      </div>
      <div class="bill-rt">
        <span class="mr12">请联系商务进行充值</span>
        <p>充值</p>
      </div>
    </div>
    <CustTitle>
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="screening" :icon-style="{ width: '10px', height: '10px', color: '#ffffff' }"></SvgIcon>
        </div>
      </template>
      <template #title>筛选</template>
    </CustTitle>
    <el-row :gutter="20" class="mb32">
      <el-col :span="24">
        <el-card>
          <div class="search-content">
            <span class="search-label mb6">日期</span>
            <div class="flx-align-center">
              <el-date-picker
                type="daterange"
                range-separator="～"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                style="width: 300px; flex: inherit"
              />
              <div class="search-btn ml12">
                <el-button round color="rgba(51,112,255,0.1)" style="color: #3370ff"> 搜索 </el-button>
                <el-button round> 重置 </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <CustTitle>
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="kanban" :icon-style="{ width: '10px', height: '10px' }"></SvgIcon>
        </div>
      </template>
      <template #title>数据概览</template>
    </CustTitle>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">观看直播人数</span>
              <div class="card-bg card-bg-2">
                <SvgIcon name="watching_live" :icon-style="{ width: '24px', height: '24px', color: '#ca8eff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="0" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">观看点播人数</span>
              <div class="card-bg card-bg-3">
                <SvgIcon name="watching_demand" :icon-style="{ width: '24px', height: '24px', color: '#2bd18f' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="0" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">云存储</span>
              <div class="card-bg card-bg-4">
                <SvgIcon name="cloud_stora" :icon-style="{ width: '24px', height: '24px', color: '#70bbff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="0">
              <template #suffix>MB</template>
            </el-statistic>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="mt20" style="height: 400px; flex: none">
      <div class="card content-box" style="height: 360px">
        <ECharts :option="option" :key="eChartsKeys" />
      </div>
    </el-card>
    <CustTitle style="margin-top: 20px">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="statistics" :icon-style="{ width: '10px', height: '10px' }"></SvgIcon>
        </div>
      </template>
      <template #title>账单明细</template>
    </CustTitle>
    <el-table class="cust-table" :data="tableData" height="300" style="flex: none">
      <el-table-column prop="uerInfo" label="时间" />
      <el-table-column prop="channel" label="直播费用/元" />
      <el-table-column prop="room" label="点播费用/元" />
      <el-table-column prop="order" label="云存储/G" />
      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="@/assets/images/notData@2x.png" alt="notData" />
            <div>暂无数据</div>
          </slot>
        </div>
      </template>
    </el-table>
    <CustTitle style="margin-top: 20px">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="statistics" :icon-style="{ width: '10px', height: '10px' }"></SvgIcon>
        </div>
      </template>
      <template #title>消费明细</template>
    </CustTitle>
    <el-tabs v-model="activeName">
      <el-tab-pane label="直播" name="first">
        <el-table class="cust-table" :data="tableData" height="300">
          <el-table-column prop="uerInfo" label="观众昵称" />
          <el-table-column prop="channel" label="IP" />
          <el-table-column prop="room" label="进入直播间时间" />
          <template #empty>
            <div class="table-empty">
              <slot name="empty">
                <img src="@/assets/images/notData@2x.png" alt="notData" />
                <div>暂无数据</div>
              </slot>
            </div>
          </template>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="点播" name="second">
        <el-table class="cust-table" :data="tableData" height="300">
          <el-table-column prop="uerInfo" label="观众昵称" />
          <el-table-column prop="channel" label="IP" />
          <el-table-column prop="room" label="进入直播间时间" />
          <template #empty>
            <div class="table-empty">
              <slot name="empty">
                <img src="@/assets/images/notData@2x.png" alt="notData" />
                <div>暂无数据</div>
              </slot>
            </div>
          </template>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts" name="bill">
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
const option: ECOption = {
  title: {
    text: "使用详情"
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["观看直播人数", "观看点播人数", "云存储"]
  },
  grid: {
    left: "1%",
    right: "1%",
    bottom: "2%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["4-15", "4-16", "4-17", "4-18", "4-19", "4-20", "4-21"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "观看直播人数",
      type: "line",
      stack: "Total",
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: "观看点播人数",
      type: "line",
      stack: "Total",
      data: [0, 0, 0, 0, 0, 0, 0]
    },
    {
      name: "云存储",
      type: "line",
      stack: "Total",
      data: [0, 0, 0, 0, 0, 0, 0]
    }
  ]
};
const tableData = ref([]);
const activeName = ref("first");
const eChartsKeys = ref(0);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

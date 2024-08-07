<template>
  <div class="table-box p10">
    <div class="flx-justify-between mb10">
      <div class="search-lf flx-align-center pl6 pr6">
        <div class="search-lf-content flx-align-center">
          <div class="search-lf-item pl6 pr6 pt4 pb4 mr4" v-for="item in showRoomData" :key="item.value">
            {{ item.label }}
          </div>
        </div>
        <el-popover v-if="hiddenRoomData.length" placement="bottom" :width="240" trigger="hover">
          <template #reference>
            <div class="search-lf-btn flx-center pl6 pr6 pt4 pb4 cursor-pointer">
              <el-icon><MoreFilled /></el-icon>
            </div>
          </template>
          <div class="sb-content">
            <div class="sb-item pl6 pr6 pt4 pb4 mr4 mb4" v-for="item in hiddenRoomData" :key="item.value">
              {{ item.label }}
            </div>
          </div>
        </el-popover>
      </div>
      <div class="search-rg flx-center cursor-pointer" @click="searchRoomModalRef.open(roomIds)">
        <SvgIcon
          name="search"
          :icon-style="{
            width: '16px',
            height: '16px',
            filter: 'drop-shadow(999999px 0 0 #3370ff)',
            transform: 'translate(-999999px)'
          }"
        ></SvgIcon>
        <span class="ml4">筛选直播</span>
      </div>
    </div>
    <CustTitle class="pt5 pb5">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="kanban" :icon-style="{ width: '15px', height: '15px' }"></SvgIcon>
        </div>
      </template>
      <template #title>直播数据</template>
    </CustTitle>
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-statistic :value="outputpv">
            <template #title>
              <div class="flx-align-center">
                <span>总观看人次 (PV)</span>
                <el-tooltip
                  effect="dark"
                  content="筛选条件内，直播间被访问次数，一人访问多次记为多次，按实际开播时间到实际结束时间计数"
                  placement="top"
                >
                  <el-icon class="warn-label" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="outputliveUv">
            <template #title>
              <div class="flx-align-center">
                <span>总观看人数 (UV)</span>
                <el-tooltip
                  effect="dark"
                  content="筛选条件内，观看直播的人数（去重），按实际开播时间到实际结束时间计数"
                  placement="top"
                >
                  <el-icon class="warn-label" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="outputonlineNum">
            <template #title>
              <div class="flx-align-center">
                <span>在线人数峰值 (人)</span>
                <el-tooltip effect="dark" content="筛选条件内，直播间某一时刻的在线人数峰值" placement="top">
                  <el-icon class="warn-label" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="outputgreater5Num">
            <template #title>
              <div class="flx-align-center">
                <span>停留超5分钟人数 (人)</span>
                <el-tooltip
                  effect="dark"
                  content="筛选条件内，不间断观看直播的时长大于等于5分钟的去重人数，按实际开播时间到实际结束时间计数"
                  placement="top"
                >
                  <el-icon class="warn-label" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="outputtotalViewDuration" :precision="2">
            <template #title>
              <div class="flx-align-center">
                <span>总观看时长 (分钟)</span>
                <el-tooltip
                  effect="dark"
                  content="筛选条件内，所有学员观看直播的观看时长之和，按实际开播时间到实际结束时间计算"
                  placement="top"
                >
                  <el-icon class="warn-label" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="outputavgViewDuration" :precision="2" style="border-right: 0; margin-right: 0">
            <template #title>
              <div class="flx-align-center">
                <span>平均观看时长 (分钟)</span>
                <el-tooltip
                  effect="dark"
                  content="筛选条件内，总观看时长/累计总观看人数，按实际开播时间到实际结束时间计算"
                  placement="top"
                >
                  <el-icon class="warn-label" :size="12">
                    <Warning />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="mt10 p5">
      <div class="data-echarts">
        <ECharts :option="option" :key="eChartsKeys" />
      </div>
    </el-card>

    <!--

    <CustTitle class="pt5 pb5">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="kanban" :icon-style="{ width: '15px', height: '15px' }"></SvgIcon>
        </div>
      </template>
      <template #title>点播(回放)数据</template>
    </CustTitle>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>回放总观看人次 (PV)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>回放总观看人数 (UV)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>回放总观看时长 (分钟)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="0" style="border-right: 0; margin-right: 0">
            <template #title>
              <div class="flx-align-center">
                <span>回放平均观看时长 (分钟)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </el-card>
    <CustTitle class="pt5 pb5">
      <template #icon>
        <div class="icon-content" style="background-color: #67b8ff">
          <SvgIcon name="kanban" :icon-style="{ width: '10px', height: '10px' }"></SvgIcon>
        </div>
      </template>
      <template #title>互动数据</template>
    </CustTitle>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>连麦人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>申请连麦人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>发言人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic :value="0" style="border-right: 0; margin-right: 0">
            <template #title>
              <div class="flx-align-center">
                <span>赠送礼物人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </el-card>
    <CustTitle class="pt5 pb5">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="kanban" :icon-style="{ width: '10px', height: '10px' }"></SvgIcon>
        </div>
      </template>
      <template #title>订单数据</template>
    </CustTitle>
    <el-card>
      <el-row>
        <el-col :span="4">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>支付点击人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>未支付人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>购买商品人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>总成交金额 (元)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="0">
            <template #title>
              <div class="flx-align-center">
                <span>商品总销量 (个)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="4">
          <el-statistic :value="0" style="border-right: 0; margin-right: 0">
            <template #title>
              <div class="flx-align-center">
                <span>领取优惠券人数 (人)</span>
                <el-icon style="margin-left: 4px" :size="12">
                  <Warning />
                </el-icon>
              </div>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </el-card>
    <CustTitle class="pt5 pb5">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="statistics" :icon-style="{ width: '15px', height: '15px' }"></SvgIcon>
        </div>
      </template>
      <template #title>数据详情</template>
    </CustTitle>
    <el-table class="cust-table" :data="tableData" height="300">
      <el-table-column prop="uerInfo" label="下单人信息" />
      <el-table-column prop="channel" label="渠道" />
      <el-table-column prop="room" label="直播间" />
      <el-table-column prop="order" label="订单号" />
      <el-table-column prop="orderTime" label="下单时间" />
      <el-table-column prop="good" label="下单商品" />
      <el-table-column prop="goodType" label="商品类型" />
      <el-table-column prop="price" label="商品价格" />
      <el-table-column prop="payPrice" label="实付价格" />
      <el-table-column prop="coupon" label="优惠券" />
      <template #empty>
        <div class="table-empty">
          <slot name="empty">
            <img src="@/assets/images/notData@2x.png" alt="notData" />
            <div>暂无数据</div>
          </slot>
        </div>
      </template>
    </el-table>
    -->
  </div>
  <searchRoomModal ref="searchRoomModalRef" @submit="getAllData" />
</template>

<script setup lang="ts" name="roomStatistics">
import { ECOption } from "@/components/ECharts/config";
import ECharts from "@/components/ECharts/index.vue";
import { useTransition } from "@vueuse/core";
import { getRoomList } from "@/api/modules/room";
import { getOverviewStatistics, getOverviewTrend } from "@/api/modules/home";
import type { CheckboxValueType } from "element-plus";
import searchRoomModal from "./components/searchRoomModal.vue";
import dayjs from "dayjs";
const roomIds = ref<CheckboxValueType[]>([]);
const roomData = ref([]);
const showRoomData = ref([]);
const hiddenRoomData = ref([]);
const option: ECOption = {
  title: {
    text: "直播趋势"
  },
  tooltip: {
    trigger: "axis"
  },
  legend: {
    data: ["在线人数", "发言人数", "订单数", "离线人数", "礼物数量", "消息数量"]
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
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "在线人数",
      type: "line",
      data: []
    },
    {
      name: "发言人数",
      type: "line",
      data: []
    },
    {
      name: "订单数",
      type: "line",
      data: []
    },
    {
      name: "离线人数",
      type: "line",
      data: []
    },
    {
      name: "礼物数量",
      type: "line",
      data: []
    },
    {
      name: "消息数量",
      type: "line",
      data: []
    }
  ]
};
// const tableData = ref([]);
const searchRoomModalRef = ref();
const eChartsKeys = ref(0);
// 数据看板
const pv = ref(0);
const uv = ref(0);
const onlineNum = ref(0);
const greater5Num = ref(0);
const totalViewDuration = ref(0);
const avgViewDuration = ref(0);
// 总观看人次
const outputpv = useTransition(pv, {
  duration: 1500
});
// 总观看人数
const outputliveUv = useTransition(uv, {
  duration: 1500
});
// 在线人数峰值
const outputonlineNum = useTransition(onlineNum, {
  duration: 1500
});
// 停留超5分钟人数
const outputgreater5Num = useTransition(greater5Num, {
  duration: 1500
});
// 总观看时长
const outputtotalViewDuration = useTransition(totalViewDuration, {
  duration: 1500
});
// 平均观看时长
const outputavgViewDuration = useTransition(avgViewDuration, {
  duration: 1500
});
// 获取直播数据
const getStatistics = async () => {
  if (roomIds.value.length == 0) return ElMessage.warning("请选择直播间");
  const res = await getOverviewStatistics(roomIds.value.join(","));
  const data = res.data as any;
  pv.value = data.pv;
  uv.value = data.uv;
  onlineNum.value = data.onlineNum;
  greater5Num.value = data.greater5Num;
  totalViewDuration.value = Number((data.totalViewDuration / 60).toFixed(2));
  avgViewDuration.value = Number((data.avgViewDuration / 60).toFixed(2));
};
// 获取统计数据
const getTrend = async () => {
  if (roomIds.value.length == 0) return ElMessage.warning("请选择直播间");
  const res = await getOverviewTrend(roomIds.value.join(","));
  option.xAxis.data = (res.data || []).map((item: any) => item.statTime);
  option.series[0].data = (res.data || []).map((item: any) => item.onlineNum);
  option.series[1].data = (res.data || []).map((item: any) => item.senderNum);
  option.series[2].data = (res.data || []).map((item: any) => item.orderNum);
  option.series[3].data = (res.data || []).map((item: any) => item.offlineNum);
  option.series[4].data = (res.data || []).map((item: any) => item.giftNum);
  option.series[5].data = (res.data || []).map((item: any) => item.msgNum);
  eChartsKeys.value += 1;
};
const onSearch = () => {
  getStatistics();
  getTrend();
};
const getAllData = (data: any) => {
  roomIds.value = data.map((item: any) => item.value);
  showRoomData.value = data.slice(0, 15);
  hiddenRoomData.value = data.length > 15 ? data.slice(15, data.length) : [];
  onSearch();
};
onActivated(() => {
  eChartsKeys.value += 1;
});
onMounted(() => {
  getRoomList({ page: 1, pageSize: 999 }).then(res => {
    roomData.value = res.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
        livingTime: dayjs(item.livingTime)
      };
    });

    // 当前时间
    const now = dayjs();
    // 初始化一个变量来保存最小的时间差
    let closestTime = roomData.value[0].livingTime;
    let smallestDifference = now.diff(roomData.value[0].livingTime);

    // 遍历时间数组，计算每个时间与当前时间的差值
    roomData.value.forEach(item => {
      const difference = now.diff(item.livingTime);
      // 如果差值是负数，说明给定时间还没过，需要取绝对值
      const absoluteDifference = Math.abs(difference);
      if (absoluteDifference < Math.abs(smallestDifference)) {
        smallestDifference = absoluteDifference;
        closestTime = item.livingTime;
      }
    });

    const defaultRoomList = roomData.value.filter((item: any) => item.livingTime.isSame(dayjs(closestTime)));
    roomIds.value = defaultRoomList.map((item: any) => item.value);
    showRoomData.value = defaultRoomList.slice(0, 15);
    hiddenRoomData.value = defaultRoomList.length > 15 ? defaultRoomList.slice(15, defaultRoomList.length) : [];
    getStatistics();
    getTrend();
  });
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

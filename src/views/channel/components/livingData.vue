<template>
  <div class="table-box p10">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-select v-model="formInline.roomId" @change="handleRoomIdChange" placeholder="请选择直播间" class="w250">
          <el-option v-for="item in roomData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-col>
    </el-row>
    <CustTitle style="margin-top: 20px">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="kanban" :icon-style="{ width: '10px', height: '10px' }"></SvgIcon>
        </div>
      </template>
      <template #title>数据看板</template>
    </CustTitle>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">引流人数</span>
              <div class="card-bg">
                <SvgIcon name="drainage" :icon-style="{ width: '24px', height: '24px', color: '#3370ff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="outputTotalFlowPeople" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">成交金额</span>
              <div class="card-bg">
                <SvgIcon name="deal" :icon-style="{ width: '24px', height: '24px', color: '#3370ff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="outputTotalTransactionAmount" :precision="2" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="card-item">
            <div class="card-head">
              <span class="card-title">分佣金额</span>
              <div class="card-bg">
                <SvgIcon name="commission" :icon-style="{ width: '24px', height: '24px', color: '#3370ff' }"></SvgIcon>
              </div>
            </div>
            <el-statistic :value="outputTotalSubCommission" :precision="2" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <CustTitle style="margin-top: 20px">
      <template #icon>
        <div class="icon-content">
          <SvgIcon name="statistics" :icon-style="{ width: '10px', height: '10px' }"></SvgIcon>
        </div>
      </template>
      <template #title>数据详情</template>
    </CustTitle>
    <div style="height: calc(100vh - 430px)">
      <el-table class="cust-table" :data="tableData" @sort-change="sortChange" height="100%">
        <el-table-column prop="channelName" label="渠道名称" />
        <el-table-column prop="channelId" label="渠道代码" />
        <el-table-column prop="flowPeople" label="引流人数" sortable="custom" :formatter="formatter" />
        <el-table-column prop="transactionAmount" label="成交金额" sortable="custom" :formatter="formatter" />
        <el-table-column prop="commissionRatio" label="分佣比例" :formatter="formatter" />
        <el-table-column prop="subCommission" label="分佣金额" :formatter="formatter" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" link @click="handleView(scope.row)">详情</el-button>
          </template>
        </el-table-column>
        <!-- 无数据 -->
        <template #empty>
          <div class="table-empty">
            <slot name="empty">
              <img src="@/assets/images/notData@2x.png" alt="notData" />
              <div>暂无数据</div>
            </slot>
          </div>
        </template>
      </el-table>
    </div>
    <!-- 直播纬度详情弹窗 -->
    <livingDialog v-model:dialogVisible="dialogTableVisible" :channel-id="formInline.channelId" :room-id="formInline.roomId" />
  </div>
</template>
<script setup lang="ts" name="livingData">
import { ref, onMounted } from "vue";
import { useTransition } from "@vueuse/core";
import { getRoomList } from "@/api/modules/room";
import { numberformat } from "@/utils/index";
import { getLivingDimensionData, getLivingDimensionBoard } from "@/api/modules/channelData";
import CustTitle from "@/components/CustTitle/index.vue";
import livingDialog from "./livingDialog.vue";
const roomData = ref([]);
// 数据看板
const totalFlowPeople = ref(0);
const totalSubCommission = ref(0);
const totalTransactionAmount = ref(0);
// 引流人数
const outputTotalFlowPeople = useTransition(totalFlowPeople, {
  duration: 1500
});
// 分佣金额
const outputTotalSubCommission = useTransition(totalSubCommission, {
  duration: 1500
});
// 成交金额
const outputTotalTransactionAmount = useTransition(totalTransactionAmount, {
  duration: 1500
});
const tableData = ref([]);
const dialogTableVisible = ref(false);
const formInline = reactive({
  roomId: 0,
  channelId: "",
  flow: "",
  amount: "",
  page: 1,
  pageSize: 999
});
// 获取数据
const getDimensionList = async () => {
  const res = await getLivingDimensionData(formInline);
  tableData.value = res.data;
};
// 获取数据看板
const getdimensionStatistics = async () => {
  const res: any = await getLivingDimensionBoard(formInline.roomId);
  totalFlowPeople.value = res.data.totalFlowPeople;
  totalSubCommission.value = res.data.totalSubCommission / 100;
  totalTransactionAmount.value = res.data.totalTransactionAmount / 100;
};
// 表格排序
const sortChange = ({ prop, order }: any) => {
  if (prop === "flowPeople") {
    formInline.flow = order === "ascending" ? "1" : "0";
    formInline.amount = "";
  } else if (prop === "transactionAmount") {
    formInline.amount = order === "ascending" ? "1" : "0";
    formInline.flow = "";
  }
  getDimensionList();
};
const handleView = (row: any) => {
  dialogTableVisible.value = true;
  formInline.channelId = row.channelId;
};
const handleRoomIdChange = () => {
  getDimensionList();
  getdimensionStatistics();
};
const formatter = (row: any, column: any) => {
  if (column.property === "commissionRatio") {
    return row.commissionRatio ? `${row.commissionRatio}%` : "--";
  }
  if (column.property === "subCommission") {
    return numberformat(row.subCommission / 100, 2);
  }
  if (column.property === "transactionAmount") {
    return numberformat(row.transactionAmount / 100, 2);
  }
  if (column.property === "flowPeople") {
    return numberformat(row.flowPeople, 0);
  }
};
onMounted(() => {
  getRoomList({ page: 1, pageSize: 999 }).then(res => {
    roomData.value = res.data;
    formInline.roomId = res.data[0].id;
    getDimensionList();
    getdimensionStatistics();
  });
});
</script>
<style lang="scss" scoped>
.table-box {
  width: auto;
  padding: 0 10px;
}
:deep(.el-statistic__number) {
  font-family: DIN, DIN;
  font-weight: bold;
  font-size: 40px;
  color: #2e2f33;
}
.card-item {
  .card-head {
    display: flex;
    justify-content: space-between;
    .card-title {
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 400;
      font-size: 14px;
      color: #5c5e66;
    }
    .card-bg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      background: rgba(51, 112, 255, 0.1);
      border-radius: 12px;
    }
  }
}

.cust-table {
  --el-text-color-primary: #fff;
  --el-text-color-placeholder: #fff;
  background-color: transparent;
  :deep(.el-table__header-wrapper) {
    border-radius: 16px 16px 0 0;
  }
  :deep(.el-table__body-wrapper) {
    border-radius: 0 0 16px 16px;
  }
  :deep(.el-table__header th) {
    background-color: rgb(51, 112, 255);
  }
}
.w250 {
  width: 250px;
}
</style>

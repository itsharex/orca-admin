<template>
  <el-dialog
    title="直播间数据"
    width="70%"
    :close-on-click-modal="false"
    :before-close="closeDialog"
    v-model="state.dialogTableVisible"
  >
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-auto="false"
      :request-api="getTableList"
      :data-callback="dataCallback"
      height="300"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader> </template>
      <!-- 表格操作 -->
      <template #roomName="scope">
        <div class="column-content">
          <img class="img" src="@/assets/images/logo@2x.png" alt="notData" />
          <span>{{ scope.row.roomName }}</span>
        </div>
      </template>
      <template #beginTime="scope">
        <span>{{ scope.row.beginTime ? dayjs(scope.row.beginTime).format("YYYY-MM-DD HH:mm:ss") : "--" }}</span>
      </template>
      <template #endTime="scope">
        <span>{{ scope.row.endTime ? dayjs(scope.row.endTime).format("YYYY-MM-DD HH:mm:ss") : "--" }}</span>
      </template>
      <template #flowPeople="scope">
        <span>{{ scope.row.flowPeople ? `¥ ${numberformat(scope.row.flowPeople, 0)}` : "--" }}</span>
      </template>
      <template #commissionRatio="scope">
        <span>{{ scope.row.commissionRatio ? `${scope.row.commissionRatio}%` : "--" }}</span>
      </template>
      <template #transactionAmount="scope">
        <span>{{ scope.row.transactionAmount ? `¥ ${numberformat(scope.row.transactionAmount / 100, 2)}` : "--" }}</span>
      </template>
      <template #subCommission="scope">
        <span>{{ scope.row.subCommission ? `¥ ${numberformat(scope.row.subCommission / 100, 2)}` : "--" }}</span>
      </template>
    </ProTable>
  </el-dialog>
</template>
<script lang="ts" setup name="timeDialog">
import dayjs from "dayjs";
import { numberformat } from "@/utils/index";
import { getTimeDimensionDetail } from "@/api/modules/channelData";
import { reactive, watch, nextTick } from "vue";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  channelId: {
    type: String,
    default: ""
  }
});
const emits = defineEmits(["update:dialogVisible"]);
const proTable = ref();
const columns = reactive([
  { prop: "roomName", label: "直播", minWidth: 200 },
  { prop: "beginTime", label: "开始时间", minWidth: 180 },
  { prop: "endTime", label: "结束时间", minWidth: 180 },
  { prop: "flowPeople", label: "引流人数" },
  { prop: "transactionAmount", label: "成交金额" },
  { prop: "commissionRatio", label: "分佣比例" },
  { prop: "subCommission", label: "分佣金额" }
]);
const state = reactive({
  dialogTableVisible: false
});
watch(
  () => props.dialogVisible,
  val => {
    state.dialogTableVisible = val;
    if (val) {
      nextTick(() => {
        proTable.value.getTableList();
      });
    }
  }
);
// 关闭弹窗
const closeDialog = () => {
  emits("update:dialogVisible", false);
};
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  return getTimeDimensionDetail({ ...params, channelId: props.channelId });
};
</script>
<style lang="scss" scoped>
.column-content {
  display: flex;
  align-items: center;
  .img {
    width: 93px;
    height: 52px;
    border-radius: 4px;
    margin-right: 12px;
  }
  span {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #5c5e66;
  }
}
</style>

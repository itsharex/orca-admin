<template>
  <el-dialog
    title="订单数据"
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
      <template #goodsName="scope">
        <div class="column-content">
          <img class="goods-img" :src="scope.row.goodsImage" alt="notData" />
          <span>{{ scope.row.goodsName }}</span>
        </div>
      </template>
      <template #tradeTime="scope">
        <span>{{ scope.row.tradeTime ? dayjs(scope.row.tradeTime).format("YYYY-MM-DD HH:mm:ss") : "--" }}</span>
      </template>
      <template #commissionRatio="scope">
        <span>{{ scope.row.commissionRatio ? `${scope.row.commissionRatio}%` : "--" }}</span>
      </template>
      <template #originalPrice="scope">
        <span>{{ scope.row.originalPrice ? `¥ ${numberformat(scope.row.originalPrice)}` : "--" }}</span>
      </template>
      <template #price="scope">
        <span v-if="scope.row.price">{{ scope.row.price ? `¥ ${numberformat(scope.row.price)}` : "--" }}</span>
      </template>
    </ProTable>
  </el-dialog>
</template>
<script lang="ts" setup name="livingDialog">
import dayjs from "dayjs";
import { numberformat } from "@/utils/index";
import { getOrderInfoList } from "@/api/modules/order";
import { reactive, watch, nextTick } from "vue";
import { GOODSTYPE } from "@/views/goods/constants";
const props = defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  },
  channelId: {
    type: String,
    default: ""
  },
  roomId: {
    type: Number,
    default: 0
  }
});
const emits = defineEmits(["update:dialogVisible"]);
const proTable = ref();
const columns = reactive([
  { prop: "orderNo", label: "订单号", minWidth: 200 },
  { prop: "tradeTime", label: "下单时间", minWidth: 180 },
  { prop: "goodsName", label: "下单商品", minWidth: 140 },
  { prop: "type", label: "商品类型", enum: GOODSTYPE, fieldNames: { label: "name", value: "key" }, minWidth: 120 },
  { prop: "originalPrice", label: "商品价格", minWidth: 100 },
  { prop: "price", label: "实付价格", minWidth: 100 },
  { prop: "userName", label: "下单人", minWidth: 100 },
  { prop: "recipientName", label: "姓名", minWidth: 100 },
  { prop: "recipientPhone", label: "手机号", minWidth: 120 },
  { prop: "recipientAddress", label: "地址", minWidth: 200 },
  { prop: "coupon", label: "优惠券", minWidth: 100 }
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
    list: data.data.map((item: any) => {
      item.originalPrice = item.originalPrice / 100;
      item.price = item.price ? item.price / 100 : "";
      return item;
    }),
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  return getOrderInfoList({ ...params, channelIds: props.channelId, roomId: props.roomId, orderStatus: 2 });
};
</script>
<style lang="scss" scoped>
.column-content {
  display: flex;
  align-items: center;
  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
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
  .goods-img {
    width: 36px;
    height: 36px;
    border-radius: 3px;
    margin-right: 12px;
  }
}
</style>

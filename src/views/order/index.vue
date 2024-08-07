<template>
  <div class="table-box p10 search-content">
    <el-card>
      <el-form label-position="top" ref="ruleFormRef" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="订单日期" prop="orderDate">
          <el-date-picker
            v-model="formInline.orderDate"
            type="date"
            placeholder="选择日期"
            size="default"
            :disabled-date="disabledPastDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            :default-value="new Date()"
            class="w250"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderStatus">
          <el-select v-model="formInline.orderStatus" placeholder="请选择订单状态" class="w250">
            <el-option v-for="item in ORDER_STATUS" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房间号" prop="roomId">
          <el-input v-model="formInline.roomId" placeholder="请输入房间号" class="w250"></el-input>
        </el-form-item>
      </el-form>
      <div class="search-btn mr0">
        <el-button round color="rgba(51,112,255,0.1)" @click="search"> 搜索 </el-button>
        <el-button round @click="reset"> 重置 </el-button>
        <el-button round @click="exportExcel"> 导出 </el-button>
      </div>
    </el-card>
    <ProTable
      ref="proTable"
      :columns="columns"
      :init-param="formInline"
      :request-api="getTableList"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader></template>
      <!-- 表格格式化 -->
      <template #originalPrice="scope">
        <span>{{ scope.row.originalPrice ? `¥ ${numberformat(scope.row.originalPrice / 100, 2)}` : "--" }}</span>
      </template>
      <template #price="scope">
        <span>{{ scope.row.price ? `¥ ${numberformat(scope.row.price / 100, 2)}` : "--" }}</span>
      </template>
      <template #subCommission="scope">
        <span>{{ numberformat(scope.row.subCommission / 100, 2) }}</span>
      </template>
      <template #actualAccountingAmount="scope">
        <span>{{ numberformat(scope.row.actualAccountingAmount / 100, 2) }}</span>
      </template>
      <template #goodsName="scope">
        <div class="column-content">
          <img class="goods-img" :src="scope.row.goodsImage" alt="notData" />
          <span>{{ scope.row.goodsName }}</span>
        </div>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
    </ProTable>
  </div>
</template>
<script setup lang="ts" name="orderList">
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { getOrderInfoList, exportOrderInfoList } from "@/api/modules/order";
import dayjs from "dayjs";
import { channelAll } from "@/api/modules/channelData";
import { Order } from "@/api/interface";
import { ORDER_STATUS } from "./constants";
import { numberformat } from "@/utils/index";
const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Order.OrderInfo>[]>([
  { prop: "orderNo", label: "订单号", width: 200, fixed: "left" },
  { prop: "userName", label: "下单人", width: 100, fixed: "left" },
  { prop: "roomId", label: "房间号", width: 160 },
  { prop: "roomName", label: "房间名称", width: 180 },
  { prop: "orderTime", label: "下单时间", width: 200 },
  { prop: "tradeTime", label: "成交时间", width: 200 },
  { prop: "orderStatus", label: "状态", enum: ORDER_STATUS, fieldNames: { label: "name", value: "key" }, width: 120 },
  { prop: "goodsName", label: "商品名称", width: 300 },
  { prop: "originalPrice", label: "商品原价", width: 140 },
  { prop: "price", label: "商品现价", width: 120 },
  { prop: "recipientName", label: "姓名", width: 100 },
  { prop: "recipientPhone", label: "手机号", width: 200 },
  { prop: "recipientAddress", label: "地址" },
  { prop: "coupon", label: "优惠券", width: 100 },
  { prop: "channelName", label: "渠道名称", width: 100 },
  { prop: "subCommission", label: "分佣金额", width: 100 },
  { prop: "actualAccountingAmount", label: "分账金额", width: 100 }
]);
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getOrderInfoList(newParams);
};
const state = reactive({
  channelIds: []
});
const formInline = reactive({
  page: 1,
  pageSize: 10,
  channelIds: "",
  roomId: "",
  orderStatus: "",
  orderDate: dayjs(new Date()).format("YYYY-MM-DD")
});
const search = () => {
  proTable.value?.search();
};
const reset = () => {
  formInline.channelIds = "";
  formInline.roomId = "";
  formInline.orderStatus = "";
  formInline.orderDate = dayjs(new Date()).format("YYYY-MM-DD");
};
const exportExcel = () => {
  let newParams = JSON.parse(JSON.stringify(formInline));
  exportOrderInfoList(newParams).then(res => {
    let blob = new Blob([res], { type: "application/vnd.ms-excel" }),
      link = document.createElement("a"),
      href = window.URL.createObjectURL(blob);
    link.href = href;
    link.download = dayjs(new Date()).format("YYYY-MM-DD") + "订单列表.xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(href);
  });
};

const getSelectData = async () => {
  const res = await channelAll({});
  const { channelIds } = res.data as any;
  state.channelIds = channelIds;
};
onMounted(() => {
  getSelectData();
});
</script>

<style lang="scss" scoped>
* {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 13px;
}

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
    color: #5c5e66;
  }
  .goods-img {
    width: 36px;
    height: 36px;
    border-radius: 3px;
    margin-right: 12px;
    object-fit: contain;
    border: 1px solid #eee;
  }
}

.table-box {
  height: calc(100vh - 98px);
  overflow: auto;
}

.search-content {
  button {
    color: #3370ff;
    border: 1px solid rgba(51, 112, 255, 0.4);
    font-size: 14px;
  }
}
.w250 {
  width: 250px;
}
</style>

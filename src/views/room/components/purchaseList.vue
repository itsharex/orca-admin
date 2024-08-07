<template>
  <el-row :gutter="20">
    <el-col :span="12" class="card">
      <el-button type="primary" :icon="CirclePlus" @click="saveGoods()">绑定商品</el-button>
      <el-table :data="goodsData" stripe style="width: 100%" class="mt15">
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="优惠价" />
      </el-table>
    </el-col>
    <el-col :span="12">
      <ProTable ref="proTable" :columns="columns" :request-api="getTableList" :data-callback="dataCallback">
        <!-- 表格 header 按钮 -->
        <template #tableHeader="scope">
          <el-button type="primary" :icon="CirclePlus" @click="selectedGoods(scope.selectedList)">选中商品</el-button>
        </template>

        <!-- 菜单图标 -->
        <template #icon="scope">
          <el-icon :size="18">
            <component :is="scope.row.meta.icon"></component>
          </el-icon>
        </template>
      </ProTable>
    </el-col>
  </el-row>
</template>

<script setup lang="ts" name="AccountDrawer">
import { CirclePlus } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
// import { useRoute } from "vue-router";
import { Goods } from "@/api/interface";
import { getGoodsList } from "@/api/modules/goods";

import { extendGoodsItem } from "@/api/modules/extend";
const proTable = ref<ProTableInstance>();
const goodsData = ref<Goods.GoodsList>();

const columns = reactive<ColumnProps<Goods.GoodsList>[]>([
  { type: "selection", width: 80 },
  { prop: "name", label: "商品名称" },

  { prop: "price", label: "优惠价" }
]);
// 保存选中信息
const selectedGoods = async (selectData: string[]) => {
  let newItem = [];
  for (let item of selectData) {
    newItem.push(item);
  }
  goodsData.value = newItem;
  console.log(goodsData.value, "goodsData");
};
// 保存选中信息
const saveGoods = async () => {
  let orgStoreId = userStore.orgId;
  let ids = [];

  for (let item of goodsData.value) {
    ids.push(item.id);
  }
  const newItem = {
    roomId: props.id,
    orgId: orgStoreId,
    goodsLibIds: ids
  };
  await extendGoodsItem(props.id, newItem);
  ElMessage.success({ message: `保存成功！` });
  proTable.value?.getTableList();
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getGoodsList(newParams);
};
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  proTable.value!.isSelected = true;
  proTable.value!.selectedList.push(data.data[0]);
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: 5
  };
};
</script>

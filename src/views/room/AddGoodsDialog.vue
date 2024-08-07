<template>
  <el-dialog v-model="dialogTableVisible" title="添加商品" width="60%">
    <el-input
      v-model="input1"
      style="width: 240px; margin-bottom: 10px"
      size="large"
      placeholder="商品名称"
      :suffix-icon="Search"
    />
    <ProTable
      ref="proTable"
      :pagination="status"
      :columns="columns"
      :request-api="getTableList"
      :data-callback="dataCallback"
      @selection-change="handleSelectionChange"
      :height="800"
    >
      <template #price="scope"> ¥ {{ scope.row.price / 100 }} </template>
      <template #originalPrice="scope"> ¥ {{ scope.row.originalPrice / 100 }}</template>

      <!-- 表格 header 按钮 -->
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
    </ProTable>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogTableVisible = false" round> 取消 </el-button>
        <el-button color="#3370FF" @click="submit" round>确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { Search } from "@element-plus/icons-vue";
import { getGoodsList } from "@/api/modules/goods";
import { Goods } from "@/api/interface";
import { extendGoodsItem } from "@/api/modules/extend";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { GOODSTYPE, GOODS_BOUNDS } from "@/views/goods/constants";
import { useRoute } from "vue-router";
const route = useRoute();
const props = defineProps({
  visible: Boolean,
  getList: Function
});
const roomId = ref();
const idList = ref([]);
const orgStoreId = ref();
const buttonShow = ref(true);
const handleSelectionChange = (val: string[]) => {
  let a = [];
  if (val != "") {
    buttonShow.value = false;
    orgStoreId.value = val[0].orgId;
    val.forEach(item => {
      a.push(item.id);
      idList.value = a;
    });
  } else {
    buttonShow.value = true;
    idList.value = val;
  }
};
const submit = async () => {
  const newItem = {
    roomId: roomId.value,
    orgId: orgStoreId.value,
    goodsLibIds: idList.value
  };
  await extendGoodsItem(roomId.value, newItem).then(() => {
    ElMessage.success({ message: `保存成功！` });
    dialogTableVisible.value = false;
    props.getList(route.params.id);
  });
};
const input1 = ref("");
const emit = defineEmits(["update:visible"]);
// 使用 dialogTableVisible 来存储组件内部的值
const dialogTableVisible = ref(props.visible);
const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Goods.GoodsList>[]>([
  { type: "selection", fixed: "left", width: 50 },
  {
    prop: "img",
    label: "商品图片",
    align: "left",
    width: 100,
    render: scope => {
      return h("img", {
        src: scope.row.img,
        style: "width:52px;height:52px;"
      });
    }
  },
  { prop: "name", label: "商品名称", search: { el: "input" }, align: "left" },
  {
    prop: "goodType",
    label: "商品类型",
    enum: GOODSTYPE,
    fieldNames: { label: "name", value: "key" },
    width: 200,
    align: "left"
  },
  { prop: "bounds", label: "是否限单", enum: GOODS_BOUNDS, fieldNames: { label: "name", value: "key" } },
  { prop: "originalPrice", label: "原价", align: "left", width: 200 },
  { prop: "price", label: "现价(促销价)", align: "left", width: 200 }
  // { prop: "payType", label: "支付类型", enum: PAYTYPE, fieldNames: { label: "name", value: "key" } },
  // { prop: "miniPage", label: "小程序支付跳转链接" },
  // { prop: "jumpPage", label: "跳转链接支付" },
]);
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const status = ref(true);
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  status.value = false;
  newParams.pageSize = 999;
  return getGoodsList(newParams);
};
const dataCallback = (data: any) => {
  let list = [];
  goodsAllData.value.forEach(item => {
    data.data.forEach(val => {
      if (val.id === item.goodsLibId) {
        list.push(val);
      }
    });
    list.forEach(row => {
      proTable.value?.element.toggleRowSelection(row, true);
    });
  });
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
const goodsAllData = ref();
const liveParams = (params: any, data: any) => {
  roomId.value = params;
  goodsAllData.value = data;
};
// 监听外部值的变化，更新内部值
watch(
  () => props.visible,
  newValue => {
    dialogTableVisible.value = newValue;
  }
);

// 监听内部值的变化，触发更新外部值的事件
watch(
  () => dialogTableVisible.value,
  newValue => {
    emit("update:visible", newValue);
  }
);
defineExpose({
  liveParams
});
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
.table-empty {
  line-height: 30px;
}
</style>

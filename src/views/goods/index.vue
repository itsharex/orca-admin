<template>
  <div class="table-box p10 search-content">
    <el-card class="p5">
      <div class="form-tips mb20">上架商品可用于直播间使用，观众可在观看端小黄车中进行下单购买</div>
      <el-form label-position="top" ref="ruleFormRef" :inline="true" :model="formInline" class="flx-justify-between">
        <div class="flx-center">
          <el-form-item label="商品名称" prop="name" style="margin-left: 0; margin-right: 12px">
            <el-input v-model="formInline.name" placeholder="请输入商品名称" style="width: 320px"></el-input>
          </el-form-item>
          <el-form-item label=" " class="search-btn mr0">
            <el-button round color="rgba(51,112,255,0.1)" @click="search"> 搜索 </el-button>
            <el-button round @click="reset"> 重置 </el-button>
          </el-form-item>
        </div>
        <el-form-item label=" " class="add-btn mr0">
          <el-button round type="primary" :icon="Upload" @click="openDrawer('发布')">发布商品</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <ProTable
      ref="proTable"
      :columns="columns"
      :init-param="formInline"
      :request-api="getTableList"
      :data-callback="dataCallback"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader> </template>
      <template #name="scope">
        <div class="column-content">
          <img class="goods-img" :src="scope.row.img" alt="notData" />
          <span>{{ scope.row.name }}</span>
        </div>
      </template>
      <template #originalPrice="scope">
        <span>{{ scope.row.originalPrice ? `¥ ${numberformat(scope.row.originalPrice, 2)}` : "--" }}</span>
      </template>
      <template #price="scope">
        <span>{{ scope.row.price ? `¥ ${numberformat(scope.row.price, 2)}` : "--" }}</span>
      </template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-button type="primary" link @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-popconfirm
          title="你确定要删除吗?"
          :icon="WarningFilled"
          width="250"
          confirm-button-text="删除"
          cancel-button-type="default"
          icon-color="#FF8800"
          @confirm="deleteItem(scope.row)"
        >
          <template #reference>
            <el-button type="primary" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
    </ProTable>
    <GoodsDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="accountList">
import { Upload, WarningFilled } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { getGoodsList, GoodsDelete, addGoods, updateGoods } from "@/api/modules/goods";
import { Goods } from "@/api/interface";
import GoodsDrawer from "./components/GoodsDrawer.vue";
import { GOODSTYPE, PAYTYPE, GOODS_BOUNDS } from "./constants";
import { numberformat } from "@/utils/index";
// ProTable 实例 禁用 INVALID / 正常 (启用) (激活)  VALID
const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Goods.GoodsList>[]>([
  { prop: "name", label: "商品名称", search: { el: "input" }, fixed: "left", width: 280 },
  { prop: "goodType", label: "类型", enum: GOODSTYPE, fieldNames: { label: "name", value: "key" } },
  { prop: "originalPrice", label: "原价" },
  { prop: "price", label: "现价(促销价)" },
  { prop: "payType", label: "支付类型", enum: PAYTYPE, fieldNames: { label: "name", value: "key" } },
  { prop: "bounds", label: "是否限单", enum: GOODS_BOUNDS, fieldNames: { label: "name", value: "key" } },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
]);
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.data.map((good: any) => {
      good.originalPrice = good.originalPrice / 100;
      good.price = good.price ? good.price / 100 : "";
      return good;
    }),
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
const formInline = reactive({
  page: 1,
  pageSize: 10,
  name: ""
});
const search = () => {
  proTable.value?.search();
};
const reset = () => {
  formInline.name = "";
};
// 删除信息
const deleteItem = async (params: Goods.GoodsList) => {
  await useHandleData(GoodsDelete, params.id, `删除商品${params.name}`, "warning", false);
  proTable.value?.getTableList();
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  return getGoodsList(newParams);
};

// 打开 drawer(发布、查看、编辑)
const drawerRef = ref<InstanceType<typeof GoodsDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Goods.GoodsList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "发布" ? addGoods : title === "编辑" ? updateGoods : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
</script>
<style lang="scss" scoped>
* {
  font-family:
    PingFangSC,
    PingFang SC;
  font-size: 13px;
  font-weight: 400;
}

.form-tips {
  color: #8b8e9a;
}

.search-btn {
  :deep(.el-form-item__label) {
    height: 22px;
  }
}
.table-box {
  height: calc(100vh - 98px);
  overflow: auto;
}

.add-btn {
  button {
    font-weight: 600;
    font-size: 14px;
    border: 1px solid rgba(51, 112, 255, 0.4);
  }
}

.search-content {
  .flx-center {
    .search-input {
      width: 320px;
    }
    button {
      color: #3370ff;
      border: 1px solid rgba(51, 112, 255, 0.4);
      font-size: 14px;
    }
  }
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
    width: 52px;
    height: 52px;
    border-radius: 3px;
    margin-right: 12px;
    object-fit: contain;
    border: 1px solid #eee;
  }
}
</style>

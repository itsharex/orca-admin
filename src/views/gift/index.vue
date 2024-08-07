<template>
  <div class="tips mb15 pl6">创建的礼物可用于直播间互动，支持自定义礼物样式</div>
  <el-form class="mb15 pl6" ref="ruleFormRef" label-width="120px" label-position="top" require-asterisk-position="left">
    <el-form-item label="礼物名称">
      <div style="display: flex; width: 100%">
        <el-input v-model="formMarketing.name" placeholder="请输入" clearable style="width: 320px"></el-input>
        <div class="search-btn">
          <el-button round color="rgba(51,112,255,0.1)" @click="search"> 搜索 </el-button>
          <el-button round @click="handleCancel"> 重置 </el-button>
        </div>
        <div class="add-btn">
          <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" round>新增礼物</el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :init-param="formMarketing"
      :columns="columns"
      :request-api="getTableList"
      :data-callback="dataCallback"
    >
      <template #price="scope"> ¥ {{ scope.row.price }} </template>>
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
    <GiftDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="accountList">
import { CirclePlus, WarningFilled } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { getGiftList, GiftDelete, addGift, updateGift } from "@/api/modules/gift";
import { Gift } from "@/api/interface";
import GiftDrawer from "./components/GiftDrawer.vue";
import { GIFT_TYPR } from "./constants";

// ProTable 实例 禁用 INVALID / 正常 (启用) (激活)  VALID
const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Gift.GiftList>[]>([
  {
    prop: "img",
    label: "礼物图片",
    render: scope => {
      return h("img", {
        src: scope.row.img,
        style: "width:30px;height:30px;"
      });
    }
  },
  { prop: "name", label: "礼物名称", search: { el: "input" } },

  { prop: "price", label: "价格" },
  { prop: "giftType", label: "类型", enum: GIFT_TYPR, fieldNames: { label: "name", value: "key" } },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
]);
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.data.map((gift: any) => {
      gift.price = gift.price / 100;
      return gift;
    }),
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
const handleCancel = () => {
  formMarketing.name = null;
};
// 删除信息
const deleteItem = async (params: Gift.GiftList) => {
  await useHandleData(GiftDelete, params.id, `删除礼物${params.name}`, "warning", false);
  proTable.value?.getTableList();
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  return getGiftList(newParams);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof GiftDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Gift.GiftList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row, price: row.price ? row.price : 0 },
    api: title === "新增" ? addGift : title === "编辑" ? updateGift : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};
const formMarketing = reactive({
  page: 1,
  pageSize: 10,
  name: null
});
const search = () => {
  proTable.value?.search();
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

.tips {
  margin-top: 10px;
  color: #8b8e9a;
}

.add-btn {
  width: 50%;
  text-align: end;
  button {
    font-size: 14px;
    border: 1px solid rgba(51, 112, 255, 0.4);
  }
}

.search-btn {
  width: 50%;
  margin-left: 10px;
  button {
    color: #3370ff;
    border: 1px solid rgba(51, 112, 255, 0.4);
    font-size: 14px;
  }
}
.table-box {
  height: calc(100vh - 300px);
  overflow: auto;
}
</style>

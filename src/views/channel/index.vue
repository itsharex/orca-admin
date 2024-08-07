<template>
  <div class="table-box p10">
    <el-card>
      <el-form label-position="top" ref="ruleFormRef" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="渠道名称" prop="channelName">
          <el-select v-model="formInline.channelName" placeholder="请选择渠道名称" class="w250">
            <el-option v-for="item in state.channelNames" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分佣比例" prop="commissionRatio">
          <el-select v-model="formInline.commissionRatio" placeholder="请选择分佣比例" class="w250">
            <el-option v-for="item in state.ratios" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分佣方式" prop="commissionMethod">
          <el-select v-model="formInline.commissionMethod" placeholder="请选择分佣方式" class="w250">
            <el-option v-for="item in SHAARING_WAY" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分佣周期" prop="commissionPeriod">
          <el-select v-model="formInline.commissionPeriod" placeholder="请选择分佣周期" class="w250">
            <el-option v-for="item in SHAARING_CYCLE" :key="item.key" :label="item.name" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display: flex; width: 100%">
        <div class="search-btn">
          <el-button round color="rgba(51,112,255,0.1)" @click="search"> 搜索 </el-button>
          <el-button round @click="reset"> 重置 </el-button>
        </div>
        <div class="add-btn">
          <el-button round type="primary" :icon="Plus" @click="openDrawer('新增')">新增渠道</el-button>
        </div>
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
      <!-- 表格操作 -->
      <template #commissionRatio="scope">
        <span>{{ scope.row.commissionRatio ? `${scope.row.commissionRatio}%` : "--" }}</span>
      </template>
      <template #operation="scope">
        <el-button v-if="scope.row.sysInner != 1" type="primary" link @click="openDrawer('编辑', scope.row)">编辑</el-button>
        <el-popconfirm
          v-if="scope.row.sysInner != 1"
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
    <ChannelDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="channelList">
import { Plus, WarningFilled } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { getChannelList, ChannelDelete, addChannel, updateChannel, getSelectList } from "@/api/modules/channel";
import { Channel } from "@/api/interface";
import ChannelDrawer from "./components/ChannelDrawer.vue";
import { SHAARING_WAY, SHAARING_CYCLE } from "./constants";
const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Channel.ChannelList>[]>([
  { prop: "channelName", label: "渠道名称" },
  { prop: "channelId", label: "渠道ID" },
  { prop: "channelOwner", label: "负责人" },
  { prop: "contactPhone", label: "联系方式" },
  { prop: "commissionRatio", label: "分佣比例" },
  { prop: "commissionMethod", label: "分佣方式", enum: SHAARING_WAY, fieldNames: { label: "name", value: "key" } },
  { prop: "commissionPeriod", label: "分佣周期", enum: SHAARING_CYCLE, fieldNames: { label: "name", value: "key" } },
  { prop: "operation", label: "操作", width: 280, fixed: "right" }
]);
// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total && pageNum && pageSize 这些字段，可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
// 删除信息
const deleteItem = async (params: Channel.ChannelList) => {
  await useHandleData(ChannelDelete, params.channelId, `删除渠道${params.channelName}`, "warning", false);
  proTable.value?.getTableList();
  getSelectData();
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  return getChannelList(newParams);
};
const state = reactive({
  channelNames: [],
  ratios: []
});
const formInline = reactive({
  page: 1,
  pageSize: 10,
  channelName: "",
  commissionRatio: "",
  commissionMethod: "",
  commissionPeriod: ""
});
const search = () => {
  proTable.value?.search();
};
const reset = () => {
  formInline.channelName = "";
  formInline.commissionRatio = "";
  formInline.commissionMethod = "";
  formInline.commissionPeriod = "";
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof ChannelDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Channel.ChannelList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addChannel : title === "编辑" ? updateChannel : undefined,
    getTableList: () => {
      proTable.value?.getTableList();
      getSelectData();
    }
  };
  drawerRef.value?.acceptParams(params);
};
const getSelectData = async () => {
  const res = await getSelectList({});
  const { channelNames, ratios } = res.data as any;
  state.channelNames = channelNames;
  state.ratios = ratios;
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

.table-box {
  height: calc(100vh - 98px);
  overflow: auto;
}

.add-btn {
  width: 50%;
  text-align: end;
  button {
    border: 1px solid rgba(51, 112, 255, 0.4);
    font-size: 14px;
  }
}

.search-btn {
  width: 50%;
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

<template>
  <div class="table-box p10">
    <el-card>
      <el-form label-position="top" ref="ruleFormRef" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="直播名称" prop="name">
          <el-input v-model="formInline.name" placeholder="直播名称" class="w250"></el-input>
        </el-form-item>
        <el-form-item label="直播类型" prop="videoType">
          <el-select v-model="formInline.videoType" placeholder="直播类型" class="w250">
            <el-option v-for="item in LIVETYPE" :key="item.key" :label="item.tip" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="display: flex; width: 100%">
        <div class="search-btn">
          <el-button round color="rgba(51,112,255,0.1)" @click="search"> 搜索 </el-button>
          <el-button round @click="reset"> 重置 </el-button>
        </div>
        <div class="add-btn">
          <el-button round :icon="Plus" color="#3370FF" @click="openDrawer('新增')">新建直播</el-button>
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
      <template #videoType="scope">
        <div v-if="scope.row.videoType == 1" style="display: flex">
          <div style="margin-right: 10px">
            <img style="width: 25px" src="@/assets/images/simulcast.svg" alt="notData" />
          </div>
          <div>实况直播</div>
        </div>
        <div v-if="scope.row.videoType == 2" style="display: flex">
          <div style="margin-right: 10px">
            <img style="width: 25px" src="@/assets/images/record.svg" alt="notData" />
          </div>
          <div>录像直播</div>
        </div>
      </template>
      <template #mobileLayout="scope">
        <table v-if="scope.row.mobileLayout == 1">
          <tr>
            <td style="width: 30px">
              <img style="width: 25px" src="@/assets/images/portraitScreen@2x.png" alt="notData" />
            </td>
            <td style="text-align: left">竖屏</td>
          </tr>
        </table>
        <table v-if="scope.row.mobileLayout == 2">
          <tr>
            <td style="width: 30px">
              <img style="width: 25px" src="@/assets/images/two_screen@2x.png" alt="notData" />
            </td>
            <td style="text-align: left">二分屏</td>
          </tr>
        </table>
        <table v-if="scope.row.mobileLayout == 3">
          <tr>
            <td style="width: 30px">
              <img style="width: 25px" src="@/assets/images/three_screen@2x.png" alt="notData" />
            </td>
            <td style="text-align: left">三分屏</td>
          </tr>
        </table>
      </template>
      <template #livingStatus="scope">
        <div v-if="scope.row.livingStatus == 0">
          <el-button type="success" plain disabled>直播中</el-button>
        </div>
        <div v-if="scope.row.livingStatus == 1">
          <el-button type="info" plain disabled>未开播</el-button>
        </div>
      </template>
      <!-- 表格 header 按钮 -->
      <template #tableHeader> </template>
      <!-- 表格操作 -->
      <template #livingTime="scope">
        <span v-if="scope.row.livingTime">{{ dayjs(scope.row.livingTime).format("YYYY-MM-DD HH:mm:ss") || "--" }}</span>
        <span v-else>--</span>
      </template>
      <template #name="scope">
        <el-row :gutter="20">
          <el-col :span="10"
            ><div>
              <img
                class="img"
                src="@/assets/images/default@2x.png"
                alt="notData"
                v-if="scope.row.cover == null || scope.row.cover == ''"
              />
              <img class="img" :src="scope.row.cover" alt="notData" v-else /></div
          ></el-col>
          <el-col :span="12"
            ><div>
              <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
                {{ scope.row.name }}
              </el-tooltip>
            </div>
            <div style="color: #ff8800" v-if="scope.row.permissionType == 1">免费</div>
            <div style="color: #ff8800" v-if="scope.row.permissionType == 2">¥ {{ scope.row.permissionJson }}</div>
            <div style="color: #ff8800" v-if="scope.row.permissionType == 3">密码 {{ scope.row.permissionJson }}</div>
          </el-col>
        </el-row>
      </template>
      <template #operation="scope">
        <el-button type="primary" link @click="openLive(scope.row)">开播</el-button>
        <el-button type="primary" link @click="openEdit(scope.row)">配置</el-button>
        <el-button type="primary" link @click="openShare(scope.row)">分享</el-button>
        <el-button type="primary" link @click="openData(scope.row)">数据</el-button>
        <el-popover v-if="scope.row.livingStatus" placement="bottom-end" width="320px">
          <template #reference>
            <el-button type="primary" link :disabled="!scope.row.livingStatus">删除 </el-button>
          </template>
          <div class="titleClass">
            <span>
              <el-icon color="#FF8800" style="margin-right: 5px"><WarningFilled /></el-icon>你确定要删除吗</span
            >
          </div>
          <div class="deletClass">当前直播间为“{{ scope.row.name }}”,删除后，直播数据也将同步删除（回放视频将保留）</div>
          <div style="margin-top: 10px; text-align: end">
            <el-button size="small" @click="cancelEvent" round>取消 </el-button>
            <el-button size="small" type="primary" @click="confirmEvent(scope.row)" round>确定 </el-button>
          </div>
        </el-popover>
        <el-tooltip content="该直播间正在直播" effect="customized" v-else>
          <el-button type="primary" link :disabled="!scope.row.livingStatus">删除 </el-button>
        </el-tooltip>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
    </ProTable>
    <RoomDrawer ref="drawerRef" />
    <!-- <DialogEditPage :id="roomId" v-model:visible="dialogVisible" ref="dialogRef" /> -->
    <PlayVideo v-model:visible="playVideoVisible" ref="playVideoRef" @update="search" />
    <DialogShare v-model:visible="dialogShareVisible" ref="dialogShareRef" />
  </div>
</template>

<script setup lang="ts" name="accountList">
import { Plus } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import dayjs from "dayjs";
import { getRoomList, RoomDelete } from "@/api/modules/room";
import { Room } from "@/api/interface";
import RoomDrawer from "./components/RoomDrawer.vue";
import { LIVESTATUS, LIVETYPE } from "./constants";
import PlayVideo from "./PlayVideo.vue";
import DialogShare from "./ChannelShareDialog.vue";
import { useRouter } from "vue-router";
import type { FormInstance } from "element-plus";
const ruleFormRef = ref<FormInstance>();

const router = useRouter();

const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Room.RoomList>[]>([
  { prop: "name", label: "直播名称", width: 260, showOverflowTooltip: false, fixed: "left" },
  { prop: "id", label: "房间号", copy: true, fixed: "left" },
  { prop: "videoType", label: "直播类型", search: { el: "select" } },
  { prop: "mobileLayout", label: "直播模式", width: 200 },
  {
    prop: "livingStatus",
    label: "直播状态",
    enum: LIVESTATUS,
    search: { el: "select" },
    fieldNames: { label: "name", value: "key" }
  },
  { prop: "livingTime", label: "开始时间", copy: true },
  { prop: "operation", label: "操作", width: 250, fixed: "right" }
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
let roomId = ref(0);
// const dialogRef = ref();
const playVideoRef = ref();
const dialogShareRef = ref();
// 创建一个 ref 变量，用于控制弹框的显示和隐藏
// const dialogVisible = ref(false);
const playVideoVisible = ref(false);
const dialogShareVisible = ref(false);

const openEdit = async (row: Partial<Room.RoomList> = {}) => {
  roomId.value = row.id;
  // dialogRef.value.getList(row.id);
  // dialogVisible.value = true;
  router.push(`./edit/${row.id}/${row.name}`);
};
const openShare = (row: Partial<Room.RoomList> = {}) => {
  dialogShareVisible.value = true;
  dialogShareRef.value.getList(row);
};
const openData = async (row: Partial<Room.RoomList> = {}) => {
  router.push({
    path: "/room/statistics",
    params: {
      roomId: row.id
    }
  });
};
const openLive = async (row: Partial<Room.RoomList> = {}) => {
  const params = {
    livingType: row.livingType,
    livingName: row.name,
    roomId: row.id,
    livingStatus: row.livingStatus,
    anchorPwd: row.anchorPwd,
    assistantPwd: row.assistantPwd,
    sharePwd: row.sharePwd,
    livingTime: row.livingTime,
    remark: row.remark,
    getTableList: proTable.value?.getTableList
  };

  playVideoRef.value.getList(row.id);

  playVideoVisible.value = true;
  playVideoRef.value.liveParams(params);

  // router.push(`./edit/${row.id}`);
};

const confirmEvent = async (params: Room.RoomList) => {
  await RoomDelete(params.id);
  proTable.value?.getTableList();
};
const cancelEvent = () => {
  ElMessage("已取消");
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  return getRoomList(newParams);
};
const formInline = reactive({
  page: 1,
  pageSize: 10,
  livingStatus: "",
  videoType: "",
  name: ""
});
const search = () => {
  proTable.value?.search();
};
const reset = () => {
  formInline.livingStatus = "";
  formInline.videoType = "";
  formInline.name = "";
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof RoomDrawer> | null>(null);

//title: string, row: Partial<Room.RoomList> = {}
const openDrawer = async () => {
  router.push(`./add`);
};
</script>

<style scoped lang="scss">
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

.el-col {
  text-align: left;
}
.img {
  width: 96px;
  height: 52px;
  border-radius: 4px;
  object-fit: contain;
  border: 1px solid #eee;
}
.titleClass {
  height: 20px;
  font-size: 14px;
  font-style: normal;
  line-height: 20px;
  color: #2e2f33;
  text-align: left;
}
.deletClass {
  height: 36px;
  margin-top: 10px;
  font-style: normal;
  line-height: 18px;
  color: #8b8e9a;
  text-align: left;
}

.w250 {
  width: 250px;
}
</style>

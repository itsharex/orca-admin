<template>
  <div class="table-box pt5">
    <el-card body-style="padding-bottom:0">
      <div class="form-tips mb20">本地上传的视频将在此页面展示，可用于录播直播</div>
      <el-form label-position="top" ref="ruleFormRef" :inline="true" :model="formInline" class="flx-justify-between">
        <div class="flx-center">
          <el-form-item label="视频名称" prop="name" class="mr12">
            <el-input v-model="formInline.name" placeholder="请输入视频名称" style="width: 320px"></el-input>
          </el-form-item>
          <el-form-item label=" " class="search-btn mr0">
            <el-button round color="rgba(51,112,255,0.1)" @click="search"> 搜索 </el-button>
            <el-button round @click="reset"> 重置 </el-button>
          </el-form-item>
        </div>
        <el-form-item label=" " class="add-btn mr0">
          <el-button round :icon="Refresh" @click="reset"></el-button>
          <el-button round type="primary" :icon="Upload" @click="openDrawer('上传')">上传视频</el-button>
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
      <template #tableHeader></template>
      <!-- 表格操作 -->
      <template #operation="scope">
        <el-popconfirm
          title="你确定要删除吗?"
          :icon="WarningFilled"
          width="250"
          confirm-button-text="删除"
          cancel-button-type="default"
          icon-color="#FF8800"
          @confirm="deleteVideo(scope.row)"
        >
          <template #reference>
            <el-button type="primary" link>删除</el-button>
          </template>
        </el-popconfirm>
      </template>
      <template #name="scope">
        <div class="video-content">
          <img v-if="scope.row.image" :src="scope.row.image" alt="" />
          <img v-else src="@/assets/images/default@2x.png" alt="" />
          <div class="video-info">
            <span>{{ scope.row.name }}</span>
          </div>
        </div>
      </template>
      <template #duration="scope"> {{ formatted(scope.row.duration) }} </template>
      <template #capacity="scope">
        {{ scope.row.capacity ? `${Number(scope.row.capacity / 1048576).toFixed(0)}MB` : "--" }}
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
    </ProTable>
    <VideoDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts" name="localVideo">
import { Upload, Refresh, WarningFilled } from "@element-plus/icons-vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { getVideoList, uploadVideo, VideoDelete } from "@/api/modules/video";
import { Video } from "@/api/interface";
import VideoDrawer from "./VideoDrawer.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
// ProTable 实例 禁用 INVALID / 正常 (启用) (激活)  VALID
const proTable = ref<ProTableInstance>();
const columns = reactive<ColumnProps<Video.VideoList>[]>([
  { prop: "name", label: "视频名称", width: 400 },
  { prop: "duration", label: "时长" },
  { prop: "capacity", label: "大小" },
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
const formatted = (seconds: any) => {
  if (!seconds) return "--";
  return dayjs.duration(seconds, "seconds").format("HH:mm:ss");
};
// 删除信息
const deleteVideo = async (params: Video.VideoList) => {
  await useHandleData(VideoDelete, params.id, `删除本地视频${params.name}`, "warning", false);
  proTable.value?.getTableList();
};
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  return getVideoList(newParams);
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof VideoDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<Video.VideoList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "上传" ? uploadVideo : undefined,
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
  font-weight: 400;
  font-size: 13px;
}
.form-tips {
  font-size: 14px;
  color: #8b8e9a;
}

.add-btn {
  text-align: end;
  color: #fff;
  button {
    border: 1px solid rgba(51, 112, 255, 0.4);
    font-size: 14px;
  }
}

.search-btn {
  margin-left: 10px;
  button {
    color: #3370ff;
    border: 1px solid rgba(51, 112, 255, 0.4);
    font-size: 14px;
  }
  :deep(.el-form-item__label) {
    height: 22px;
  }
}

.video-content {
  display: flex;
  justify-content: space-between;
  img {
    width: 100px;
    height: 52px;
    border-radius: 3px;
  }
  .video-info {
    width: calc(100% - 112px);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    span {
      color: #5c5e66;
    }
  }
}
</style>

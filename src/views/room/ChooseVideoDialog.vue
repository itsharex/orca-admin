<template>
  <el-dialog v-model="dialogTableVisible" title="添加视频" width="800" style="border-radius: 10px">
    <template #header></template>
    <el-form label-position="top" ref="ruleFormRef" :inline="true" :model="formInline" class="flx-justify-between">
      <div class="flx-center">
        <el-form-item style="margin-top: 10px">
          <el-input v-model="formInline.name" placeholder="请输入视频名称" :suffix-icon="Search"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <ProTable
      ref="proTable"
      :columns="columns"
      :init-param="formInline"
      :request-api="getTableList"
      :data-callback="dataCallback"
      height="300px"
    >
      <!-- 表格 header 按钮 -->
      <template #name="scope">
        <div class="video-content">
          <img v-if="scope.row.image" :src="scope.row.image" alt="" />
          <img v-else src="@/assets/images/default@2x.png" alt="" />
          <div class="video-info">
            <!-- <span>{{ scope.row.fileName }}</span> -->
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
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogTableVisible = false" round> 取消 </el-button>
        <el-button type="primary" @click="submit" round>确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { getVideoList } from "@/api/modules/video";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { Search } from "@element-plus/icons-vue";
import { Video } from "@/api/interface";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
const props = defineProps({
  visible: Boolean
});
const proTable = ref<ProTableInstance>();
const formInline = reactive({
  page: 1,
  pageSize: 10,
  name: ""
});
const formatted = (seconds: any) => {
  if (!seconds) return "--";
  return dayjs.duration(seconds, "seconds").format("HH:mm:ss");
};
const radioList = reactive({});
const submit = async () => {
  console.log(proTable.value?.tableData);
  proTable.value?.tableData.forEach(item => {
    if (proTable.value?.radio == item.id) {
      radioList.value = item;
    }
  });

  dialogTableVisible.value = false;
  emit("update", radioList.value);
};
const emit = defineEmits(["update:visible", "update"]);
// 使用 dialogTableVisible 来存储组件内部的值
const dialogTableVisible = ref(props.visible);

const columns = reactive<ColumnProps<Video.VideoList>[]>([
  { type: "radio", fixed: "left", width: 50 },
  { prop: "name", label: "视频名称", width: 400 },
  { prop: "duration", label: "时长" },
  { prop: "capacity", label: "大小" }
]);
// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  console.log(newParams, "newParams");
  return getVideoList(newParams);
};
const dataCallback = (data: any) => {
  return {
    list: data.data,
    total: data.total,
    pageNum: data.page,
    pageSize: data.pageSize
  };
};
const liveParams = () => {
  const params = {
    page: 1,
    pageSize: 10
  };
  getTableList(params);
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
watch(
  () => proTable.value?.radio,
  () => proTable.value?.radio && ElMessage.success(`选中【${proTable.value?.radio}】的`)
);
defineExpose({
  liveParams
});
</script>

<style scoped lang="scss">
* {
  font-family: PingFangSC, "PingFang SC";
}
.demo-tabs > .el-tabs__content {
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
.table-empty {
  line-height: 30px;
}
.form-tips {
  font-family: PingFangSC, "PingFang SC";
  font-size: 14px;
  font-weight: 400;
  color: #8b8e9a;
}
.search-btn {
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
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: calc(100% - 112px);
    span {
      font-family: PingFangSC, "PingFang SC";
      font-size: 12px;
      font-weight: 400;
      line-height: 50px;
      color: #5c5e66;
    }
  }
}
</style>

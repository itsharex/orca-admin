<template>
  <div class="search-content">
    <el-dialog v-model="dialogTableVisible" title="筛选直播">
      <el-form label-position="top" ref="ruleFormRef" class="sb-form mt5" :inline="true" :model="formInline">
        <div class="flx-center">
          <el-form-item label="直播名称" prop="name">
            <el-input class="search-input" v-model="formInline.name" placeholder="请输入直播名称"></el-input>
          </el-form-item>
          <el-form-item class="search-btn mb0">
            <el-button round color="rgba(51,112,255,0.1)" @click="getDataList(true)"> 搜索 </el-button>
            <el-button round @click="reset"> 重置 </el-button>
          </el-form-item>
        </div>
      </el-form>
      <el-row class="mt5">
        <el-col :span="12" class="check-panel">
          <template v-if="roomData.length">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"> 全选 </el-checkbox>
            <el-checkbox-group v-model="checkedRoom" @change="handleCheckedRoomsChange">
              <el-checkbox v-for="item in roomData" :key="item.value" :label="item.label" :value="item.value">
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <div v-else class="table-empty">
            <img src="@/assets/images/notData@2x.png" alt="notData" width="80" height="80" />
            <div>暂无数据</div>
          </div>
        </el-col>
        <el-col :span="12" class="check-panel">
          <div class="choose-content">
            <div class="choose-title flx-justify-between">
              <span>已选择</span>
              <span @click="handleClear">清除已选</span>
            </div>
            <div class="choose-list">
              <div v-for="item in sb(checkedRoom)" :key="item.value" class="choose-item flx-justify-between">
                <span>{{ item.label }}</span>
                <el-icon @click="handleDelete(item)" size="12" color="#B9BECD" class="cursor-pointer"><CloseBold /></el-icon>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogTableVisible = false" round> 取消 </el-button>
          <el-button type="primary" round @click="handleSubmit">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { getRoomList } from "@/api/modules/room";
const dialogTableVisible = ref(false);
const formInline = reactive({
  name: ""
});
const emit = defineEmits(["submit"]);
const ruleFormRef = ref();
const checkAll = ref(false);
const isIndeterminate = ref(true);
const checkedRoom = ref([]);
const roomData = ref([]);

const handleCheckAllChange = (val: boolean) => {
  checkedRoom.value = val ? roomData.value.map(item => item.value) : [];
  isIndeterminate.value = false;
};
const handleCheckedRoomsChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === roomData.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < roomData.value.length;
};
const handleClear = () => {
  checkedRoom.value = [];
  checkAll.value = false;
  isIndeterminate.value = false;
};
const handleDelete = (item: any) => {
  checkedRoom.value.splice(checkedRoom.value.indexOf(item.value), 1);
  handleCheckedRoomsChange(checkedRoom.value);
};
const sb = data => {
  let list: any = [];
  data.forEach((item: any) => {
    roomData.value.forEach(item2 => {
      if (item === item2.value) {
        list.push(item2);
      }
    });
  });
  return list;
};
const handleSubmit = () => {
  if (checkedRoom.value.length === 0) {
    ElMessage.warning("请选择直播间");
    return;
  }
  emit("submit", sb(checkedRoom.value));
  dialogTableVisible.value = false;
};
const open = (roomIds: any) => {
  checkedRoom.value = roomIds;
  formInline.name = "";
  getDataList();
  dialogTableVisible.value = true;
};
const reset = () => {
  formInline.name = "";
  getDataList(true);
};
const getDataList = (clear: boolean = false) => {
  getRoomList({ name: formInline.name, page: 1, pageSize: 999 }).then(res => {
    roomData.value = res.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name
      };
    });
    if (clear) {
      checkedRoom.value = [];
    }
  });
};
defineExpose({ open });
</script>

<style lang="scss" scoped>
.search-content {
  .flx-center {
    .search-input {
      width: 320px;
    }
    button {
      color: #3370ff;
      border: 1px solid rgba(51, 112, 255, 0.4);
      font-weight: 600;
    }
  }

  .check-panel {
    height: calc(100vh - 600px);
    overflow-y: scroll;
    overflow-x: hidden;
  }

  :deep(.el-dialog__header) {
    // padding-left: 0 !important;
  }
  :deep(.el-checkbox-group) {
    display: flex;
    flex-direction: column;
  }
  :deep(.el-col) {
    border: 1px solid #dfe4ee;
    padding: 12px;
  }
  :deep(.el-checkbox__label) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .sb-form {
    background-color: #f8f9fd;
    padding-left: 10px;
    padding-top: 10px;
  }
  .choose-title {
    span {
      &:first-of-type {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 600;
        font-size: 14px;
        color: #2e2f33;
      }
      &:last-of-type {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        font-size: 12px;
        color: #3370ff;
        cursor: pointer;
      }
    }
  }
  .choose-list {
    .choose-item {
      line-height: 32px;

      span {
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 400;
        font-size: 14px;
        color: #5c5e66;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
}

.table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  div {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #8b8e9a;
    margin-top: 4px;
  }
}
</style>

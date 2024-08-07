<template>
  <!-- <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}视频`"> -->
  <el-dialog v-model="drawerVisible" :title="`${drawerProps.title}视频`" :close-on-click-modal="false" width="800">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-position="left"
      require-asterisk-position="left"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
      style="margin-top: 10px"
    >
      <!-- <el-form-item label="机构ID" prop="orgId">
        <el-input v-model="drawerProps.row!.orgId" placeholder="请填写机构ID" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="媒体名称" prop="name">
        <el-input
          v-model="drawerProps.row!.name"
          maxlength="12"
          show-word-limit
          placeholder="请填写媒体名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="媒体文件" prop="file" style="margin-bottom: 35px">
        <div class="upload-content">
          <el-upload
            action=""
            drag
            :show-file-list="false"
            :before-upload="beforeUpload"
            ref="upload"
            :limit="1"
            :on-exceed="handleExceed"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖拽至此处，或点击<em>选择文件</em></div>
            <template #tip>
              <div class="el-upload__tip">支持上传5GB以内的MP4格式视频</div>
            </template>
          </el-upload>
          <ul class="el-upload-list el-upload-list--text">
            <li
              v-for="(file, index) in drawerProps.row!.uploadFiles"
              :key="file.fileId"
              class="el-upload-list__item is-success"
              :tabindex="index"
            >
              <div class="el-upload-list__item-info">
                <a class="el-upload-list__item-name">
                  <el-icon><Document /></el-icon>
                  <span class="el-upload-list__item-file-name" :title="file.fileName">{{ file.fileName }}</span></a
                >
                <el-progress
                  v-if="file.progress != 100"
                  :text-inside="true"
                  :percentage="file.progress"
                  :stroke-width="16"
                  striped
                  striped-flow
                  style="width: 96%; margin-top: 10px"
                />
              </div>
              <label class="el-upload-list__item-status-label">
                <el-icon v-if="file.progress == 100" class="el-icon el-icon--upload-success el-icon--circle-check"
                  ><CircleCheck /></el-icon
              ></label>
              <el-icon v-if="file.progress == 100" @click="removeFile" class="el-icon el-icon--close"><Close /></el-icon>
            </li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button round v-show="!drawerProps.isView" @click="handleCancel">取消</el-button>
      <el-button round v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
  <!-- </el-drawer> -->
</template>

<script setup lang="ts" name="VideoDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { UploadProps, UploadInstance } from "element-plus";
import { Video } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import { uploadFile } from "@/utils/sliceUpload/sliceUpload";
const userStore = useUserStore();
const upload = ref<UploadInstance>();
const rules = reactive({
  name: [{ required: true, message: "请输入" }],
  file: [
    {
      required: true,
      message: "请选择文件",
      validator: (rule, value, callback) => {
        if (drawerProps.value.row.uploadFiles && drawerProps.value.row.uploadFiles.length > 0) {
          callback();
        } else {
          callback(new Error("请选择文件"));
        }
      }
    }
  ]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Video.VideoList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const beforeUpload = (file: any) => {
  const isMP4 = file.type === "video/mp4";
  const maxSize = 5 * 1024 * 1024 * 1024;
  if (!isMP4) {
    ElMessage.warning("只能上传MP4格式的视频！");
    return false;
  }
  if (file.size > maxSize) {
    ElMessage.warning("视频大小不能超过5G！");
    return false;
  }
  drawerProps.value.row.uploadFiles = [];
  uploadFile(file, onProgress);
  return false;
};
const removeFile = () => {
  ElMessageBox.confirm("确定要删除该视频文件吗?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    drawerProps.value.row.uploadFiles = [];
  });
};
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
const onProgress = (response: any) => {
  if (response.cancel) {
    drawerProps.value.row.uploadFiles = [];
  } else {
    drawerProps.value.row.uploadFiles[0] = { ...response };
    ruleFormRef.value!.validateField("file", () => {
      return true;
    });
  }
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const orgStoreId = userStore.orgId;
      const { progress, fileId, bucket, key } = drawerProps.value.row.uploadFiles[0];
      if (progress != 100) {
        return ElMessage.warning("请等待文件上传完成");
      }
      const data = {
        orgId: orgStoreId,
        name: drawerProps.value.row.name,
        fileId: fileId,
        bucket: bucket,
        pathName: key
      };
      await drawerProps.value.api!(data);
      ElMessage.success({ message: `${drawerProps.value.title}视频成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};
const handleCancel = () => {
  drawerVisible.value = false;
};
const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  console.log(files, uploadFiles);
  ElMessage.warning(`一次只能上传 1 个文件`);
};

defineExpose({
  acceptParams
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
.upload-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>

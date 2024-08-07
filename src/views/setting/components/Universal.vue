<template>
  <el-form
    ref="ruleFormRef"
    label-width="120px"
    label-position="top"
    require-asterisk-position="left"
    :rules="rules"
    :model="formData"
  >
    <el-row :gutter="12">
      <el-col :span="6">
        <el-form-item label="机构名称" prop="name">
          <el-input
            v-model="formData.name"
            maxlength="12"
            show-word-limit
            placeholder="请填写机构名称"
            clearable
          ></el-input> </el-form-item
      ></el-col>
      <el-col :span="24">
        <el-form-item label="机构Logo" prop="orgLogo">
          <ImageUpload
            v-model:value="formData.orgLogo"
            text="建议上传图片比例为1:1，大小2M以内，支持JPG、JPEG、PNG格式"
            :show-extra-btn="true"
          /> </el-form-item
      ></el-col>
      <el-col :span="12">
        <el-form-item label="直播间公告" prop="notice" class="notice-item">
          <el-input
            v-model="formData.notice"
            maxlength="100"
            :autosize="{ minRows: 4, maxRows: 4 }"
            placeholder="请输入"
            show-word-limit
            type="textarea"
          />
          <span class="notice-tips" @click="handleSetDefaultNotice">使用默认公告</span>
        </el-form-item>
        <div class="form-tips mb20 pl6">将应用于所有未单独设置过公告的直播间</div>
      </el-col>
    </el-row>
  </el-form>
  <div style="display: flex; justify-content: center; margin-top: 10px">
    <el-button round type="primary" @click="handleSubmit">保存</el-button>
  </div>
</template>

<script setup lang="ts" name="Universal">
import { ref, reactive, onMounted } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { getInfoList, updateInfo } from "@/api/modules/info";
import ImageUpload from "@/components/ImageUpload.vue";
const rules = reactive({
  name: [{ required: true, message: "请输入" }],
  orgLogo: [{ required: true, message: "请输入" }]
});
let formData = ref({
  name: "",
  orgLogo: "",
  notice: ""
});
const ruleFormRef = ref<FormInstance>();
const infoDetail = async () => {
  try {
    const res = await getInfoList();
    formData.value = res.data as any;
  } catch (error) {
    console.error(error);
    return false;
  }
};
const handleSubmit = () => {
  ruleFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return;
    try {
      await updateInfo(formData.value as any);
      ElMessage.success({ message: `修改机构成功！` });
      infoDetail();
    } catch (error) {
      console.log(error);
    }
  });
};
const handleSetDefaultNotice = () => {
  formData.value.notice =
    "欢迎进入直播间\n1、请自行调节手机音量至合适的状态。\n2、直播界面显示讲师发布的内容，听众发言可以在讨论区进行或以弹幕形式查看。";
};
onMounted(() => {
  infoDetail();
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
.form-tips {
  color: #8b8e9a;
  margin-top: -4px;
}
.notice-item {
  :deep(.el-form-item__content) {
    position: relative;
    .notice-tips {
      position: absolute;
      right: -80px;
      bottom: 0;
      line-height: 18px;
      cursor: pointer;
      color: #3370ff;
    }
  }
}
</style>

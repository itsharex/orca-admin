<template>
  <div class="table-box p10">
    <div class="card header-button-ri mt10">
      <div class="pb20">
        <el-button type="primary" plain @click="openDrawer('编辑', detail.value)">编辑信息</el-button>
        <el-button type="primary" class="ml20" plain @click="dialogFormVisible = true">修改密码</el-button>
      </div>
      <el-descriptions title="机构信息" :column="2" border>
        <el-descriptions-item label="机构ID"> {{ detail.id }} </el-descriptions-item>
        <el-descriptions-item label="机构名称"> {{ detail.name }} </el-descriptions-item>
        <el-descriptions-item label="机构CODE"> {{ detail.orgCode }} </el-descriptions-item>
        <el-descriptions-item label="机构LOGO"> {{ detail.orgLogo }} </el-descriptions-item>
        <el-descriptions-item label="机构背景"> {{ detail.orgRoomBg }} </el-descriptions-item>
      </el-descriptions>
    </div>
    <InfoDrawer ref="drawerRef" />
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500">
      <el-form :model="formPWD">
        <el-form-item label="旧密码" :label-width="formLabelWidth">
          <el-input v-model="formPWD.oldPwd" autocomplete="off" />
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="formPWD.newPwd" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="infoPWD"> 确认修改 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="accountList">
import { getInfoList, updateInfo, reInfoPwd } from "@/api/modules/info";
import InfoDrawer from "./components/InfoDrawer.vue";

const dialogFormVisible = ref(false);
const formLabelWidth = "140px";

const formPWD = reactive({
  oldPwd: "",
  newPwd: ""
});

const detail = ref("");
// 初始化表格数据
onMounted(() => {
  infoDetail();
});
const infoDetail = async () => {
  try {
    const res = await getInfoList();
    detail.value = res.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
const infoPWD = async () => {
  try {
    await reInfoPwd({ ...formPWD });
    ElMessage.success({ message: `修改成功！` });
    resetForm();
  } catch (error) {
    console.error(error);
    return false;
  }
};
const resetForm = async () => {
  dialogFormVisible.value = false;
  formPWD.newPwd = "";
  formPWD.oldPwd = "";
};

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof InfoDrawer> | null>(null);
const openDrawer = async (title: string) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...detail.value },
    api: updateInfo
  };
  drawerRef.value?.acceptParams(params);
};
</script>

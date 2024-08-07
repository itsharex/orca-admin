<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}机构`">
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
    >
      <el-form-item label="机构名称" prop="name">
        <el-input
          v-model="drawerProps.row!.name"
          maxlength="10"
          show-word-limit
          placeholder="请填写机构名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="机构Code" prop="orgCode">
        <el-input v-model="drawerProps.row!.orgCode" placeholder="请填写机构名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="机构Logo" prop="orgLogo">
        <el-input v-model="drawerProps.row!.orgLogo" placeholder="请填写机构Logo" clearable></el-input>
      </el-form-item>
      <el-form-item label="机构背景" prop="orgRoomBg">
        <el-input v-model="drawerProps.row!.orgRoomBg" placeholder="请填写机构背景" clearable></el-input>
      </el-form-item>
    </el-form>
    <div style="display: flex">
      <el-button style="margin: 0 auto" v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-drawer>
</template>

<script setup lang="ts" name="AccountDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Info } from "@/api/interface";

const rules = reactive({
  name: [{ required: true, message: "请输入" }],
  orgCode: [{ required: true, message: "请输入" }],
  orgLogo: [{ required: true, message: "请输入" }],
  orgRoomBg: [{ required: true, message: "请输入" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Info.InfoList>;
  api?: (params: any) => Promise<any>;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      const data = {
        ...drawerProps.value.row
      };
      await drawerProps.value.api!(data);
      ElMessage.success({ message: `${drawerProps.value.title}机构成功！` });
      drawerVisible.value = false;
      history.go(0);
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

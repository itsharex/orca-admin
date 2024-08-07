<template>
  <el-dialog v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}直播间`">
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
      <!-- <el-form-item label="机构ID" prop="orgId">
        <el-input v-model="drawerProps.row!.orgId" placeholder="请填写机构ID" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="直播类型" prop="livingType">
        <el-select v-model="drawerProps.row!.videoType" placeholder="请选择直播类型" clearable>
          <el-option v-for="item in LIVINGVIDEOTYPE" :key="item.key" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="直播名称" prop="name">
        <el-input
          v-model="drawerProps.row!.name"
          maxlength="20"
          show-word-limit
          placeholder="请填写房间名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="直播延迟" prop="livingType">
        <el-radio-group v-model="drawerProps.row!.livingType">
          <el-radio v-for="item in LIVINGTYPE" :key="item.key" :label="item.key">
            <el-tooltip class="box-item" effect="dark" :content="item.tip" placement="bottom-end">
              {{ item.name }}
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="主播密码" prop="anchorPwd">
        <el-input
          v-model="drawerProps.row!.anchorPwd"
          placeholder="请填写主播密码"
          maxlength="15"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="助理密码" prop="assistantPwd">
        <el-input
          v-model="drawerProps.row!.assistantPwd"
          placeholder="请填写助理密码"
          maxlength="15"
          show-word-limit
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="观看密码" prop="sharePwd" v-show="false">
        <el-input v-model="drawerProps.row!.sharePwd" placeholder="请填写观看密码" clearable></el-input>
      </el-form-item>
      <el-form-item label="直播时间" prop="livingTime">
        <el-date-picker v-model="drawerProps.row!.livingTime" type="datetime" placeholder="请填写直播时间" />
      </el-form-item>
      <!-- <el-form-item label="直播水印" prop="cover">
        <el-input v-model="drawerProps.row!.cover" placeholder="请填写直播水印" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="直播描述" prop="remark">
        <el-input
          type="textarea"
          v-model="drawerProps.row!.remark"
          maxlength="200"
          show-word-limit
          placeholder="请填写直播描述"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="清晰度" prop="videoQuality">
        <el-select v-model="drawerProps.row!.videoQuality" placeholder="请选择状态" clearable>
          <el-option v-for="item in VIDEOQUALITY" :key="item.key" :label="item.name" :value="item.key" />
        </el-select>
      </el-form-item>
    </el-form>
    <div style="display: flex">
      <el-button style="margin: 0 auto" v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts" name="AccountDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Room } from "@/api/interface";
import { VIDEOQUALITY, LIVINGTYPE, LIVINGVIDEOTYPE } from "../constants";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
const rules = reactive({
  orgId: [{ required: true, message: "请输入" }],
  name: [{ required: true, message: "请输入" }],
  livingType: [{ required: true, message: "请输入" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Room.RoomList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
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
      let orgStoreId = userStore.orgId;
      const data = {
        ...drawerProps.value.row,
        orgId: orgStoreId
      };
      await drawerProps.value.api!(data);
      ElMessage.success({ message: `${drawerProps.value.title}直播间成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>

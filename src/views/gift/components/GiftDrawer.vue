<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}礼物`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-position="top"
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
      <el-form-item label="礼物名称" prop="name">
        <el-input v-model="drawerProps.row!.name" maxlength="6" show-word-limit placeholder="请填写礼物名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="礼物价格" prop="price">
        <el-input type="number" v-model="drawerProps.row!.price" placeholder="0-999.99" clearable>
          <template #append>元</template></el-input
        >
      </el-form-item>
      <el-form-item label="礼物图片" prop="img" style="margin-bottom: 35px">
        <el-radio-group v-model="drawerProps.row!.giftType" class="mb40">
          <el-radio v-for="item in GIFT_TYPR" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
        </el-radio-group>
        <ImageUpload
          v-model:value="drawerProps.row!.img"
          :text="'示意图：建议尺寸120*120px，大小1M以内，支持PNG、JPG、JPEG格式'"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div v-show="!drawerProps.isView" style="display: flex; justify-content: center">
        <el-button class="custom-btn" round @click="handleCancel">取消</el-button>
        <el-button class="custom-btn" round type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="AccountDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Gift } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import ImageUpload from "@/components/ImageUpload.vue";
import { GIFT_TYPR } from "../constants";

const userStore = useUserStore();
const rules = reactive({
  name: [{ required: true, message: "请输入" }],
  img: [{ required: true, message: "请输入" }],
  orgId: [{ required: true, message: "请输入" }],
  price: [{ required: true, message: "请输入" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Gift.GiftList>;
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
        price: drawerProps.value.row!.price * 100,
        orgId: orgStoreId
      };
      await drawerProps.value.api!(data);
      ElMessage.success({ message: `${drawerProps.value.title}礼物成功！` });
      drawerProps.value.getTableList!();
      handleCancel();
    } catch (error) {
      console.log(error);
    }
  });
};
const handleCancel = () => {
  drawerVisible.value = false;
  drawerProps.value = {
    isView: false,
    title: "",
    row: {}
  };
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
</style>

<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="800px" :title="`${drawerProps.title}商品`">
    <el-form
      ref="ruleFormRef"
      label-width="120px"
      label-position="top"
      require-asterisk-position="left"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <!-- <el-form-item label="机构ID" prop="orgId">
        <el-input v-model="drawerProps.row!.orgId" placeholder="请填写机构ID" clearable></el-input>
      </el-form-item> -->
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="商品名称" prop="name">
            <el-input
              v-model="drawerProps.row!.name"
              maxlength="12"
              show-word-limit
              placeholder="请填写商品名称"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="24">
          <el-form-item label="商品主图" prop="img">
            <ImageUpload
              v-model:value="drawerProps.row!.img"
              text="建议上传图片比例为1:1，大小2M以内，支持JPG、JPEG、PNG格式"
              :show-extra-btn="true"
            /> </el-form-item
        ></el-col>
        <el-col :span="24">
          <el-form-item label="商品类型" prop="goodType">
            <el-radio-group v-model="drawerProps.row!.goodType" placeholder="请填写商品类型">
              <el-radio v-for="item in GOODSTYPE" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="现价(促销价)" prop="price">
            <el-input v-model="drawerProps.row!.price" placeholder="0-99999">
              <template #suffix>
                <el-icon class="el-input__icon">元</el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="原价" prop="originalPrice">
            <el-input v-model="drawerProps.row!.originalPrice" placeholder="0-99999">
              <template #suffix>
                <el-icon class="el-input__icon">元</el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否限单" prop="bounds">
            <el-radio-group v-model="drawerProps.row!.bounds" placeholder="请选择是否限单">
              <el-radio v-for="item in GOODS_BOUNDS" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="支付类型" prop="payType">
            <el-radio-group v-model="drawerProps.row!.payType" placeholder="请填写支付类型" @change="onPayTypeChange">
              <el-radio v-for="item in PAYTYPE" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item></el-col
        >
        <el-col :span="24">
          <el-form-item label="小程序支付" prop="miniPage" v-if="drawerProps.row!.payType === 3">
            <el-input v-model="drawerProps.row!.miniPage" placeholder="请填写小程序支付跳转链接" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="跳转链接支付" prop="jumpPage" v-if="drawerProps.row!.payType === 1">
            <el-input v-model="drawerProps.row!.jumpPage" placeholder="请填写跳转链接支付" clearable></el-input> </el-form-item
        ></el-col>
      </el-row>
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
import { Robot } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import ImageUpload from "@/components/ImageUpload.vue";
import { GOODSTYPE, PAYTYPE, GOODS_BOUNDS } from "../constants";
const userStore = useUserStore();
const rules = reactive({
  name: [{ required: true, message: "请输入" }],
  img: [{ required: true, message: "请输入" }],
  orgId: [{ required: true, message: "请输入" }],
  price: [{ required: true, message: "请输入" }],
  payType: [{ required: true, message: "请输入" }],
  bounds: [{ required: true, message: "请选择" }],
  // qrcode: [{ required: true, message: "请上传付款码" }],
  goodType: [{ required: true, message: "请输入" }],
  miniPage: [{ required: true, message: "请输入" }],
  jumpPage: [{ required: true, message: "请输入" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Robot.RobotList>;
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
  console.log("params", params);
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
        originalPrice: drawerProps.value.row.originalPrice * 100,
        price: drawerProps.value.row.price ? drawerProps.value.row.price * 100 : "",
        orgId: orgStoreId
      };
      await drawerProps.value.api!(data);
      ElMessage.success({ message: `${drawerProps.value.title}商品成功！` });
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
const onPayTypeChange = () => {
  switch (drawerProps.value.row!.payType) {
    case 1:
      drawerProps.value.row!.miniPage = "";
      break;
    case 2:
      drawerProps.value.row!.jumpPage = "";
      drawerProps.value.row!.miniPage = "";
      break;
    case 3:
      drawerProps.value.row!.jumpPage = "";
      break;
    default:
      break;
  }
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
  font-size: 13px;
  font-weight: 400;
}
.form-tips {
  color: #8b8e9a;
  margin-top: -4px;
}
</style>

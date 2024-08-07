<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="800px"
    :title="drawerProps.title == '编辑' ? drawerProps.row.name : `${drawerProps.title}免审词库`"
  >
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
      <el-row :gutter="12">
        <el-col v-if="drawerProps.title == '新增'" :span="12">
          <el-form-item label="免审词库名称" prop="name">
            <el-input
              v-model="drawerProps.row!.name"
              maxlength="12"
              show-word-limit
              placeholder="支持数字、大小写英文、特殊符号"
              clearable
            ></el-input> </el-form-item
        ></el-col>
        <el-col :span="24">
          <el-form-item label="免审词" prop="words">
            <el-row v-for="(item, index) in wordsList" :key="item.id" :gutter="12" class="mb6" style="width: 100%">
              <template v-if="index === 0">
                <el-col :span="22">
                  <el-input
                    v-model="item.value"
                    maxlength="30"
                    show-word-limit
                    placeholder="支持数字、大小写英文、特殊符号"
                    clearable
                  ></el-input>
                </el-col>
                <el-col :span="2">
                  <div class="flx-center" style="height: 100%">
                    <el-icon @click="onAddWords" size="18" color="var(--el-color-primary)" class="mr4 cursor-pointer"
                      ><CirclePlus
                    /></el-icon>
                    <el-icon size="18" color="var(--el-color-danger)" style="cursor: not-allowed" class="ml6"><Remove /></el-icon>
                  </div>
                </el-col>
              </template>
              <template v-if="index !== 0">
                <el-col :span="22">
                  <el-input
                    v-model="item.value"
                    maxlength="30"
                    show-word-limit
                    placeholder="支持数字、大小写英文、特殊符号"
                    clearable
                  ></el-input>
                </el-col>
                <el-col :span="2">
                  <div class="flx-center" style="height: 100%">
                    <el-icon @click="onAddWords" size="18" color="var(--el-color-primary)" class="mr4 cursor-pointer"
                      ><CirclePlus
                    /></el-icon>
                    <el-icon @click="onReduce(index)" size="18" color="var(--el-color-danger)" class="cursor-pointer ml6"
                      ><Remove
                    /></el-icon>
                  </div>
                </el-col>
              </template>
            </el-row>
          </el-form-item>
        </el-col>
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
import { Gift } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const rules = reactive({
  name: [{ required: true, message: "请输入" }],
  words: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        const flag = wordsList.value.every((item: any) => item.value);
        if (!flag) {
          callback(new Error("请输入免审词"));
        } else {
          callback();
        }
      }
    }
  ]
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
let wordsList = ref([]);
watch(
  () => drawerProps.value.row,
  newVal => {
    if (newVal.words) {
      wordsList.value = newVal.words.map((item: any, index: number) => {
        return {
          value: item,
          id: index
        };
      });
    }
  },
  {
    deep: true
  }
);
const onAddWords = () => {
  wordsList.value.push({
    value: "",
    id: wordsList.value.length
  });
};
const onReduce = (index: number) => {
  wordsList.value.splice(index, 1);
};
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
        words: wordsList.value.map(item => item.value),
        orgId: orgStoreId
      };
      await drawerProps.value.api!(data);
      ElMessage.success({ message: `${drawerProps.value.title}免审词库成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
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

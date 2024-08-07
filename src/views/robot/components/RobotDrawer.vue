<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}机器人`">
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
        <el-col :span="24">
          <el-form-item label="机器人昵称" prop="nickname">
            <el-row v-for="(item, index) in nicknameList" :key="item.id" :gutter="12" class="mb6" style="width: 100%">
              <template v-if="index === 0">
                <el-col :span="23">
                  <el-input v-model="item.value" maxlength="6" show-word-limit placeholder="请输入" clearable></el-input>
                </el-col>
                <el-col :span="1">
                  <div class="flx-center" style="height: 100%">
                    <el-icon @click="onAddWords" size="18" color="var(--el-color-primary)" class="mr4 cursor-pointer"
                      ><CirclePlus
                    /></el-icon>
                  </div>
                </el-col>
              </template>
              <template v-if="index !== 0">
                <el-col :span="23">
                  <el-input v-model="item.value" maxlength="6" show-word-limit placeholder="请输入" clearable></el-input>
                </el-col>
                <el-col :span="1">
                  <div class="flx-center" style="height: 100%">
                    <el-icon @click="onReduce(index)" size="18" color="var(--el-color-danger)" class="cursor-pointer"
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
import { Robot } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";

const userStore = useUserStore();
const rules = reactive({
  nickname: [
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        const flag = nicknameList.value.every((item: any) => item.value);
        if (!flag) {
          callback(new Error("请输入机器人昵称"));
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
let nicknameList = ref([]);
watch(
  () => drawerProps.value.row,
  newVal => {
    if (newVal.nickname) {
      nicknameList.value = newVal.nickname.map((item: any, index: number) => {
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
  nicknameList.value.push({
    value: "",
    id: nicknameList.value.length
  });
};
const onReduce = (index: number) => {
  nicknameList.value.splice(index, 1);
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
        robotNickNames: nicknameList.value.map(item => item.value),
        orgId: orgStoreId
      };
      await drawerProps.value.api!(data);
      ElMessage.success({ message: `${drawerProps.value.title}机器人成功！` });
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

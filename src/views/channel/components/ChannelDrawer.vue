<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="800px" :title="`${drawerProps.title}渠道`">
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
      <CustTitle>
        <template #icon>
          <span class="icon-tips"></span>
        </template>
        <template #title>基本信息</template>
      </CustTitle>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="渠道名称" prop="channelName">
            <el-input
              v-model="drawerProps.row!.channelName"
              maxlength="12"
              show-word-limit
              placeholder="请填写渠道名称"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="渠道代码" prop="channelId">
            <el-input
              v-model="drawerProps.row!.channelId"
              maxlength="6"
              disabled
              show-word-limit
              placeholder="6位数字,由系统自动生成"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="渠道负责人" prop="channelOwner">
            <el-input
              v-model="drawerProps.row!.channelOwner"
              maxlength="6"
              show-word-limit
              placeholder="请填写渠道负责人"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系方式" prop="contactPhone">
            <el-input v-model="drawerProps.row!.contactPhone" placeholder="11位手机号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="渠道说明" prop="channelDescription">
            <el-input
              v-model="drawerProps.row!.channelDescription"
              maxlength="100"
              placeholder="请填写渠道说明"
              :autosize="{ minRows: 2, maxRows: 4 }"
              show-word-limit
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <CustTitle>
        <template #icon>
          <span class="icon-tips"></span>
        </template>
        <template #title>分佣信息</template>
      </CustTitle>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="分佣比例" prop="commissionRatio">
            <el-input v-model="drawerProps.row!.commissionRatio" placeholder="请输入 0-100">
              <template #suffix>
                <el-icon class="el-input__icon">%</el-icon>
              </template>
            </el-input>
            <div class="form-item-tips">请谨慎填写，后续如修改分佣比例，<span>修改比例从修改次日开始生效</span></div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :span="12">
          <el-form-item label="分佣方式" prop="commissionMethod">
            <el-select
              v-model="drawerProps.row!.commissionMethod"
              placeholder="请选择分佣方式"
              clearable
              @change="commissionMethodChange"
            >
              <el-option v-for="item in SHAARING_WAY" :key="item.key" :label="item.name" :value="item.key"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="drawerProps.row!.commissionMethod == 1" class="form-item-content">
        <el-row :gutter="12">
          <el-col :span="24">
            <el-form-item label="分佣周期" prop="commissionPeriod">
              <el-radio-group v-model="drawerProps.row!.commissionPeriod">
                <el-radio v-for="item in SHAARING_CYCLE" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
              </el-radio-group>
              <div class="form-item-tips">
                如选择T+7结算，即如5月1日的渠道分佣，将在5月8日打款，同理5月2日的渠道分佣，将在5月9日打款，以此类推
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="银行账户" prop="bankAccountType">
              <el-radio-group v-model="drawerProps.row!.bankAccountType">
                <el-radio v-for="item in ACCOUNT_TYPE" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="收款单位" prop="receivingUnit">
              <el-input v-model="drawerProps.row!.receivingUnit" placeholder="请填写收款单位" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-form-item label="银行账户" prop="bankAccountNumber">
              <el-input v-model="drawerProps.row!.bankAccountNumber" placeholder="请填写银行账户" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行" prop="bankBranch">
              <el-input v-model="drawerProps.row!.bankBranch" placeholder="请填写开户行" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结算币种" prop="settlementCurrency">
              <el-select v-model="drawerProps.row!.settlementCurrency" placeholder="请选择分佣方式" clearable>
                <el-option v-for="item in CURRENCY_TYPE" :key="item.key" :label="item.name" :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <template #footer>
      <div v-show="!drawerProps.isView" style="display: flex; justify-content: center">
        <el-button class="custom-btn" round @click="handleCancel">取消</el-button>
        <el-button class="custom-btn" round type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog
    title="提示"
    width="32%"
    :close-on-click-modal="false"
    :before-close="
      () => {
        dialogVisible = false;
      }
    "
    v-model="dialogVisible"
  >
    <div class="flx-align-center mt24 mb8">
      <el-icon size="16" color="#ff8800"><WarningFilled /></el-icon>
      <span class="sb-tips ml4">您修改了分佣比例，最新分佣比例，将会在修改次日开始生效。</span>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: end">
        <el-button round @click="dialogVisible = false">取消</el-button>
        <el-button round type="primary" @click="handleSure">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="ChannelDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { Channel } from "@/api/interface";
import { useUserStore } from "@/stores/modules/user";
import CustTitle from "@/components/CustTitle/index.vue";
import { checkNumber } from "@/utils/eleValidate";
import { SHAARING_WAY, SHAARING_CYCLE, ACCOUNT_TYPE, CURRENCY_TYPE } from "../constants";
const userStore = useUserStore();
const rules = reactive({
  channelName: [{ required: true, message: "请填写渠道名称" }],
  // channelId: [
  //   {
  //     required: true,
  //     validator: checkNumber
  //   }
  // ],
  channelOwner: [{ required: true, message: "请填写渠道负责人" }],
  contactPhone: [
    {
      required: true,
      validator: checkNumber
    },
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value.length > 11) {
          callback(new Error("请输入11位手机号"));
        } else {
          callback();
        }
      }
    }
  ],
  commissionRatio: [
    {
      required: true,
      validator: checkNumber
    },
    {
      required: true,
      validator: (rule: any, value: any, callback: any) => {
        if (value > 100) {
          callback(new Error("请输入0-100的数字"));
        } else {
          callback();
        }
      }
    }
  ],
  commissionPeriod: [{ required: true, message: "请选择分佣周期" }],
  bankAccountType: [{ required: true, message: "请选择银行账户" }],
  receivingUnit: [{ required: true, message: "请填写收款单位" }],
  bankAccountNumber: [
    { required: true, message: "请填写银行账户" },
    {
      required: true,
      validator: checkNumber
    }
  ],
  bankBranch: [{ required: true, message: "请填写开户行" }],
  settlementCurrency: [{ required: true, message: "请选择结算币种" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Channel.ChannelList>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});
const dialogVisible = ref(false);
const originCommissionRatio = ref(0);
// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  originCommissionRatio.value = params.row.commissionRatio;
  drawerVisible.value = true;
};
// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    // 判断编辑时是否修改了分佣比例
    if (originCommissionRatio.value != drawerProps.value.row.commissionRatio && drawerProps.value.row!.id) {
      dialogVisible.value = true;
    } else {
      try {
        let orgStoreId = userStore.orgId;
        const data = {
          ...drawerProps.value.row,
          account: orgStoreId
        };
        await drawerProps.value.api!(data);
        ElMessage.success({ message: `${drawerProps.value.title}渠道成功！` });
        drawerProps.value.getTableList!();
        handleCancel();
      } catch (error) {
        console.log(error);
      }
    }
  });
};
const handleSure = async () => {
  try {
    let orgStoreId = userStore.orgId;
    const data = {
      ...drawerProps.value.row,
      account: orgStoreId
    };
    await drawerProps.value.api!(data);
    ElMessage.success({ message: `${drawerProps.value.title}渠道成功！` });
    drawerProps.value.getTableList!();
    handleCancel();
    dialogVisible.value = false;
  } catch (error) {
    console.log(error);
  }
};
const handleCancel = () => {
  drawerVisible.value = false;
  drawerProps.value = {
    isView: false,
    title: "",
    row: {}
  };
};
const commissionMethodChange = () => {
  drawerProps.value.row!.commissionPeriod = "";
  drawerProps.value.row!.bankAccountType = "";
  drawerProps.value.row!.receivingUnit = "";
  drawerProps.value.row!.bankAccountNumber = "";
  drawerProps.value.row!.bankBranch = "";
  drawerProps.value.row!.settlementCurrency = 1;
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
.form-item-tips {
  line-height: 18px;
  margin-top: 6px;
  color: #8b8e9a;
  span {
    color: #3370ff;
  }
}
.form-item-content {
  padding: 10px;
  background: #f8f9fd;
  border-radius: 4px;
}
.sb-tips {
  font-size: 14px;
  color: #5c5e66;
}
</style>

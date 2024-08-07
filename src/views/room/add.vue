<template>
  <div class="p10">
    <el-card>
      <CustTitle class="CustTitle">
        <template #icon>
          <span class="icon-tips"></span>
        </template>
        <template #title>直播类型</template>
      </CustTitle>
      <el-form ref="ruleFormPageRef" label-width="120px" label-position="top" :rules="rulesPage" :model="formPage.row">
        <el-form-item label="直播类型" prop="videoType">
          <el-radio-group v-model="formPage.row!.videoType" @change="handleRadioChange">
            <div :span="12" v-for="item in LIVETYPE" :key="item.key" class="mr20">
              <el-card :body-style="{ padding: 0 }" shadow="never">
                <div class="card-content">
                  <div class="card-content-head flx-center">
                    <template v-if="item.key == 1">
                      <SvgIcon
                        v-if="formPage.row!.videoType == 1"
                        name="liveing"
                        :icon-style="{ width: '24px', height: '24px' }"
                      ></SvgIcon>
                      <SvgIcon v-else name="liveingFill" :icon-style="{ width: '24px', height: '24px' }"></SvgIcon>
                    </template>
                    <template v-if="item.key == 2">
                      <SvgIcon
                        v-if="formPage.row!.videoType == 2"
                        name="video"
                        :icon-style="{ width: '24px', height: '24px' }"
                      ></SvgIcon>
                      <SvgIcon v-else name="videoFill" :icon-style="{ width: '24px', height: '24px' }"></SvgIcon>
                    </template>
                    <span class="ml8" :style="{ color: getTextColor(item.key) }">{{ item.tip }}</span>
                  </div>
                  <div
                    class="card-content-body"
                    :style="{backgroundColor: formPage.row!.videoType == item.key ? '#3370ff1a' : ''}"
                  >
                    <el-radio :label="item.key">{{ item.name }}</el-radio>
                  </div>
                </div>
              </el-card>
            </div>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="直播延迟" prop="livingType" v-if="formPage.row!.videoType == 1">
          <el-select v-model="formPage.row!.livingType" placeholder="请选择" size="large" style="width: 572px" @change="onChange">
            <el-option v-for="item in LIVINGTYPE" :key="item.value" :label="item.name + ':' + item.tip" :value="item.key" />
          </el-select>
        </el-form-item>

        <CustTitle class="CustTitle">
          <template #icon>
            <span class="icon-tips"></span>
          </template>
          <template #title>配置基础</template>
        </CustTitle>
        <el-form-item label="直播名称" prop="name">
          <el-input
            v-model="formPage.row!.name"
            placeholder="请输入直播名称(建议输入15字以内，不超过30个字)"
            maxlength="30"
            show-word-limit
            style="width: 572px"
          ></el-input>
        </el-form-item>
        <el-form-item label="课程视频" prop="fileList" v-if="formPage.row!.videoType == 2">
          <UploadImg v-model:image-url="formPage.row!.fileList" :disabled="imgDisabled" @update:imageUrl="imgRemove"> </UploadImg>
          <div style="margin-top: 130px; margin-left: 10px" v-if="imgDisabled">
            <el-button type="primary" link @click="addVideo">添加视频</el-button>
          </div>
        </el-form-item>
        <div style="display: flex">
          <el-form-item label="开始时间" prop="livingTime">
            <el-date-picker
              :disabled-date="disabledPastDate"
              v-model="formPage.row!.livingTime"
              type="date"
              placeholder="选择日期"
              size="default"
              style="width: 280px"
            ></el-date-picker>
            <el-time-picker
              v-model="formPage.row!.livingTime"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
              :disabled-seconds="disabledSeconds"
              placeholder="选择时间"
              style="width: 280px; margin-left: 12px"
            ></el-time-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="value" style="margin-left: 10px" v-if="formPage.row!.videoType == 2">
            <el-select v-model="formPage.row!.value" placeholder="请选择" style="width: 280px">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="直播封面" prop="cover">
          <ImageUpload v-model:value="formPage.row!.cover" :show-extra-btn="true" />
        </el-form-item>
        <el-form-item label="直播LOGO" prop="logo">
          <ImageUpload
            text="建议上传图片比例为1:1，大小2M以内，支持JPG、JPEG、PNG格式"
            v-model:value="formPage.row!.logo"
            :show-extra-btn="true"
          />
        </el-form-item>
        <el-form-item label="直播简介" prop="remark">
          <el-input
            v-model="formPage.row!.remark"
            maxlength="256"
            style="width: 572px"
            placeholder="请输入直播简介"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item v-show="tagshow">
          <el-tag closable type="primary" style="width: 572px" @close="tagshow = false"
            >更多服务配置，保存后，点击“配置”按钮去设置
          </el-tag>
        </el-form-item>
      </el-form>
      <div style="width: 572px; text-align: center">
        <el-button type="primary" class="ml30" @click="submitPage()" round style="width: 134px">保存</el-button>
      </div>
    </el-card>
  </div>
  <ChooseVideoDialog v-model:visible="chooseVideoVisible" ref="chooseVideo" @update="getVideo"></ChooseVideoDialog>
</template>

<script setup lang="tsx">
import { LIVETYPE, LIVINGTYPE } from "./constants";
import CustTitle from "@/components/CustTitle/index.vue";
import { addRoom } from "@/api/modules/room";
import { useRouter } from "vue-router";
import { FormInstance } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
import ChooseVideoDialog from "./ChooseVideoDialog.vue";
import imgDefault from "@/assets/images/default@2x.png";
import UploadImg from "@/components/Upload/Img.vue";

const userStore = useUserStore();
import dayjs from "dayjs";

const tagshow = ref(true);
const options = [{ value: "1", label: "视频播放完后自动结束" }];
const router = useRouter();
const chooseVideoVisible = ref(false);
const ruleFormPageRef = ref<FormInstance>();
const disabledPastDate = (time: Date) => {
  return time.getTime() < Date.now() - 8.64e7; //8.64e7是一天的毫秒数（24小时 * 60分钟 * 60秒 * 1000毫秒）
};
const makeRange = (start: number, end: number) => {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
};
const disabledHours = () => {
  const hourTime = new Date().getHours() - 1;
  return makeRange(0, hourTime);
};
const disabledMinutes = (hour: number) => {
  const hourTime = new Date().getHours();
  const minutesTime = new Date().getMinutes() - 1;
  if (hour == hourTime) {
    return makeRange(0, minutesTime);
  } else {
    // return makeRange(0, minutesTime);
  }
};
const disabledSeconds = () => {
  // const secondsTime = new Date().getSeconds() - 1;
  // return makeRange(1, 59);
};
const chooseVideo = ref();
const addVideo = () => {
  chooseVideoVisible.value = true;
  chooseVideo.value?.liveParams();
};
const imgDisabled = ref(true);
const getVideo = (value: any) => {
  formPage.value.row!.mediaBizId = value.id;
  formPage.value.row!.fileList = value.image || imgDefault;
  imgDisabled.value = false;
};
const imgRemove = () => {
  console.log(formPage.value.row!.fileList);

  imgDisabled.value = true;
};
// const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
//   console.log(uploadFile, uploadFiles);
// };

const submitPage = () => {
  if (formPage.value.row!.permissionType == 2) {
    formPage.value.row!.permissionJson = formPage.value.row!.permissionJsonPrice;
  } else if (formPage.value.row!.permissionType == 3) {
    formPage.value.row!.permissionJson = formPage.value.row!.permissionJsonPassword;
  }
  formPage.value.row!.orgId = userStore.orgId;
  formPage.value.row!.cycleTimes = 1;
  formPage.value!.row.livingTime = dayjs(formPage.value.row.livingTime).format("YYYY-MM-DD HH:mm:ss");
  ruleFormPageRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      addRoom(formPage.value!.row).then(() => {
        ElMessage({
          message: "添加成功",
          type: "success"
        });
        router.push(`/room/index`);
      });
    } catch (error) {
      console.log(error);
    }
  });
};

// const cancel = () => {
//   router.back();
// };
const formPage = ref<any>({
  row: {
    bgImage: ref(""), // 假设 bgImage 是一个字符串类型的变量
    livingType: ref(2),
    livingTime: ref<dayjs.Dayjs>(),
    fileList: ref(),
    cover: ref(imgDefault),
    logo: ref("")
  }
});

const onChange = (value: any) => {
  formPage.liveDelay = value;
  console.log(value);
};
const rulesPage = reactive({
  mobileLayout: [{ required: true, message: "请输入" }],
  liveType: [{ required: true, message: "请输入" }],
  orgId: [{ required: true, message: "请输入" }],
  name: [{ required: true, message: "请输入" }],
  videoType: [{ required: true, message: "请输入" }],
  livingType: [{ required: true, message: "请输入" }],
  livingTime: [{ required: true, message: "请输入" }],
  permissionType: [{ required: true, message: "请输入" }],
  permissionJson: [{ required: true, message: "请输入" }],
  permissionJsonPrice: [{ required: true, message: "请输入" }],
  permissionJsonPassword: [{ required: true, message: "请输入" }],
  fileList: [{ required: true, message: "请输入" }],
  value: [{ required: true, message: "请输入" }]
});
const handleRadioChange = (value: any) => {
  if (value === "3") {
    formPage.value.row!.showDraw = 1;
  }
};

const getTextColor = (key: any) => {
  if (key == 1) {
    return formPage.value.row!.videoType == 1 ? "#71C3FF" : "#8b8e9a";
  }
  if (key == 2) {
    return formPage.value.row!.videoType == 2 ? "#C687FF" : "#8b8e9a";
  }
};
</script>
<style lang="scss" scoped>
/* 直接通过类名修改 */
:deep(.el-select .el-input__inner) {
  height: 32px;
  line-height: 32px;
}
.el-form-item {
  margin-left: 40px;
}
.CustTitle {
  margin-bottom: 20px;
}
.custom-block {
  padding: 8px 16px;
  margin: 20px 0;
  background-color: var(--block-tip-bg-color);
  border-left: 5px solid var(--el-color-primary);
  border-radius: 4px;
}
img {
  width: 50px;
}
.tips {
  width: 414px;
  height: 18px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #8b8e9a;
  text-align: left;
  white-space: nowrap;
}
.commodity {
  width: 372px;
  height: 18px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #2e2f33;
  text-align: left;
}
:deep(.el-card) {
  border-radius: 8px;
}
.card-content {
  width: 280px;
  .card-content-head {
    height: 64px;
    span {
      font-family: PingFangSC, "PingFang SC";
      font-size: 14px;
      font-weight: 600;
      color: #b9becd;
    }
  }
  .card-content-body {
    box-sizing: border-box;
    height: 36px;
    padding: 0 8px;
    line-height: 36px;
    border-top: 1px solid #dfe4ee;
    :deep(.el-radio) {
      height: 100%;
    }
  }
}
.el-tag {
  justify-content: space-between;
}
</style>

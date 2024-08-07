<template>
  <el-dialog
    width="1000px"
    v-model="internalValue"
    title="开启直播"
    top="5vh"
    :destroy-on-close="true"
    style="border-radius: 10px"
  >
    <div class="header">
      <img src="@/assets/images/logo@2x.png" style="border-radius: 10px" />
      <div>
        <div class="liveName">{{ livingName }}</div>
        <div class="tip">{{ remark || "暂无简介" }}</div>
        <div class="time">
          <span style=""
            ><el-icon style="margin-right: 5px"><Clock /></el-icon>{{ livingTime }}
          </span>
          <div style="width: 1px; height: 12px; margin: 3px 8px 0; background: #dfe4ee"></div>
          <span
            ><el-icon style="margin-right: 5px"><House /></el-icon>{{ roomId }}</span
          >
        </div>
      </div>
    </div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="网页端直播" name="live">
        <div style="width: 100%">
          <div>
            <div>
              <CustTitle style="margin-top: 20px">
                <template #icon>
                  <span class="icon-tips"></span>
                </template>
                <template #title>主播开播信息</template>
              </CustTitle>
              <div style="margin-top: 22px">
                <el-button round @click="videoLive()" type="primary" style="width: 160px">主播开播地址</el-button>
                <span class="ml10">{{ liveStateObj ? "(暂未开播)" : "(正在直播中)" }}</span>
              </div>
              <div class="tip1">讲师/主播专用链接，请勿随意转发</div>
              <el-form
                label-position="top"
                :inline="true"
                :model="formInline.row"
                class="demo-form-inline"
                style="background-color: #f8f9fd"
              >
                <el-row style="width: 100%">
                  <el-col :span="12">
                    <el-form-item label="开播链接">
                      <el-input v-model="formInline.row!.anchorUrl" placeholder="暂无" readonly style="width: 248px" />
                      <span style="width: 100px; text-align: center">
                        <el-button type="primary" text v-copy="formInline.row!.anchorUrl"> 复制链接 </el-button>
                      </span>
                    </el-form-item></el-col
                  >
                  <el-col :span="12"
                    ><el-form-item label="密码">
                      <el-input v-model="formInline.row!.anchorPwd" placeholder="暂无" style="width: 248px" />
                      <span style="display: flex; width: 100px; margin-left: 10px; text-align: center">
                        <el-button type="primary" text v-copy="formInline.row!.anchorPwd" style="width: 48px; margin: 0 12px">
                          复制密码
                        </el-button>
                        <el-button type="primary" text @click="onEditWords2()" style="width: 48px"> 修改密码</el-button>
                      </span>
                    </el-form-item></el-col
                  >
                </el-row>
              </el-form>
              <CustTitle style="margin-top: 50px">
                <template #icon>
                  <span class="icon-tips"></span>
                </template>
                <template #title>学员观看端信息</template>
              </CustTitle>
              <el-form
                label-position="top"
                :inline="true"
                :model="formInline.row"
                id="my-custom-form-id"
                class="demo-form-inline"
              >
                <el-row :gutter="20" style="width: 100%">
                  <el-col :span="8"
                    ><el-form-item style="margin: 20px">
                      <el-row>
                        <el-col :span="10">
                          <div style="align-items: start; height: 80px; margin-right: 12px">观看二维码</div></el-col
                        >
                        <el-col :span="14">
                          <img width="58" :src="qrCodeUrl" alt="二维码" />
                          <el-button
                            type="primary"
                            text
                            @click="downLoadFile(qrCodeUrl)"
                            style="padding-bottom: 22px; padding-left: 0"
                            >下载二维码
                          </el-button>
                        </el-col>
                      </el-row>
                    </el-form-item></el-col
                  >
                  <el-col :span="8" style="border-right: 1px solid #eff1f6; border-left: 1px solid #eff1f6">
                    <el-form-item label="观看链接" style="margin: 20px">
                      <el-input v-model="formInline.row!.shortUrl	" placeholder="暂无" readonly style="width: 248px" />
                      <el-button type="primary" text v-copy="formInline.row!.shortUrl" style="padding: 0"> 复制链接 </el-button>
                    </el-form-item></el-col
                  >
                  <el-col :span="8"
                    ><el-form-item label="观看权限" style="margin: 20px">
                      <el-input
                        v-model="formInline.row!.permissionType"
                        placeholder="暂无"
                        readonly
                        style="width: 248px"
                      /> </el-form-item
                  ></el-col>
                </el-row>
              </el-form>
              <CustTitle style="margin-top: 20px">
                <template #icon>
                  <span class="icon-tips"></span>
                </template>
                <template #title>助理端观看信息</template>
              </CustTitle>
              <div class="tip1">助教辅助教学专用链接，请勿随意转发</div>
              <el-form label-position="top" :inline="true" :model="formInline.row" class="demo-form-inline">
                <el-row style="width: 100%">
                  <el-col :span="12"
                    ><el-form-item label="助理链接">
                      <el-input v-model="formInline.row!.assistantUrl" placeholder="暂无" readonly style="width: 248px" />
                      <span style="width: 100px; text-align: center">
                        <el-button type="primary" text v-copy="formInline.row!.assistantUrl"> 复制链接 </el-button>
                      </span>
                    </el-form-item></el-col
                  >
                  <el-col :span="12"
                    ><el-form-item label="密码">
                      <el-input v-model="formInline.row!.assistantPwd" placeholder="暂无" style="width: 248px" />
                      <div style="display: flex; width: 100px; margin-left: 10px; text-align: center">
                        <el-button type="primary" text v-copy="formInline.row!.assistantPwd" style="width: 48px; margin: 0 12px">
                          复制密码</el-button
                        >
                        <el-button type="primary" text @click="onEditWords()" style="width: 48px"> 修改密码</el-button>
                      </div>
                    </el-form-item></el-col
                  >
                </el-row>
              </el-form>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="OBS直播" name="video">
        <div style="display: flex; height: 36px; margin: 20px 0 30px; line-height: 40px; background-color: #f8f9fd">
          <div style="margin: 0 10px">下载地址</div>
          <div><el-link type="primary" href="http://obsproject.com/" target="_blank">http://obsproject.com/</el-link></div>
        </div>
        <CustTitle>
          <template #icon>
            <span class="icon-tips"></span>
          </template>
          <template #title>OBS 服务配置</template>
        </CustTitle>
        <el-form
          label-position="top"
          :inline="true"
          :model="formObs.row"
          class="demo-form-inline"
          style="padding: 20px; background-color: #f8f9fd"
        >
          <el-form-item>
            <el-radio-group v-model="formObs.row!.radio1" class="ml-4">
              <el-radio v-for="item in STANDARDLIVE" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="20">
              <el-col :span="12"> 1.打开OBS软件，找到右下角“设置”按钮，打开选择"直播”</el-col>
              <el-col :span="12" v-if="formObs.row!.radio1 == 2"> 2."服务"选择“自定义”，并填写“服务器”和“推流码”</el-col>
              <el-col :span="12" v-if="formObs.row!.radio1 == 1"> 2."服务"选择“WHIP”，并填写“服务器”和“Bearer令牌”</el-col>
              <el-col :span="12" style="margin-top: 40px">
                <div>服务器</div>
                <div>
                  <el-input
                    v-if="formObs.row!.radio1 == 2"
                    v-model="formObs.row!.obsServer"
                    placeholder="暂无"
                    readonly
                    style="width: 248px"
                  />
                  <el-input
                    v-if="formObs.row!.radio1 == 1"
                    v-model="formObs.row!.whipServer"
                    placeholder="暂无"
                    readonly
                    style="width: 248px"
                  />
                  <span style="width: 100px; text-align: center">
                    <el-button type="primary" v-if="formObs.row!.radio1 == 2" text v-copy="formObs.row!.obsServer">
                      复制链接
                    </el-button>
                    <el-button type="primary" v-if="formObs.row!.radio1 == 1" text v-copy="formObs.row!.whipServer">
                      复制链接
                    </el-button>
                  </span>
                </div>
              </el-col>
              <el-col :span="12" style="margin-top: 40px">
                <div v-if="formObs.row!.radio1 == 2">推流码</div>
                <div v-if="formObs.row!.radio1 == 1">Bearer令牌</div>
                <div>
                  <el-input
                    v-if="formObs.row!.radio1 == 2"
                    v-model="formObs.row!.obsStreamCode"
                    placeholder="暂无"
                    readonly
                    style="width: 248px"
                  />
                  <el-input
                    v-if="formObs.row!.radio1 == 1"
                    v-model="formObs.row!.webrtc"
                    placeholder="暂无"
                    readonly
                    style="width: 248px"
                  />
                  <span style="width: 100px; text-align: center">
                    <el-button v-if="formObs.row!.radio1 == 2" type="primary" text v-copy="formObs.row!.obsStreamCode">
                      复制链接
                    </el-button>
                    <el-button v-if="formObs.row!.radio1 == 1" type="primary" text v-copy="formObs.row!.webrtc">
                      复制链接
                    </el-button>
                  </span>
                </div></el-col
              >
            </el-row>
          </el-form-item>
          <el-form-item label="建议配置" v-if="formObs.row!.radio1 == 1">
            <el-row>
              <el-col :span="24">
                <div class="obsTip">打开OBS“设置”，选择“输出”，“输出模式”选择“高级”，在直播设置中，设置如下配置</div></el-col
              >
              <el-col :span="24" style="margin-top: 8px">
                <div style="display: flex">
                  <div class="buttons">
                    <span style="padding: 6px 12px">关键帧间隔：2s</span>
                  </div>
                  <div class="buttons">
                    <span style="padding: 6px 12px">CPU使用预设：veryfast</span>
                  </div>
                  <div class="buttons">
                    <span style="padding: 6px 12px">配置：baseline</span>
                  </div>
                  <div class="buttons">
                    <span style="padding: 6px 12px">微调：zerolatency</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-col :spam="24"><div>3.在OBS平台开播前，需先点击下方“开启直播”按钮，才可保证正常直播</div></el-col>
              <el-col :spam="24"
                ><div style="margin-top: 20px">
                  <el-button round @click="openLive()" type="primary" style="width: 160px">
                    {{ liveStateObj ? "开启直播" : "关闭直播" }}</el-button
                  >
                  <span class="ml10">{{ liveStateObj ? "(暂未开播)" : "(正在直播中)" }}</span>
                </div></el-col
              >
            </el-row>
          </el-form-item>
        </el-form>

        <CustTitle style="margin-top: 20px">
          <template #icon>
            <span class="icon-tips"></span>
          </template>
          <template #title>学员观看端信息</template>
        </CustTitle>
        <el-form
          label-position="top"
          :inline="true"
          :model="formInline.row"
          class="demo-form-inline"
          style="background: rgb(20 204 131 / 4%)"
        >
          <el-row style="width: 100%; padding: 20px">
            <el-col :span="8">
              <el-form-item style="margin: 20px">
                <el-row>
                  <el-col :span="10"> <div style="align-items: start; height: 80px; margin-right: 12px">观看二维码</div></el-col>
                  <el-col :span="14">
                    <img width="58" :src="qrCodeUrl" alt="二维码" />
                    <el-button type="primary" text @click="downLoadFile(qrCodeUrl)" style="padding-bottom: 22px; padding-left: 0"
                      >下载二维码
                    </el-button>
                  </el-col>
                </el-row>
              </el-form-item></el-col
            >
            <el-col :span="8" style="border-right: 1px solid #eff1f6; border-left: 1px solid #eff1f6">
              <el-form-item label="观看链接" style="margin: 20px">
                <el-input v-model="formInline.row!.shortUrl" placeholder="暂无" readonly style="width: 248px" />
                <el-button type="primary" text v-copy="formInline.row!.shortUrl" style="padding: 0"> 复制链接 </el-button>
              </el-form-item></el-col
            >
            <el-col :span="8"
              ><el-form-item label="观看权限" style="margin: 20px">
                <el-input
                  v-model="formInline.row!.permissionType"
                  placeholder="暂无"
                  readonly
                  style="width: 248px"
                /> </el-form-item
            ></el-col>
          </el-row>
        </el-form>
        <CustTitle style="margin-top: 20px">
          <template #icon>
            <span class="icon-tips"></span>
          </template>
          <template #title>助理端观看信息</template>
        </CustTitle>
        <div class="tip1">助教辅助教学专用链接，请勿随意转发</div>
        <el-form label-position="top" :inline="true" :model="formInline.row" class="demo-form" style="background-color: #f8f9fd">
          <el-row style="width: 100%">
            <el-col :span="12">
              <el-form-item label="助理链接">
                <el-input v-model="formInline.row!.assistantUrl" placeholder="暂无" readonly style="width: 248px" />
                <span style="width: 100px; text-align: center">
                  <el-button type="primary" text v-copy="formInline.row!.assistantUrl"> 复制链接 </el-button>
                </span>
              </el-form-item></el-col
            >
            <el-col :span="12"
              ><el-form-item label="密码">
                <el-input v-model="formInline.row!.assistantPwd" placeholder="暂无" style="width: 248px" />
                <span style="display: flex; width: 100px; margin-left: 10px; text-align: center">
                  <el-button type="primary" text v-copy="formInline.row!.assistantPwd" style="width: 48px; margin: 0 12px">
                    复制密码
                  </el-button>
                  <el-button type="primary" text @click="onEditWords()" style="width: 48px"> 修改密码 </el-button>
                </span>
              </el-form-item></el-col
            >
          </el-row>
        </el-form>
        <!-- <div class="table-box1" style="margin-top: 10px">
          <ProTable ref="proLogTable" :columns="columns" :request-api="videoLog" :data-callback="dataCallback"> </ProTable>
        </div> -->
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script setup lang="tsx" name="live">
import { streamE2e, stream, liveStatus, liveOperate } from "@/api/modules/stream";
import { getExtendList } from "@/api/modules/extend";
import { updateRoomPwd } from "@/api/modules/room";
import { URLTEXE, STANDARDLIVE } from "./constants";
import CustTitle from "@/components/CustTitle/index.vue";
import QRCode from "qrcode";
import { Clock, House } from "@element-plus/icons-vue";

// 定义 props，包括 id 和 visible
const downLoadFile = (url: string) => {
  fetch(url).then(res =>
    res.blob().then(blob => {
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      const filename = name || "";
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    })
  );
  // window.open(url);
};
const qrCodeUrl = ref("");
const generateQRCode = async (url: string) => {
  if (!url) return;

  try {
    const qrCodeDataURL = await QRCode.toDataURL(url);
    qrCodeUrl.value = qrCodeDataURL;
  } catch (error) {
    console.error("生成二维码失败:", error);
  }
};
const props = defineProps({
  visible: Boolean
});
const onEditWords = async () => {
  if (!formInline.value.row!.assistantPwd) {
    return ElMessage.warning("请输入密码");
  }
  const params = {
    roomId: roomId.value,
    password: formInline.value.row!.assistantPwd,
    role: 1
  };
  const res: any = await updateRoomPwd(roomId.value, params);
  if (res.code === 200) {
    ElMessage.success("编辑成功");
    internalValue.value = false;
    emit("update");
  }
};
const onEditWords2 = async () => {
  if (!formInline.value.row!.anchorPwd) {
    return ElMessage.warning("请输入密码");
  }
  const params = {
    roomId: roomId.value,
    password: formInline.value.row!.anchorPwd,
    role: 0
  };
  const res: any = await updateRoomPwd(roomId.value, params);
  if (res.code === 200) {
    ElMessage.success("编辑成功");
    internalValue.value = false;
    emit("update");
  }
};
const emit = defineEmits(["update:visible", "update"]);
// const livingTypeText = ref(0);
const livingName = ref("");
const livingType = ref(1);
const roomId = ref(0);
const livingTime = ref("");
const remark = ref("");

let activeName = ref("live");

// 接收父组件传过来的参数
const liveParams = (params: any) => {
  console.log(params);

  liveProps.value = params;
  livingName.value = liveProps.value?.livingName;
  livingTime.value = liveProps.value?.livingTime;

  roomId.value = liveProps.value?.roomId;

  livingType.value = liveProps.value?.livingType;
  remark.value = liveProps.value?.remark;
  activeName.value = livingType.value === 1 ? "live" : "video";
};

// 使用 internalValue 来存储组件内部的值
const internalValue = ref(props.visible);

// 监听外部值的变化，更新内部值
watch(
  () => props.visible,
  newValue => {
    internalValue.value = newValue;
  }
);

// 监听内部值的变化，触发更新外部值的事件
watch(
  () => internalValue.value,
  newValue => {
    emit("update:visible", newValue);
  }
);
const liveObj = ref();
const streamObj = ref();
const liveStateObj = ref();
const liveId = ref();
let status = ref();
const formInline = ref<any>({
  row: {
    // bgImage: ref(""), // 假设 bgImage 是一个字符串类型的变量
    // user: ref("http://d.orcacl.com/edeufhbervk..."),
    // region: ref("123"),
    // anchorUrl: ref()
  }
});
const formObs = ref<any>({
  row: {}
});
const getList = async (id: string | string[]) => {
  let liveList = await streamE2e(id);
  let streamList = await stream(id);
  let permissionType = await getExtendList(id);
  formInline.value.row = liveList.data;
  if (permissionType.data.permission.permissionType == 1) {
    formInline.value.row.permissionType = "免费观看";
  } else if (permissionType.data.permission.permissionType == 2) {
    formInline.value.row.permissionType = "付费观看";
  } else {
    formInline.value.row.permissionType = "密码观看";
  }

  formInline.value.row.anchorPwd = liveProps.value?.anchorPwd;
  formInline.value.row.assistantPwd = liveProps.value?.assistantPwd;
  formInline.value.row.shareFwd = liveProps.value?.shareFwd;
  // formInline.value.row.permissionType = liveProps.value?.permissionType;
  formObs.value.row = streamList.data;
  formObs.value.row.radio1 = 2;

  // 将数组和对象的键对应起来
  const liveListArray = URLTEXE.reduce((result, item) => {
    // 查找对象中对应的键值
    if (liveList.data.hasOwnProperty(item.key)) {
      const value = liveList.data.shortUrl;
      if (item.name === "观看二维码") {
        generateQRCode(value);
        console.log(value);
      }
      result.push({ ...item, value });
    }
    return result;
  }, []);
  // 将数组和对象的键对应起来
  const streamListArray = URLTEXE.reduce((result, item) => {
    // 查找对象中对应的键值
    if (streamList.data.hasOwnProperty(item.key)) {
      const value = streamList.data[item.key];
      result.push({ ...item, value });
    }
    return result;
  }, []);
  liveId.value = id;
  liveObj.value = liveListArray;
  streamObj.value = streamListArray;
  getLiveList();
};
const getLiveList = async () => {
  let liveStatusData = await liveStatus(liveId.value);
  liveStateObj.value = liveStatusData.data;
};
const liveProps = ref(null);

const openLive = async () => {
  if (liveStateObj.value) {
    status.value = "start";
  } else {
    status.value = "stop";
  }
  await liveOperate(status.value, liveId.value);
  getLiveList();
  liveProps.value?.getTableList();
};

const videoLive = () => {
  window.open(formInline.value.row!.anchorUrl);
};

defineExpose({
  getList,
  liveParams
});
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-left: 20px;
}
.titleName {
  font-weight: bold;
}
.f_flex {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .item_flex {
    display: flex;
    align-items: center;
    width: 50%;
  }
  .title {
    /* margin-right: 5px; */
  }
  .text {
    display: inline-block;
    width: 220px;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.f_div {
  line-height: 20px;
}
.el-dialog__body {
  padding-top: 0;
}
.el-autocomplete {
  width: 500px;
}
.table-box1 .el-pagination {
  display: none;
}
.liveName {
  width: 420px;
  height: 20px;
  margin: 10px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  color: #2e2f33;
  text-align: left;
}
.tip {
  width: 676px;
  height: 18px;
  margin: 10px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #8b8e9a;
  text-align: left;
}
.time {
  display: flex;
  width: 500px;
  height: 20px;
  margin: 10px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: #5c5e66;
  text-align: left;
}
.header {
  display: flex;
  width: 148px;
  height: 80px;
  margin: 15px 0;
  background: #ffffff;
  border-radius: 0 0 16px 16px;
}
.tip1 {
  width: 220px;
  height: 18px;
  margin-top: 20px;
  margin-bottom: 32px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #ff8800;
  text-align: left;
}
.demo-form-inline .el-input {
  --el-input-width: 200px;
}

/* 通过ID选择器修改背景颜色 */
#my-custom-form-id {
  background-color: rgb(20 204 131 / 4%);
}
.obsTip {
  height: 18px;
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: #5c5e66;
  text-align: left;
}
.buttons {
  height: 32px;
  margin-right: 12px;
  background: #f6f6f6;
  border: 1px solid #dfe4ee;
  border-radius: 4px;
}
</style>

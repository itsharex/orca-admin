<template>
  <el-dialog v-model="dialogTableVisible" title="分享给学员" width="800" style="border-radius: 20px">
    <div>
      <h3>选择渠道</h3>
      <div class="flex flex-wrap gap-4 items-center">
        <el-select v-model="value" placeholder="Select" size="large" style="width: 240px">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button round style="margin-left: 10px" @click="shareContent"> 生成分享内容</el-button>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12">
            <div style="width: 132px; height: 132px; margin: 40px 0 0 102px">
              <img width="132" :src="qrCodeUrl" alt="二维码" />
            </div>
            <div
              style="
                height: 18px;
                margin: 20px 0 0 130px;
                font-size: 12px;
                font-style: normal;
                font-weight: 400;
                line-height: 18px;
                color: #8b8e9a;
              "
            >
              {{ shareName || "暂不选择渠道" }}
            </div>
            <div style="margin: 20px 0 0; text-align: center">
              <el-button type="primary" round plain @click="downLoadFile(qrCodeUrl)">下载二维码</el-button>
              <el-button type="primary" round plain v-copy="shortUrl">复制链接</el-button>
            </div>
          </el-col>
          <el-col :span="12">
            <div id="CodeImgBase64">
              <div style="text-align: center">
                <img src="@/assets/images/haibao.svg" style="width: 200px" />
              </div>
              <div style="display: flex; margin-left: 85px">
                <img src="@/assets/images/haibao.svg" style="width: 40px; height: 40px" />
                <div style="margin-top: 15px"><span class="name">HWJY</span> <span class="invite">邀请你一起</span></div>
              </div>
              <div style="display: flex; margin-top: 20px; margin-left: 85px">
                <span class="title">{{ livingName }}</span>
              </div>
              <div style="display: flex; margin-left: 85px">
                <span class="Channel">{{ shareName || "暂不选择渠道" }}</span>
              </div>
              <div style="text-align: center">
                <img :src="qrCodeUrl" style="width: 80px; height: 80px" />
                <div class="detail">长按扫码查看详情</div>
              </div>
              <div style="width: 375px; height: 32px; margin-top: 32px; text-align: center; background: #ebf0ff">
                <div class="logTitele">虎鲸云提供技术支持</div>
              </div>
            </div>
            <div style="margin-top: 20px; text-align: center">
              <el-button type="primary" round plain @click="createPoster">下载海报</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { channelAll, channelShare } from "@/api/modules/channelData";
import { streamE2e } from "@/api/modules/stream";
import { URLTEXE } from "./constants";
import QRCode from "qrcode";
import { onMounted } from "vue";
import html2canvas from "html2canvas";
const createPoster = () => {
  // 生成海报
  const domObj = document.getElementById("CodeImgBase64");
  //显示海报
  html2canvas(domObj, {
    useCORS: true,
    allowTaint: false,
    logging: false,
    letterRendering: true,
    onclone(doc: any) {
      let e = doc.querySelector("#CodeImgBase64");
      e.style.display = "block";
      console.log(doc);
    }
  }).then((canvas: any) => {
    // 在微信里,可长按保存或转发
    const a = canvas.toDataURL("image/png");
    fetch(a).then(res =>
      res.blob().then(blob => {
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(blob);
        const filename = name || "";
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(a);
      })
    );
  });
};
const props = defineProps({
  visible: Boolean
});
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
const emit = defineEmits(["update:visible"]);
// 使用 dialogTableVisible 来存储组件内部的值
const dialogTableVisible = ref(props.visible);

const value = ref("");
const options: any = [];
const liveObj = ref();
const liveId = ref();
const shortUrl = ref();

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
onMounted(async () => {
  let res = await channelAll();
  res.data.forEach(element => {
    options.push({
      value: element.channelId,
      label: element.channelName
    });
  });
  value.value = options[0].value;
});
const livingName = ref("");
const getList = async (row: any) => {
  livingName.value = row.name;
  let liveList = await streamE2e(row.id);

  // 将数组和对象的键对应起来
  const liveListArray = URLTEXE.reduce((result, item) => {
    // 查找对象中对应的键值
    if (liveList.data.hasOwnProperty(item.key)) {
      const value = liveList.data[item.key];
      if (item.name === "观看二维码") {
        generateQRCode(value);
        shortUrl.value = value;
      }
      result.push({ ...item, value });
    }
    return result;
  }, []);
  // 将数组和对象的键对应起来
  liveId.value = row.id;
  liveObj.value = liveListArray;
  shareContent();
};
const shareName = ref();
const shareContent = async () => {
  console.log(options);
  console.log();

  options.forEach(item => {
    if (item.value == value.value) {
      shareName.value = item.label;
      console.log(item.label);
    }
  });

  let params = {
    channelId: value.value
  };
  let res = await channelShare(liveId.value, params);
  shortUrl.value = res.data.shortUrl;
  generateQRCode(res.data.shortUrl);
};

// 监听外部值的变化，更新内部值
watch(
  () => props.visible,
  newValue => {
    dialogTableVisible.value = newValue;
  }
);

// 监听内部值的变化，触发更新外部值的事件
watch(
  () => dialogTableVisible.value,
  newValue => {
    emit("update:visible", newValue);
  }
);

defineExpose({
  getList
});
</script>

<style scoped>
* {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 12px;
}
.demo-tabs > .el-tabs__content {
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
.name {
  width: 46px;
  height: 18px;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 16px;
  font-style: normal;
  line-height: 18px;
  color: #5c5e66;
  text-align: left;
}
.invite {
  width: 80px;
  height: 18px;
  font-size: 16px;
  font-style: normal;
  line-height: 18px;
  color: #5c5e66;
  text-align: left;
}
.title {
  width: 327px;
  height: 52px;
  font-size: 17px;
  font-style: normal;
  font-weight: 600;
  line-height: 26px;
  color: #2e2f33;
  text-align: left;
}
.Channel {
  width: 56px;
  height: 26px;
  font-size: 14px;
  font-style: normal;
  line-height: 26px;
  color: #8b8e9a;
  text-align: left;
}
.detail {
  height: 17px;
  font-style: normal;
  line-height: 17px;
  color: #8b8e9a;
  text-align: center;
}
.logTitele {
  height: 16px;
  font-size: 11px;
  font-style: normal;
  line-height: 35px;
  color: #5c5e66;
}
</style>

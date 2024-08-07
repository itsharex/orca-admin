<template>
  <div class="upload content-box">
    <UploadImg v-model:image-url="internalValue" :file-size="3" :api="upload" ref="uploadImgRef">
      <template #tip>
        <div class="upload-tip">{{ text }}</div>
      </template>
    </UploadImg>
    <span v-if="showExtraBtn" class="load-text" @click="uploadImgRef.handleSelectFile()">{{ extraBtnText }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import { upload } from "@/api/modules/uploadFile";

const props = defineProps({
  value: String, // 假设这是你的prop类型
  text: {
    type: String,
    default: "建议上传尺寸750*420px，比例16:9，小于5M的JPG、PNG格式图片，未上传则使用默认封面"
  },
  showExtraBtn: {
    type: Boolean,
    default: false
  },
  extraBtnText: {
    type: String,
    default: "上传图片"
  }
});

const emit = defineEmits(["update:value"]);
const uploadImgRef = ref();
// 使用 internalValue 来存储组件内部的值
const internalValue = ref(props.value);

// 监听外部值的变化，更新内部值
watch(
  () => props.value,
  newValue => {
    internalValue.value = newValue;
  }
);

// 监听内部值的变化，触发更新外部值的事件
watch(
  () => internalValue.value,
  newValue => {
    emit("update:value", newValue);
  }
);
</script>
<style lang="scss" scoped>
.upload-tip {
  font-family: PingFangSC, "PingFang SC";
  font-size: 12px;
  font-weight: 400;
  color: #8b8e9a;
  text-align: left;
}
.content-box {
  position: relative;
  width: 500px;
  align-items: flex-start;
  .load-text {
    position: absolute;
    bottom: 24px;
    right: 184px;
    cursor: pointer;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 12px;
    color: #3370ff;
    line-height: 18px;
  }
}
</style>

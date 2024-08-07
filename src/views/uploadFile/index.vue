<template>
  <div class="upload content-box">
    <!-- 单图上传 -->
    <div class="card img-box">
      <div class="upload-list">
        <UploadImg v-model:image-url="avatar" :file-size="3" :api="upload">
          <template #tip> 上传图片最大为 3M </template>
        </UploadImg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="uploadFile">
import { ref } from "vue";
import UploadImg from "@/components/Upload/Img.vue";
import { upload } from "@/api/modules/uploadFile";
const avatar = ref("");
</script>

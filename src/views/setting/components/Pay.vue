<template>
  <el-row :gutter="20">
    <el-col :span="8">
      <el-card>
        <div class="card-item">
          <div class="card-item-content">
            <div class="card-item-title mb8">微信支付-普通商户模式</div>
            <div class="card-item-desc mb20">普通商户自行申请入驻微信支付，无需服务商</div>
            <el-button round type="primary">开通收款方式</el-button>
          </div>
          <img src="@/assets/images/people.png" alt="" />
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card body-class="flx-center" body-style="height:100%;box-sizing:border-box" style="height: 100%">
        <div class="custom-content">更多收款方式敬请期待…</div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup lang="ts" name="Pay"></script>
<style lang="scss" scoped>
* {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 13px;
}

:deep(.el-card) {
  border-radius: 8px !important;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .card-item-content {
    width: calc(100% - 68px);
    .card-item-title {
      font-weight: 600;
      font-size: 13px;
      color: #5c5e66;
    }
    .card-item-desc {
      font-size: 12px;
      color: #8b8e9a;
    }
  }
  img {
    width: 44px;
    height: 44px;
  }
}
.custom-content {
  color: #8b8e9a;
}
</style>

<template>
  <div class="cust-title">
    <slot name="icon"></slot>
    <slot name="title"></slot>
  </div>
</template>
<script setup lang="ts" name="CustTitle"></script>
<style lang="scss" scoped>
.cust-title {
  display: flex;
  align-items: center;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 600;
  font-size: 14px;
  color: #2e2f33;
  line-height: 20px;
  margin-bottom: 10px;
}
</style>

<template>
  <div class="table-box pl20 pr20">
    <div class="title">支持对回放和本地视频进行剪辑，如固定时间弹出商品、导入聊天信息等</div>
    <div class="content">
      <span class="el-table__empty-text">
        <div class="table-empty flx-center">
          <img src="@/assets/images/notData@2x.png" alt="notData" />
          <div>暂无数据</div>
        </div>
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup name="templet"></script>
<style lang="scss" scoped>
* {
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 400;
  font-size: 13px;
}
.title {
  font-size: 14px;
  color: #8b8e9a;
}
.table-empty {
  margin-top: 60px;
  flex-direction: column;
}
</style>

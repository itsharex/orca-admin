<template>
  <div class="login-container flx-center">
    <div class="login-box">
      <!-- <SwitchDark class="dark" /> -->
      <img src="@/assets/images/logos.png" alt="虎鲸云" class="logo" />
      <div class="login-left">
        <img class="login-left-img" src="@/assets/images/login_bg.png" alt="login" />
      </div>
      <div class="login-form">
        <div class="login-logo">
          <!-- <img class="login-icon" src="@/assets/images/logo.png" alt="" /> -->
          <h2 class="logo-text">账号密码登录</h2>
        </div>
        <LoginForm />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="login">
import LoginForm from "./components/LoginForm.vue";
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>

<template>
  <div class="login-container">
    <el-alert
      v-if="nodeEnv !== 'development'"
      title="beautiful boys and girls 欢迎加入 OPSLI 快速开发平台 QQ群：724850675 | API接口/数据库监控密码均为 admin : 123456 "
      type="success"
      :closable="false"
      style="position: fixed"
    ></el-alert>
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="16">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-row class="login-form">
          <div class="title">hello !</div>
          <div class="title-tips">欢迎来到{{ title }}！</div>
          <br>
          <el-tabs active-name="account" >
            <el-tab-pane label="账号密码" name="account">
              <el-form
                ref="form"
                :model="form"
                :rules="rules"
                label-position="left"
              >
                <el-form-item style="margin-top: 40px" prop="username">
                  <span class="svg-container svg-container-admin">
                    <vab-icon :icon="['fas', 'user']" />
                  </span>
                  <el-input
                    v-model.trim="form.username"
                    v-focus
                    placeholder="用户名/手机号/邮箱"
                    tabindex="1"
                    type="text"
                  />
                </el-form-item>
                <el-form-item prop="password">
                  <span class="svg-container">
                    <vab-icon :icon="['fas', 'lock']" />
                  </span>
                  <el-input
                    :key="passwordType"
                    ref="password"
                    v-model.trim="form.password"
                    :type="passwordType"
                    tabindex="2"
                    placeholder="请输入密码"
                    show-password
                    @keyup.enter.native="handleLogin"
                  />
                </el-form-item>

                <el-form-item v-if="captchaFlag" prop="captcha">
                  <span class="svg-container">
                    <i class="el-icon-warning" />
                  </span>
                  <el-input
                    ref="captcha"
                    v-model.trim="form.captcha"
                    placeholder="请输入验证码"
                    name="captcha"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    maxlength="10"
                    style="width: calc(100% - 200px)"
                    @keyup.enter.native="handleLogin"
                  />
                  <img
                    class="captcha"
                    style="float: right"
                    title="看不起，换一张"
                    alt="验证码"
                    :src="captchaImg"
                    @click="getCaptcha"
                  />
                </el-form-item>

                <el-button
                  :loading="loading"
                  class="login-btn"
                  type="primary"
                  @click="handleLogin()"
                >
                  登录
                </el-button>

                <el-button
                  :loading="loading"
                  class="login-btn"
                  type="success"
                  style="width: 100px"
                  @click="tipsBtnClick"
                >
                  快速登陆
                </el-button>
                <!--          <router-link to="/register">-->
                <!--            <div style="margin-top: 20px">注册</div>-->
                <!--          </router-link>-->
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="手机验证码" name="mobile">
              <el-form
                ref="mobileForm"
                :model="mobileForm"
                :rules="mobileRules"
                label-position="left"
              >
                <el-form-item style="margin-top: 40px" prop="principal">
                  <span class="svg-container svg-container-admin">
                    <vab-icon :icon="['fas', 'user']" />
                  </span>
                  <el-input
                    v-model.trim="mobileForm.principal"
                    v-focus
                    placeholder="请输入手机号"
                    tabindex="1"
                    type="text"
                  />
                </el-form-item>


                <el-form-item prop="verificationCode">
                  <span class="svg-container">
                    <i class="el-icon-warning" />
                  </span>
                  <el-input
                    ref="verificationCode"
                    v-model.trim="mobileForm.verificationCode"
                    placeholder="请输入验证码"
                    name="verificationCode"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    maxlength="10"
                    style="width: calc(100% - 128px) !important;"
                    @keyup.enter.native="handleLoginByCode('mobileForm', mobileForm)"
                  />

                  <el-button
                    plain native-type="button"
                    class="other-btn"
                    style="margin-left: 10px"
                    @click="handleSendMobileCode">
                    获取验证码
                  </el-button>

                </el-form-item>

                <el-button
                  :loading="loading"
                  class="login-btn"
                  type="primary"
                  @click="handleLoginByCode('mobileForm', mobileForm)"
                >
                  登录
                </el-button>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="邮箱验证码" name="email">
              <el-form
                ref="emailForm"
                :model="emailForm"
                :rules="emailRules"
                label-position="left"
              >
                <el-form-item style="margin-top: 40px" prop="principal">
                  <span class="svg-container svg-container-admin">
                    <vab-icon :icon="['fas', 'user']" />
                  </span>
                  <el-input
                    v-model.trim="emailForm.principal"
                    v-focus
                    placeholder="请输入邮箱"
                    tabindex="1"
                    type="text"
                  />
                </el-form-item>


                <el-form-item prop="verificationCode">
                  <span class="svg-container">
                    <i class="el-icon-warning" />
                  </span>
                  <el-input
                    ref="verificationCode"
                    v-model.trim="emailForm.verificationCode"
                    placeholder="请输入验证码"
                    name="verificationCode"
                    type="text"
                    tabindex="1"
                    autocomplete="on"
                    maxlength="10"
                    style="width: calc(100% - 128px) !important;"
                    @keyup.enter.native="handleLoginByCode('emailForm', emailForm)"
                  />

                  <el-button
                    plain native-type="button"
                    class="other-btn"
                    style="margin-left: 10px"
                    @click="handleSendEmailCode">
                    获取验证码
                  </el-button>

                </el-form-item>

                <el-button
                  :loading="loading"
                  class="login-btn"
                  type="primary"
                  @click="handleLoginByCode('emailForm', emailForm)"
                >
                  登录
                </el-button>
                <!--          <router-link to="/register">-->
                <!--            <div style="margin-top: 20px">注册</div>-->
                <!--          </router-link>-->
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-col>
    </el-row>

    <login-tips ref="login-tips" @tipsClick="tipsClick"></login-tips>

  </div>
</template>

<script>
import {uuid, vueButtonClickBan} from "@/utils";
import {isNull, isEmail, isMobile, getMsg} from "@/utils/valiargs";
  import { validatorRule } from "@/utils/validateRlue";
  import { captcha } from "@/api/user";

  // TODO 演示专用 开发记得删除
  import LoginTips from "./components/LoginTips";

  export default {
    name: "Login",
    directives: {
      focus: {
        inserted(el) {
          el.querySelector("input").focus();
        },
      },
    },
    components: { LoginTips },
    data() {

      return {
        nodeEnv: process.env.NODE_ENV,
        title: this.$baseTitle,

        // 验证码类型 0==登陆认证
        codeType: "0",

        form: {
          username: "",
          password: "",
          captcha: "",
          uuid: "",
        },
        rules: {
          username: [
            { required: true, trigger: "blur", message: "请输入用户名/手机号/邮箱" },
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入密码" },
          ],
          captcha: [
            { required: true, trigger: "blur", message: "请输入验证码" },
          ],
        },


        mobileForm: {
          principal: "",
          verificationCode: "",
          loginFrom: "0"
        },
        mobileRules: {
          principal: [
            { required: true, trigger: "blur", message: "请输入手机号" },
            { required: true, trigger: "blur", validator: validatorRule.IS_MOBILE },
          ],
          verificationCode: [
            { required: true, trigger: "blur", message: "请输入验证码" },
          ],
        },
        emailForm: {
          principal: "",
          verificationCode: "",
          loginFrom: "0"
        },
        emailRules: {
          principal: [
            { required: true, trigger: "blur", message: "请输入邮箱" },
            { required: true, trigger: "blur", validator: validatorRule.IS_EMAIL },
          ],
          verificationCode: [
            { required: true, trigger: "blur", message: "请输入验证码" },
          ],
        },
        captchaFlag: false,
        loading: false,
        passwordType: "password",
        redirect: undefined,
        captchaImg: "",
      };
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || "/";
        },
        immediate: true,
      },
    },
    created() {
      document.body.style.overflow = "hidden";
      this.form.uuid = uuid();
      this.captchaImg = captcha(this.form.uuid);

      // 2秒后弹出快速登陆
      setTimeout(this.tipsBtnClick, 2000);
    },
    beforeDestroy() {
      document.body.style.overflow = "auto";
    },
    methods: {
      // TODO 演示使用 开发手动删除
      tipsBtnClick(){
        // TODO 演示使用 开发手动删除
        this.$refs["login-tips"].show();
      },
      // TODO 演示使用 开发手动删除
      tipsClick(ret){
        // 点击登录
        this.form.username = ret.username;
        this.form.password = ret.password;
        this.handleLogin();
      },
      // 获得新验证码
      getCaptcha() {
        this.captchaImg = captcha(this.form.uuid);
      },
      handleLogin() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            // 封装数据
            let loginData = {
              principal: this.form.username,
              password: this.form.password,
              verificationCode: this.form.captcha,
              uuid: this.form.uuid,
              loginFrom: "0"
            }

            this.loading = true;
            this.$store
              .dispatch("user/login", loginData)
              .then(() => {
                const routerPath =
                  this.redirect === "/404" || this.redirect === "/401"
                    ? "/"
                    : this.redirect;
                this.$router.push(routerPath).catch(() => {});
                this.loading = false;
              })
              .catch(() => {
                // 获取当前失败次数
                this.$store
                  .dispatch("user/getSlipCount", this.form)
                  .then((ret) => {
                    this.loading = false;
                    const { data } = ret;
                    if (!isNull(data) && data.curr >= data.base) {
                      // 失败次数大于系统规定阈值 开启验证码校验
                      this.captchaFlag = true;
                    }
                  })
                  .catch(() => {
                    this.loading = false;
                  });
              });
          } else {
            return false;
          }
        });
      },

      // 发送手机验证码
      handleSendMobileCode(el) {
        if(isNull(this.mobileForm.principal)){
          this.$baseMessage("请输入手机号", "error");
          return;
        }
        if(!isMobile(this.mobileForm.principal)){
          this.$baseMessage(getMsg("isMobile"), "error");
          return;
        }

        // 导出按钮防抖处理 默认限制为60秒
        vueButtonClickBan(el, 60);

        const tmpForm = {
          mobile: this.mobileForm.principal,
          type: this.codeType
        }
        this.$store.dispatch("user/sendMobileCode", tmpForm);
      },

      // 发送邮箱验证码
      handleSendEmailCode(el) {
        if(isNull(this.emailForm.principal)){
          this.$baseMessage("请输入邮箱", "error");
          return;
        }
        if(!isEmail(this.emailForm.principal)){
          this.$baseMessage(getMsg("isEmail"), "error");
          return;
        }

        // 导出按钮防抖处理 默认限制为60秒
        vueButtonClickBan(el, 60);

        const tmpForm = {
          email: this.emailForm.principal,
          type: this.codeType
        }
        this.$store.dispatch("user/sendEmailCode", tmpForm);
      },

      // 验证码登陆
      handleLoginByCode(ref, rForm) {
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.loading = true;
            this.$store
              .dispatch("user/loginByCode", rForm)
              .then(() => {
                const routerPath =
                  this.redirect === "/404" || this.redirect === "/401"
                    ? "/"
                    : this.redirect;
                this.$router.push(routerPath).catch(() => {});
                this.loading = false;
              })
              .catch(() => {
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      },

    },
  };
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background: url("~@/assets/login_images/background.jpg") center center fixed
      no-repeat;
    background-size: cover;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: rgba(14, 18, 26, 1);
    }

    .title-tips {
      margin-top: 29px;
      font-size: 26px;
      font-weight: 400;
      color: rgba(14, 18, 26, 1);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .login-btn {
      //display: inherit;
      width: 220px;
      height: 60px;
      margin-top: 5px;
      border: 0;

      &:hover {
        opacity: 0.9;
      }
    }

    .other-btn {
      //display: inherit;
      width: 118px;
      height: 60px;
      margin-top: 5px;

      &:hover {
        opacity: 0.9;
      }
    }

    .login-form {
      position: relative;
      max-width: 100%;
      margin: calc((100vh - 425px) / 2) 10% 10%;
      overflow: hidden;

      .forget-password {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-pass {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    .svg-container {
      position: absolute;
      top: 14px;
      left: 15px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    .captcha {
      position: absolute;
      top: -2.5px;
      right: 0;
      width: 180px;
      height: 58px;
      margin-top: 2px;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          height: 58px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 58px;
          color: $base-font-color;
          background: #f6f4fc;
          border: 0;
          caret-color: $base-font-color;
        }
      }
    }
  }
</style>

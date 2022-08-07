<template>
  <div class="auth-verify">
    <el-form
      ref="verifyForm"
      :model="verifyForm"
      :rules="verifyFormRules"
      label-width="80px"
    >
      <div class="align-center">
        <el-link type="info" :underline="false" class="auth-title">
          用户身份认证
        </el-link>
      </div>
      <el-alert
        v-if="alert != null"
        :title="alert"
        type="warning"
        :closable="false"
      ></el-alert>
      <el-tabs v-model="active">
        <el-tab-pane label="邮箱验证" name="verifyFormEmail">
          <el-form-item label="邮箱地址" prop="verifyFormEmail">
            <el-input
              :placeholder="baseForm.email"
              readonly
              class="input-with-select"
            >
              <el-button slot="append" @click="handleSendSelfEmailCode">
                获取验证码
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input
              v-model.trim="verifyForm.verificationCode"
              placeholder="请输入验证码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="手机验证" name="verifyFormMobile">
          <el-form-item label="邮箱地址" prop="verifyFormMobile">
            <el-input
              :placeholder="baseForm.mobile"
              readonly
              class="input-with-select"
            >
              <el-button slot="append" @click="handleSendSelfMobileCode">
                获取验证码
              </el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="verificationCode">
            <el-input
              v-model.trim="verifyForm.verificationCode"
              placeholder="请输入验证码"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="check">验 证</el-button>
    </div>
  </div>
</template>

<script>
  import {
    getUserInfo,
    sendSelfEmailCode,
    checkSelfEmailCode,
    sendSelfMobileCode,
    checkSelfMobileCode,
  } from "@/api/user";
  import { getAccessToken } from "@/utils/accessToken";
  import { isNull } from "@/utils/validate";
  import { vueButtonClickBan } from "@/utils";
  export default {
    name: "AuthVerify",
    props: {
      alert: {
        type: String,
        default: () => {
          return null;
        },
      },
    },
    data() {
      return {
        active: "verifyFormEmail",
        baseForm: {},
        verifyForm: {
          codeType: "1",
          verificationCode: "",
        },
        verifyFormRules: {
          verificationCode: [
            { required: true, trigger: "blur", message: "请输入验证码" },
          ],
        },
      };
    },
    created() {
      // 加载用户信息
      this.fetchData();
    },
    methods: {
      // 初始化
      init() {
        this.verifyForm = this.$options.data().verifyForm;
        this.active = "verifyFormEmail";
      },
      // 发送邮箱验证码
      async handleSendSelfEmailCode(el) {
        // 导出按钮防抖处理 默认限制为60秒
        vueButtonClickBan(el, 60, false);
        const { msg } = await sendSelfEmailCode(this.verifyForm.codeType);
        this.$baseMessage(msg, "success");
      },
      // 发送手机验证码
      async handleSendSelfMobileCode(el) {
        // 导出按钮防抖处理 默认限制为60秒
        vueButtonClickBan(el, 60, false);
        const { msg } = await sendSelfMobileCode(this.verifyForm.codeType);
        this.$baseMessage(msg, "success");
      },
      // 验证
      async check() {
        this.$refs["verifyForm"].validate(async (valid) => {
          if (valid) {
            if (this.active === "verifyFormEmail") {
              const { data } = await checkSelfEmailCode(
                this.verifyForm.codeType,
                this.verifyForm.verificationCode
              );
              if (data) {
                this.$emit("update-certificate", data);
              }
            } else if (this.active === "verifyFormMobile") {
              const { data } = await checkSelfMobileCode(
                this.verifyForm.codeType,
                this.verifyForm.verificationCode
              );
              if (data) {
                this.$emit("update-certificate", data);
              }
            }
            // 初始化
            this.init();
          }
        });
      },
      // 获取数据
      async fetchData() {
        let accessToken = getAccessToken();
        const { data } = await getUserInfo(accessToken);
        if (!isNull(data)) {
          this.baseForm = Object.assign({}, data);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .auth-verify {
    .auth-title {
      width: 100%;
      text-align: center;
      font-size: 22px;
      padding-bottom: 10px;
    }
    .dialog-footer {
      padding: 20px;
      text-align: right;
      border-top: 1px solid #dcdfe6;
      display: grid;
      overflow: hidden;
      box-sizing: border-box;
    }
  }
</style>

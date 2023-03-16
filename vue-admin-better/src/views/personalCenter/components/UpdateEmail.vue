<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="500px"
    @close="close"
  >
    <!-- 身份认证 -->
    <auth-verify
      v-if="!isOk"
      alert="更换邮箱后，你将无法通过 「原邮箱+密码」 登录"
      ref="auth-verify"
      @update-certificate="updateCertificate"
    >
    </auth-verify>

    <el-form ref="form" v-if="isOk"
             :model="form"
             :rules="rules" label-width="80px" class="update-password-container">

      <el-form-item label="邮箱地址" prop="email">
        <el-input placeholder="请输入邮箱"
                  v-model.trim="form.email"
                  class="input-with-select">
          <el-button slot="append"
                     @click="handleSendEmailCode">
            获取验证码
          </el-button>
        </el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="verificationCode">
        <el-input
          placeholder="请输入验证码"
          v-model.trim="form.verificationCode"
          autocomplete="off"
        ></el-input>
      </el-form-item>

    </el-form>
    <div v-if="isOk" slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doUpdateEmail } from "@/api/system/user/userManagement";
  import { validatorRule } from "@/utils/validateRlue";
  import AuthVerify from "@/components/opsli/auth/AuthVerify";
  import { sendEmailCode } from "@/api/user";
  import { isNull } from "@/utils/validate";
  import { getMsg, isEmail} from "@/utils/valiargs";
  import {vueButtonClickBan} from "@/utils";

  export default {
    name: "UpdateEmail",
    components: { AuthVerify },
    data() {
      return {
        isOk: false,
        codeType: "1",
        form: {
          email: "",
          verificationCode: "",
          certificate: ""
        },
        rules: {
          email: [
            { required: true, trigger: "blur", message: "请输入邮箱" },
            { required: true, trigger: "blur", validator: validatorRule.IS_EMAIL },
          ],
          verificationCode: [
            { required: true, trigger: "blur", message: "请输入验证码" },
          ],
        },
        title: "修改邮箱",
        dialogFormVisible: false,
      };
    },
    methods: {
      // 回调方法
      updateCertificate(certificate){
        this.isOk = true;
        this.form.certificate = certificate;
      },

      // 发送邮箱验证码
      async handleSendEmailCode(el){
        if(isNull(this.form.email)){
          this.$baseMessage("请输入邮箱", "error");
          return;
        }
        if(!isEmail(this.form.email)){
          this.$baseMessage(getMsg("isEmail"), "error");
          return;
        }

        // 导出按钮防抖处理 默认限制为60秒
        vueButtonClickBan(el, 60, false);

        const tmpForm = {
          email: this.form.email,
          type: this.codeType
        }
        const { msg } = await sendEmailCode(tmpForm);
        this.$baseMessage(msg, "success");
      },

      show() {
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.isOk = false;
        this.form = this.$options.data().form;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 修改密码
            const { msg } = await doUpdateEmail(this.form);
            this.$baseMessage(msg, "success");
            await this.$emit("fetchData");
            this.close();
          }
        });
      },
    },
  };
</script>
<style lang="scss" scoped>
.update-password-container {

  .show-password {
    position: absolute;
    top: 1px;
    right: 13px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

}
</style>

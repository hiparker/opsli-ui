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
      ref="auth-verify"
      @update-certificate="updateCertificate"
    >
    </auth-verify>

    <el-form ref="form" v-if="isOk"
             :model="form"
             :rules="rules" label-width="80px" class="update-password-container">

      <el-form-item label="新密码" prop="newPassword">
        <el-input
          type="password"
          v-model.trim="form.newPassword"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item label="确认密码" prop="verifyPassword">
        <el-input
          type="password"
          v-model.trim="form.verifyPassword"
          autocomplete="off"
          show-password
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
  import { doUpdatePasswordByForget } from "@/api/system/user/userManagement";
  import { validatorRule } from "@/utils/validateRlue";
  import AuthVerify from "@/components/opsli/auth/AuthVerify";

  export default {
    name: "UpdatePasswordByForget",
    components: { AuthVerify },
    data() {

      const validateVerifyPassword = (rule, value, callback) => {
        if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        isOk: false,
        baseForm: {},
        form: {
          email: "",
          verificationCode: "",
          certificate: ""
        },
        rules: {
          newPassword: [
            { required: true, trigger: "blur", message: "请输入密码" },
            { required: true, trigger: "blur", validator: validatorRule.IS_SECURITY_PASSWORD },
          ],
          verifyPassword: [
            { required: true, trigger: "blur", message: "请再次输入密码" },
            { required: true, trigger: "blur", validator: validateVerifyPassword },
          ],
        },
        title: "忘记密码-修改密码",
        dialogFormVisible: false,
      };
    },
    methods: {
      // 回调方法
      updateCertificate(certificate){
        this.isOk = true;
        this.form.certificate = certificate;
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
            const { msg } = await doUpdatePasswordByForget(this.form);
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

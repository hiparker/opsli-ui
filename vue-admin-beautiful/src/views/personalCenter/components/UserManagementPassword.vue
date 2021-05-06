<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="500px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" class="update-password-container">

      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          type="password"
          v-model.trim="form.oldPassword"
          autocomplete="off"
          show-password
        ></el-input>
      </el-form-item>

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
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { doUpdatePassword } from "@/api/sys/user/userManagement";
  import { isNull, isPassword } from "@/utils/validate";

  export default {
    name: "UserManagementPassword",
    data() {
      const validatePassword = (rule, value, callback) => {
        if (isNull(value)) {
          callback(new Error('请输入密码'));
        } else if (!isPassword(value)) {
          callback(new Error("密码至少包含大写字母，小写字母，数字，且不少于6位"));
        } else {
          callback();
        }
      };

      const validateVerifyPassword = (rule, value, callback) => {
        if (isNull(value)) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        form: {
          oldPassword: "",
          newPassword: "",
          verifyPassword: "",
        },
        rules: {
          oldPassword: [
            { required: true, trigger: "blur", message: "请输入旧密码" },
          ],
          newPassword: [
            { required: true, trigger: "blur", validator: validatePassword },
          ],
          verifyPassword: [
            { required: true, trigger: "blur", validator: validateVerifyPassword },
          ],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {},
    methods: {
      showUpdatePassword() {
        this.title = "修改密码";
        this.dialogFormVisible = true;
      },
      close() {
        this.form.oldPassword = "";
        this.form.newPassword = "";
        this.form.verifyPassword = "";
        this.dialogFormVisible = false;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 修改密码
            const { success, msg } = await doUpdatePassword(this.form);
            if(success){
              this.$baseMessage(msg, "success");
              await this.$emit("fetchData");
            }
            this.close();
          } else {
            return false;
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

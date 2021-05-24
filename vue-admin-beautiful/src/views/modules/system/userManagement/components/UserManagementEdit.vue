<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px" class="userManagement-edit-container">
      <el-row :gutter="10" >

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <!-- 大型项目设计都不是不允许修改用户名的 可能会关联很多地方 -->
          <!-- 修改不允许改用户名 -->
          <el-form-item label="用户名" prop="username">
            <el-input v-model.trim="form.username" autocomplete="off"
                      :disabled="!formStatus"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="昵称" prop="realName">
            <el-input v-model="form.realName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <!-- 如果是新增 则可以直接设置用户密码 修改则不允许 -->
        <el-col v-if="formStatus" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="密码" prop="password">
            <el-input
                type="password"
                v-model.trim="form.password"
                autocomplete="off"
                show-password
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col v-if="formStatus" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="确认密码" prop="verifyPassword">
            <el-input
              type="password"
              v-model.trim="form.verifyPassword"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="工号" prop="no">
            <el-input v-model.trim="form.no" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="手机" prop="mobile">
            <el-input v-model.trim="form.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model.trim="form.email" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="签名" prop="sign">
            <el-input type="textarea" v-model="form.sign" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <!-- 如果是超级管理员 可以设置租户 -->
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12"
                v-if="userInfo != null && (userInfo.izSuperAdmin || $perms('system_user_tenant'))"
          >
            <el-form-item label="租户ID" prop="icon">
              <el-input v-model="form.tenantId" autocomplete="off" readonly ></el-input>
              <el-button type="primary" icon="el-icon-search"
                         class="input-btn-choose" @click="showTenant"></el-button>
            </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" >
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>

    <tenant
      v-on:tenant="closeTenant"
      ref="tenant"
    ></tenant>

  </el-dialog>
</template>

<script>
  import { doInsert, doUpdate } from "@/api/system/user/userManagement";
  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo } from "@/api/user";
  import Tenant from "@/components/opsli/tenant/tenant";
  import { isNull } from "@/utils/validate";
  import {
    validateIsGeneral,
    validateIsMobile,
    validateIsGeneralWithChinese,
    validateIsSecurityPassword,
    validateIsEmail
  } from "@/utils/validateRlue";

  export default {
    name: "UserManagementEdit",
    components: { Tenant },
    data() {

      const validateVerifyPassword = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };

      return {
        userInfo: null,
        dict: {},
        formStatus: true,
        form: {
          tenantId:"",
          locked: '0',
          // 设置默认值
          version: 0
        },
        rules: {
          username: [
            { required: true, trigger: "blur", message: "请输入用户名" },
            { required: false, trigger: "blur", validator: validateIsGeneral },
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入密码" },
            { required: false, trigger: "blur", validator: validateIsSecurityPassword },
          ],
          verifyPassword: [
            { required: true, trigger: "blur", message: "请再次输入密码" },
            { required: false, trigger: "blur", validator: validateVerifyPassword },
          ],
          realName: [
            { required: true, trigger: "blur", message: "请输入昵称" },
            { required: false, trigger: "blur", validator: validateIsGeneralWithChinese() },
          ],
          no: [
            { required: true, trigger: "blur", message: "请输入工号" },
            { required: true, trigger: "blur", validator: validateIsGeneral },
          ],
          mobile: [
            { required: false, trigger: "blur", validator: validateIsMobile },
          ],
          email: [
            { required: false, trigger: "blur", validator: validateIsEmail },
          ],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {
      this.getUser();
    },
    mounted() {
      // 如果不是每次开启时查询 在created中 有可能会短暂查不到
      this.dict.no_yes =  this.$getDictList("no_yes")
    },
    methods: {
      // 展示租户
      showTenant(){
        this.$refs["tenant"].show();
      },
      // 租户关闭
      closeTenant(val){
        this.form.tenantId = val.id;
      },
      showEdit(row) {
        if (!row) {
          this.title = "添加";
        } else {
          this.title = "编辑";
          this.formStatus = false;
          this.form = Object.assign({}, row);
        }
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.formStatus = true;
        this.form = this.$options.data().form;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 修改
            if (!isNull(this.form.id)) {
              const { success, msg } = await doUpdate(this.form);
              if(success){
                this.$baseMessage(msg, "success");
              }
            } else {
              const { success, msg } = await doInsert(this.form);
              if(success){
                this.$baseMessage(msg, "success");
              }
            }

            await this.$emit("fetchData");
            this.close();
          } else {
            return false;
          }
        });
      },
      // 获取当前登录用户数据
      async getUser() {
        this.listLoading = true;
        let accessToken = getAccessToken();
        const { data } = await getUserInfo(accessToken);
        if(!isNull(data)){
          this.userInfo = Object.assign({}, data);
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
.userManagement-edit-container {

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

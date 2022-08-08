<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    append-to-body
    width="800px"
    @close="close"
  >
    <el-alert
      title="绑定邮箱/手机 后会替换当前系统内已有改邮箱/手机的用户"
      style="margin-bottom: 15px"
      type="warning" :closable="false">
    </el-alert>
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

        <!-- 如果是超级管理员 可以设置系统用户切换租户 -->
        <el-col
          v-if="null != userInfo && null === userInfo.switchTenantId && null === args &&
            (userInfo.izSuperAdmin || $perms('system_user_tenant'))
          "
          :xs="24"
          :sm="24"
          :md="24"
          :lg="12"
          :xl="12"
        >
          <el-form-item
            label="切换租户"
            prop="enableChangeOperator"
          >
            <el-select
              v-model="form.enableSwitchTenant"
              :popper-append-to-body="false"
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in $getDictList('no_yes')"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              />
            </el-select>
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

  </el-dialog>
</template>

<script>
  import { doInsert, doUpdate, doSetOrg } from "@/api/system/user/userManagement";
  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo } from "@/api/user";
  import { isNull } from "@/utils/validate";
  import { validatorRule } from "@/utils/validateRlue";

  export default {
    name: "UserManagementEdit",
    components: { },
    data() {

      const validateVerifyPassword = (rule, value, callback) => {
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };

      return {
        userInfo: {},
        dict: {},
        formStatus: true,
        // 用于判断 租户管理员 编辑界面 是否允许切换运营商 按钮显示问题
        args: null,
        // 组织节点
        orgNode: null,
        form: {
          enableSwitchTenant: "0",
          tenantId:"",
          locked: "0",
          // 设置默认值
          version: 0
        },
        rules: {
          username: [
            { required: true, trigger: "blur", message: "请输入用户名" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL },
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入密码" },
            { required: false, trigger: "blur", validator: validatorRule.IS_SECURITY_PASSWORD },
          ],
          verifyPassword: [
            { required: true, trigger: "blur", message: "请再次输入密码" },
            { required: false, trigger: "blur", validator: validateVerifyPassword },
          ],
          realName: [
            { required: true, trigger: "blur", message: "请输入昵称" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
          ],
          no: [
            { required: true, trigger: "blur", message: "请输入工号" },
            { required: true, trigger: "blur", validator: validatorRule.IS_GENERAL },
          ],
          mobile: [
            { required: true, trigger: "blur", message: "请输入手机" },
            { required: false, trigger: "blur", validator: validatorRule.IS_MOBILE },
          ],
          email: [
            { required: true, trigger: "blur", message: "请输入邮箱" },
            { required: false, trigger: "blur", validator: validatorRule.IS_EMAIL },
          ],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {
      this.getUser();
    },
    methods: {
      showInsertAndBindOrg(orgNode) {
        this.title = "添加";
        this.orgNode = orgNode;
        this.dialogFormVisible = true;
      },
      showEdit(row, args) {
        if (!row) {
          this.title = "添加";
        } else {
          this.title = "编辑";
          this.formStatus = false;
          this.form = Object.assign({}, row);
        }

        // 参数默认赋值
        if(!isNull(args)){
          this.args = args;
          for(let key in args){
            if (args.hasOwnProperty(key)) {
              this.form[key] = args[key];
            }
          }
        }

        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        // 防止出现幻影 延时清空数据
        setTimeout(()=>{
          this.$refs["form"].resetFields();
          this.orgNode = null;
          this.formStatus = true;
          this.args = null;
          this.form = this.$options.data().form;
        }, 100)
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 修改
            if (!isNull(this.form.id)) {
              const { msg } = await doUpdate(this.form);
              this.$baseMessage(msg, "success");
            } else {
              const { msg, data } = await doInsert(this.form);
              // 如果组织 不为空 则帮助用户绑定组织
              if(data && this.orgNode){
                // 执行 设置组织
                await doSetOrg({
                  userId: data.id,
                  defModel: this.orgNode,
                  orgModelList: [this.orgNode],
                })
              }

              this.$baseMessage(msg, "success");
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

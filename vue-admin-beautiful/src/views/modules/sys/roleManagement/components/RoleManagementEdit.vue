<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色编号" prop="roleCode">
            <el-input v-model="form.roleCode" autocomplete="off"
                      :disabled="!formStatus"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="是否内置" prop="izLock">
            <el-select v-model="form.izLock" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in dict.no_yes"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 如果是超级管理员 可以设置租户 -->
      <el-row v-if="userInfo != null && (userInfo.izSuperAdmin || $perms('system_user_tenant'))" >
        <el-col :span="12">
          <el-form-item label="租户ID" prop="icon">
            <el-input v-model="form.tenantId" autocomplete="off" readonly ></el-input>
            <el-button type="primary" icon="el-icon-search"
                       class="input-btn-choose" @click="showTenant"></el-button>
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
  import { doInsert, doUpdate } from "@/api/roleManagement";
  import { isNull} from "@/utils/validate";
  import {isGeneral, isGeneralWithChinese, isNotNull, getMsg} from "@/utils/valiargs";

  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo } from "@/api/user";
  import Tenant from "@/components/opsli/tenant/tenant";

  export default {
    name: "RoleManagementEdit",
    components: { Tenant },
    data() {

      const validateCode = (rule, value, callback) => {
        if (!isGeneral(value)) {
          callback(new Error(getMsg("isGeneral")));
        } else {
          callback();
        }
      };
      const validateName = (rule, value, callback) => {
        if (!isGeneralWithChinese(value)) {
          callback(new Error(getMsg("isGeneralWithChinese")));
        } else {
          callback();
        }
      };

      return {
        formStatus: true,
        userInfo: null,
        form: {
          tenantId:"",
          izLock: '0',
          // 设置默认值
          version: 0
        },
        dict: {},
        rules: {
          roleCode: [
            { required: true, trigger: "blur", message: "请输入编号" },
            { required: false, trigger: "blur", validator: validateCode },
          ],
          roleName: [
            { required: true, trigger: "blur", message: "请输入名称" },
            { required: false, trigger: "blur", validator: validateName },
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
        this.formStatus = true;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.$emit("fetchData");
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

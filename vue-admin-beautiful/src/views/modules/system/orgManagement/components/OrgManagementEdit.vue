<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px" class="orgManagement-edit-container">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="编号" prop="orgCode">
            <el-input v-model="form.orgCode" autocomplete="off" ></el-input>
            <!-- 如果上级编号不为空 则出现提醒 -->
            <span v-if="base.parentCode !== '' ">
              添加下级只需要写本级编号，如：user
            </span>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="名称" prop="orgName">
            <el-input v-model="form.orgName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="类型" prop="orgType">
            <!-- 修改不允许改类型 -->
            <el-select v-model="form.orgType" placeholder="请选择"
                       default-first-option=""
                       :disabled="!formStatus"
                       style="width: 100%" >
              <el-option
                v-for="item in dict.org_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="排序" prop="sortNo">
            <el-input-number
              :min="1"
              :max="500"
              v-model="form.sortNo"
              autocomplete="off"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <!-- 如果是最顶级类型 切是超级管理员的话 可以设置当前机构对应租户 -->
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="
        ((form.id != null && form.id !== '' && form.orgType === '1') ||
        base.parentType === 0) &&
        userInfo != null && userInfo.izSuperAdmin">
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
  import {doInsert, doUpdate} from "@/api/system/org/orgManagement";
  import { deepClone } from "@/utils/clone";
  import { isNull } from "@/utils/validate";
  import { isNotNull } from "@/utils/valiargs";
  import { validatorRule } from "@/utils/validateRlue";
  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo } from "@/api/user";
  import Tenant from "@/components/opsli/tenant/tenant";

  export default {
    name: "OrgManagementEdit",
    components: {Tenant },
    data() {

      return {
        userInfo: null,
        base: {
          parentCode: "",
          parentType: ""
        },
        formStatus: true,
        form: {
          tenantId:"",
          sortNo: 1,
          version: 0
        },
        dict: {},
        rules: {
          orgCode: [
            { required: true, trigger: "blur", message: "请输入编号" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL },
          ],
          orgName: [
            { required: true, trigger: "blur", message: "请输入名称" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
          ],
          orgType: [{ required: true, trigger: "blur", message: "请选择类型" }],
          sortNo: [{ required: true, trigger: "blur", message: "请输入排序" }],
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
        if (isNull(row) || isNull(row.id)) {
          this.title = "添加";
          // 如果上级菜单名称不为空 则显示到标题上
          if(!isNull(row) && !isNull(row.parentName) &&
            !isNull(row.parentId) && !isNull(row.parentCode)){
            // 设置上级Id
            this.form.parentId = row.parentId;
            this.base.parentCode = row.parentCode;
            this.title += "  - 上级名称 [ " + row.parentName +" ] - 上级编号 [" + this.base.parentCode + "]";
          }

          if(isNull(row) || isNull(row.parentType)){
            this.base.parentType = 0;
          }else{
            this.base.parentType = parseInt(row.parentType);
          }

          // 设置字典
          this.setDictOrgType(true);
        } else {
          this.title = "编辑";
          this.formStatus = false;
          this.form = Object.assign({}, row);
          this.base.parentType = parseInt(this.form.orgType);

          // 设置字典
          this.setDictOrgType(false);
        }

        this.dialogFormVisible = true;
      },
      setDictOrgType(izInsert){
        let that = this;
        // 每一次都需要查一次
        let dictList =  this.$getDictList("org_type")
        this.dict.org_type = [];
        // 处理类型 只有大于父级类型的后续类型才可以
        dictList.forEach(function (val){
          if(isNotNull(val)){
            let dictValue = val.dictValue;
            if(isNotNull(dictValue)){
              try {
                let tmp = parseInt(dictValue);
                if(izInsert && tmp > that.base.parentType && tmp <= that.base.parentType+1){
                  that.dict.org_type.push(val);
                }else if(!izInsert && tmp === that.base.parentType){
                  that.dict.org_type.push(val);
                }
              }catch (e){}
            }
          }
        });
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.formStatus = true;
        this.base.parentCode = "";
        this.base.parentType = null;
        this.dict.org_type = [];
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 字段数据
            let tmpForm = deepClone(this.form);

            // 修改
            if (!isNull(tmpForm.id)) {
              const { success, msg } = await doUpdate(tmpForm);
              if(success){
                this.$baseMessage(msg, "success");
              }
            } else {
              // 如果上级code不为空 则在新增是 拼上上级code
              if(!isNull(this.base.parentCode)){
                tmpForm.orgCode = this.base.parentCode + "_" + tmpForm.orgCode;
              }
              const { success, msg } = await doInsert(tmpForm);
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


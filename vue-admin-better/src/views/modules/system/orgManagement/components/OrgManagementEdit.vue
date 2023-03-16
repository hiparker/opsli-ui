<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="850px"
    @close="close"
  >
    <el-form ref="form" v-loading="formLoading" :model="form" :rules="rules" label-width="105px"
             class="orgManagement-edit-container">
      <el-row :gutter="10" >

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="上级机构" prop="parentId">
            <el-input
              v-model="parentOrg.orgName"
              :readonly="true"
              autocomplete="off"
              @click.native="showParentOrg"
            ></el-input>

            <!-- :disabled="formStatus && (edenOldParentId != null && edenOldParentId !== '')" -->
            <el-button type="primary" icon="el-icon-search"
                      :disabled="true"
                       class="input-btn-choose" @click="showParentOrg"></el-button>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="编号" prop="orgCode">
              <el-tooltip class="item" effect="dark"
                          :content="'自动继承父级编号:    ' + parentOrg.orgCode + '_ '"
                          placement="top-start" v-model="codeTip" manual
              >
                <el-input v-model="form.orgCode"
                          :disabled="!formStatus">
                </el-input>
              </el-tooltip>
            </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="名称" prop="orgName">
            <el-input v-model="form.orgName" autocomplete="off"></el-input>
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

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
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

    <org-single-choose
      ref="org-single-choose"
      @choose="orgSingleChoose"
    ></org-single-choose>

  </el-dialog>
</template>

<script>
  import { get, doInsert, doUpdate } from "@/api/system/org/orgManagement";
  import { deepClone } from "@/utils/clone";
  import { isNull } from "@/utils/validate";
  import { validatorRule } from "@/utils/validateRlue";

  import OrgSingleChoose from "@/components/opsli/org/OrgSingleChoose";

  export default {
    name: "OrgManagementEdit",
    components: {OrgSingleChoose },
    data() {

      return {
        codeTip: false,
        formStatus: true,
        genParentId: "",
        edenOldParentId: "",
        oldParentId: "",
        parentOrg: {},
        form: {
          parentId: "0",
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
          sortNo: [{ required: true, trigger: "blur", message: "请输入排序" }],
        },
        title: "",
        formLoading: true,
        dialogFormVisible: false,
      };
    },
    created() {
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

      orgSingleChoose(node){
        this.parentOrg = node;
        this.form.parentId = this.parentOrg.id;
      },
      // 选择上级机构
      showParentOrg(){
        return;

        // TODO 因为逻辑问题 不允许更换上级机构
        if(this.edenOldParentId && this.formStatus){
          return;
        }

        this.$refs["org-single-choose"]
          .showOrgChoose(this.form.id);
      },
      showEdit(row) {
        if (isNull(row) || isNull(row.id)) {
          this.title = "添加机构";
          // 如果上级菜单名称不为空 则显示到标题上
          if(!isNull(row) && !isNull(row.parentName) &&
            !isNull(row.parentId) && !isNull(row.parentCode)){
            // 设置上级Id
            this.edenOldParentId = row.parentId;
            this.form.parentId = row.parentId;
          }

        } else {
          this.title = "编辑机构";
          this.formStatus = false;
          this.form = Object.assign({}, row);
        }

        // 设置 编号提醒项
        if(this.formStatus && this.edenOldParentId){
          setTimeout(()=>{
            this.codeTip = true;
          }, 200);
        }

        this.oldParentId = this.form.parentId;

        this.dialogFormVisible = true;
        // 加载上级菜单数据
        this.fetchData();
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.codeTip = false;
        this.formStatus = true;
        this.formLoading = true;
        this.edenOldParentId = "";
        this.oldParentId = "";
        this.genParentId = "";
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 字段数据
            let tmpForm = deepClone(this.form);

            // 修改
            if (!isNull(tmpForm.id)) {
              const { msg } = await doUpdate(tmpForm);
              this.$baseMessage(msg, "success");
            } else {
              // 如果上级code不为空 则在新增是 拼上上级code
              if(!isNull(this.parentOrg.orgCode)){
                tmpForm.orgCode = this.parentOrg.orgCode + "_" + tmpForm.orgCode;
              }
              const { msg } = await doInsert(tmpForm);
              this.$baseMessage(msg, "success");
            }

            // 刷新标签
            if(!isNull(this.oldParentId)){
              this.$emit("refreshNodeBy", this.oldParentId);
            }
            if(!isNull(this.parentOrg.parentId)){
              this.$emit("refreshNodeBy", this.parentOrg.parentId);
            }
            this.$emit("refreshNodeBy", this.form.parentId);

            this.close();
          } else {
            return false;
          }
        });
      },
      // 获得机构数据
      async fetchData() {
        this.formLoading = true;
        const { data } = await get({id: this.form.parentId});
        if(data){
          this.parentOrg = data;
        }

        setTimeout(() => {
          this.formLoading = false;
        }, 300);
      },
    },
  };
</script>

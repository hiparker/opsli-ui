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
          <el-form-item label="公司" prop="companyName">
            <el-input ref="companyName"
                      v-model="form.companyName" autocomplete="off" readonly
                      style="width: calc(100% - 44px)"
            ></el-input>
            <span class="input-clear" @click="setOrgCompany(null)">
              <i class="el-icon-close"></i>
            </span>
            <el-button type="primary" icon="el-icon-search"
                       class="input-btn-choose" @click="showCompany"></el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="部门" prop="departmentName">
            <el-input v-model="form.departmentName" autocomplete="off" readonly
                      style="width: calc(100% - 44px)"
            >
            </el-input>
            <span class="input-clear" @click="setOrgDepartment(null)">
              <i class="el-icon-close"></i>
            </span>
            <el-button type="primary" icon="el-icon-search"
                       class="input-btn-choose" @click="showDepartment"></el-button>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="岗位" prop="postName">
            <el-input v-model="form.postName" autocomplete="off" readonly
              style="width: calc(100% - 44px)"
            ></el-input>
            <span class="input-clear" @click="setOrgPost(null)">
              <i class="el-icon-close"></i>
            </span>
            <el-button type="primary" icon="el-icon-search"
                       class="input-btn-choose" @click="showPost"></el-button>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>

    <org ref="orgCompany" @resultNode="setOrgCompany" ></org>
    <org ref="orgDepartment" @resultNode="setOrgDepartment" ></org>
    <org ref="orgPost" @resultNode="setOrgPost" ></org>

  </el-dialog>
</template>

<script>
  import { getOrgByUserId, doSetOrg } from "@/api/system/user/userManagement";
  import { isNull} from "@/utils/validate";
  import Org from "@/components/opsli/org/org";

  export default {
    name: "UserManagementSetOrg",
    components: { Org },
    data() {
      return {
        form: {
          userId: '',
          companyId: '',
          companyName: '',
          departmentId: '',
          departmentName: '',
          postId: '',
          postName: '',
        },
        rules: {
          companyName : [
            { required: true, trigger: "blur", message: "公司不可为空" },
          ]
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      // 显示公司
      showCompany() {
        let row = {
          parentId: "0",
          orgType: "1"
        };
        this.$refs["orgCompany"].showOrg(row);
      },
      setOrgCompany(node){
        this.form.companyId = "";
        this.form.companyName = "";
        // 清空 部门和岗位 防止脏数据
        this.form.departmentId = "";
        this.form.departmentName = "";
        this.form.postId = "";
        this.form.postName = "";

        if(!isNull(node)){
          this.form.companyId = node.id;
          this.form.companyName = node.orgName;
        }
      },
      // 显示部门
      showDepartment() {
        let parentId = this.form.companyId;
        if(isNull(parentId)){
          this.$baseMessage("请先选择公司", "error");
          return;
        }
        let row = {
          parentId: parentId,
          orgType: "2"
        };
        this.$refs["orgDepartment"].showOrg(row);
      },
      setOrgDepartment(node){
        this.form.departmentId = "";
        this.form.departmentName = "";
        // 清空 岗位 防止脏数据
        this.form.postId = "";
        this.form.postName = "";

        if(!isNull(node)){
          this.form.departmentId = node.id;
          this.form.departmentName = node.orgName;
        }
      },
      // 显示岗位
      showPost() {
        let parentId = this.form.departmentId;
        if(isNull(parentId)){
          this.$baseMessage("请先选择部门", "error");
          return;
        }
        let row = {
          parentId: parentId,
          orgType: "3"
        };
        this.$refs["orgPost"].showOrg(row);
      },
      setOrgPost(node){
        this.form.postId = "";
        this.form.postName = "";
        if(!isNull(node)){
          this.form.postId = node.id;
          this.form.postName = node.orgName;
        }
      },
      showEdit(row){
        // 加载数据
        if(!row){
          this.$baseMessage("未选择用户", "error");
          return;
        }
        this.form.userId = row.id;
        this.fetchData();

        this.title = "设置组织机构";
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {

            // 执行 设置角色
            const {success, msg} = await doSetOrg(this.form);
            if (success) {
              this.$baseMessage(msg, "success");
            }
            this.close();
          } else {
            return false;
          }
        });
      },
      async fetchData() {
        const { data } = await getOrgByUserId({userId: this.form.userId});
        if(!isNull(data)){
          this.form = data;
        }
      },


    },
  };
</script>

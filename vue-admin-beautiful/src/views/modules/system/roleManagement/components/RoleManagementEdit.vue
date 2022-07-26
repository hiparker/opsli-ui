<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="角色编号" prop="roleCode">
            <el-input v-model="form.roleCode" autocomplete="off"
                      :disabled="!formStatus"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="数据范围" prop="dataScope">
            <el-select v-model="form.dataScope" placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in $getDictList('role_data_scope')"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
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

  </el-dialog>
</template>

<script>
  import { doInsert, doUpdate } from "@/api/system/role/roleManagement";
  import { isNull} from "@/utils/validate";
  import { validatorRule } from "@/utils/validateRlue";

  import { getAccessToken } from "@/utils/accessToken";
  import { getUserInfo } from "@/api/user";

  export default {
    name: "RoleManagementEdit",
    components: { },
    data() {

      return {
        formStatus: true,
        userInfo: null,
        form: {
          label: "",
          tenantId:"",
          izLock: '0',
          dataScope: '0',
          // 设置默认值
          version: 0
        },
        dict: {},
        rules: {
          roleCode: [
            { required: true, trigger: "blur", message: "请输入编号" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL },
          ],
          roleName: [
            { required: true, trigger: "blur", message: "请输入名称" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
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
      showEdit(row, activeName) {
        if (!row) {
          this.title = "添加";
        } else {
          this.title = "编辑";
          this.formStatus = false;
          this.form = Object.assign({}, row);
        }
        this.form.label = activeName;
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.formStatus = true;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 修改
            if (!isNull(this.form.id)) {
              const { msg } = await doUpdate(this.form);
              this.$baseMessage(msg, "success");
            } else {
              const { msg } = await doInsert(this.form);
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

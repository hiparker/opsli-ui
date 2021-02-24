<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px" class="areaManagement-edit-container">
      <el-row>
        <el-col :span="12">
          <el-form-item label="编号" prop="areaCode">
            <el-input v-model="form.areaCode" autocomplete="off" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="areaName">
            <el-input v-model="form.areaName" autocomplete="off"></el-input>
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
  import {doInsert, doUpdate} from "@/api/areaManagement";
  import { deepClone } from "@/utils/clone";
  import { isNull } from "@/utils/validate";
  import { isNumber, isGeneralWithChinese, getMsg} from "@/utils/valiargs";

  export default {
    name: "AreaManagementEdit",
    components: { },
    data() {
      const validateCode = (rule, value, callback) => {
        if (!isNumber(value)) {
          callback(new Error(getMsg("isNumber")));
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
        form: {
          version: 0
        },
        dict: {},
        rules: {
          areaCode: [
            { required: true, trigger: "blur", message: "请输入编号" },
            { required: false, trigger: "blur", validator: validateCode },
          ],
          areaName: [
            { required: true, trigger: "blur", message: "请输入名称" },
            { required: false, trigger: "blur", validator: validateName },
          ],
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
      showEdit(row) {
        if (isNull(row) || isNull(row.id)) {
          this.title = "添加";
          // 如果上级菜单名称不为空 则显示到标题上
          if(!isNull(row) && !isNull(row.parentName) &&
            !isNull(row.parentId) && !isNull(row.parentCode)){
            // 设置上级Id
            this.form.parentId = row.parentId;
            this.title += "  - 上级名称 [ " + row.parentName +" ] - 上级编号 [" + row.parentCode + "]";
          }
        } else {
          this.title = "编辑";
          this.form = Object.assign({}, row);
        }
        this.dialogFormVisible = true;
      },
      close() {
        // 字段数据
        let tmpForm = deepClone(this.form);
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.$emit("refreshNodeBy",tmpForm.parentId);
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
              const { success, msg } = await doInsert(tmpForm);
              if(success){
                this.$baseMessage(msg, "success");
              }
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


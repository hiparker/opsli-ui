<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="125px">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典类型编号" prop="typeCode">
            <el-input v-model="form.typeCode" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典类型名称" prop="typeName">
            <el-input v-model="form.typeName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
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
  import { doInsert, doUpdate } from "@/api/system/dict/dictManagement";
  import { isNotNull } from "@/utils/valiargs";
  import { validatorRule } from "@/utils/validateRlue";
  export default {
    name: "DictManagementEdit",
    data() {
      return {
        form: {
          izLock: '0',
          // 设置默认值
          version: 0
        },
        dict: {},
        rules: {
          typeCode: [
            { required: true, trigger: "blur", message: "请输入编号" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL },
          ],
          typeName: [
            { required: true, trigger: "blur", message: "请输入名称" },
            { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
          ],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {

    },
    mounted() {
      // 如果不是每次开启时查询 在created中 有可能会短暂查不到
      this.dict.no_yes =  this.$getDictList("no_yes")
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = "添加";
        } else {
          this.title = "编辑";
          this.form = Object.assign({}, row);
        }
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
            // 修改
            if (isNotNull(this.form.id)) {
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
    },
  };
</script>

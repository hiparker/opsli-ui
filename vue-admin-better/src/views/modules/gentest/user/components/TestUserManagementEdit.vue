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
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="金钱" prop="money">
            <el-input v-model="form.money" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="生日" prop="birth">
            <el-date-picker
              v-model="form.birth"
              type="date"
              placeholder="选择生日日期"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="是否启用" prop="izUsable">
            <el-select
              v-model="form.izUsable"
              clearable
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in dict.no_yes"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
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
  import { doInsert, doUpdate } from "@/api/gentest/user/TestUserManagement";
  import { formateDate } from "@/utils/format";
  import { isNull } from "@/utils/validate";
  import { validatorRule } from "@/utils/validateRlue";

  export default {
    name: "TestUserManagementEdit",
    data() {


      return {
        form: {
          // 设置默认值
          version: 0,
        },
        dict: {},
        rules: {
          name: [
            {
              required: false,
              trigger: "blur",
              validator: validatorRule.IS_GENERAL_WITH_CHINESE,
            },
          ],
          money: [
            { required: true, trigger: "blur", message: "金钱非空" },
            {
              required: false,
              trigger: "blur",
              validator: validatorRule.IS_MONEY,
            },
          ],
          age: [
            { required: true, trigger: "blur", message: "年龄非空" },
            {
              required: false,
              trigger: "blur",
              validator: validatorRule.IS_INTEGER,
            },
          ],
          birth: [{ required: true, trigger: "blur", message: "生日非空" }],
          izUsable: [
            { required: true, trigger: "blur", message: "是否启用非空" },
          ],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {},
    mounted() {
      // 加载字典值
      this.dict.no_yes = this.$getDictList("no_yes");
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
            // 处理数据
            this.handlerFormData(this.form);

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
      // 处理 form数据
      handlerFormData(formData) {
        if (!isNull(formData)) {
          for (let key in formData) {
            // 对于时间类进行处理
            if (
              "[object Date]" === Object.prototype.toString.call(formData[key])
            ) {
              formData[key] = formateDate(formData[key], "yyyy-MM-dd hh:mm:ss");
            }
          }
        }
      },
    },
  };
</script>

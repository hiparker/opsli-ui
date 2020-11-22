<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="800px"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="金钱" prop="money">
            <el-input v-model="form.money" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model="form.age" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="生日" prop="birth">
          <el-date-picker
                  v-model="form.birth"
                  type="datetime"
                  placeholder="选择生日时间"
                  style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label="是否启用" prop="izUsable">
          <el-select v-model="form.izUsable" clearable
                     placeholder="请选择" style="width: 100%">
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
  import { isNull} from "@/utils/validate";
  import { isNotNull, isNumber, isMoney, isGeneralWithChinese,  getMsg} from "@/utils/valiargs";

  export default {
    name: "TestUserManagementEdit",
    data() {

      const validate_name_isGeneralWithChinese = (rule, value, callback) => {
        if (!isGeneralWithChinese(value)) {
          callback(new Error(getMsg('isGeneralWithChinese')));
        } else {
          callback();
        }
      };

      const validate_money_isMoney = (rule, value, callback) => {
        if (!isMoney(value)) {
          callback(new Error(getMsg('isMoney')));
        } else {
          callback();
        }
      };

      const validate_age_isNumber = (rule, value, callback) => {
        if (!isNumber(value)) {
          callback(new Error(getMsg('isNumber')));
        } else {
          callback();
        }
      };


      return {
        form: {
          // 设置默认值
          version: 0
        },
        dict: {},
        rules: {
          name: [
            { required: false, trigger: "blur", validator: validate_name_isGeneralWithChinese },
          ],
          money: [
            { required: true, trigger: "blur", message: "金钱非空" },
            { required: false, trigger: "blur", validator: validate_money_isMoney },
          ],
          age: [
            { required: true, trigger: "blur", message: "年龄非空" },
            { required: false, trigger: "blur", validator: validate_age_isNumber },
          ],
          birth: [
            { required: true, trigger: "blur", message: "生日非空" },
          ],
          izUsable: [
            { required: true, trigger: "blur", message: "是否启用非空" },
          ],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    created() {

    },
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
        this.$emit("fetchData");
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            // 处理数据
            this.handlerFormData(this.form);

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
      // 处理 form数据
      handlerFormData(formData){
        if(!isNull(formData)){
          for(let key in formData){
            // 对于时间类进行处理
            if("[object Date]" === Object.prototype.toString.call(formData[key])){
              formData[key] = formateDate(formData[key], 'yyyy-MM-dd hh:mm:ss');
            }
          }
        }
      },
    },
  };
</script>

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
          <el-form-item label="汽车名称" prop="carName">
            <el-input v-model="form.carName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="汽车类型" prop="carType">
            <el-input v-model="form.carType" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="汽车品牌" prop="carBrand">
            <el-input v-model="form.carBrand" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="生产日期" prop="produceData">
            <el-date-picker
                    v-model="form.produceData"
                    type="date"
                    placeholder="选择生产日期"
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
  import { doInsert, doUpdate } from "@/api/gentest/carinfo/TestCarManagement";
  import { formateDate } from "@/utils/format";
  import { isNull } from "@/utils/validate";
  import { isNotNull, isGeneralWithChinese,  getMsg} from "@/utils/valiargs";

  export default {
    name: "TestCarManagementEdit",
    data() {

      const validate_carName_isGeneralWithChinese = (rule, value, callback) => {
        if (!isGeneralWithChinese(value)) {
          callback(new Error(getMsg('isGeneralWithChinese')));
        } else {
          callback();
        }
      };

      const validate_carType_isGeneralWithChinese = (rule, value, callback) => {
        if (!isGeneralWithChinese(value)) {
          callback(new Error(getMsg('isGeneralWithChinese')));
        } else {
          callback();
        }
      };

      const validate_carBrand_isGeneralWithChinese = (rule, value, callback) => {
        if (!isGeneralWithChinese(value)) {
          callback(new Error(getMsg('isGeneralWithChinese')));
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
          carName: [
            { required: true, trigger: "blur", message: "汽车名称非空" },
            { required: false, trigger: "blur", validator: validate_carName_isGeneralWithChinese },
          ],
          carType: [
            { required: true, trigger: "blur", message: "汽车类型非空" },
            { required: false, trigger: "blur", validator: validate_carType_isGeneralWithChinese },
          ],
          carBrand: [
            { required: false, trigger: "blur", validator: validate_carBrand_isGeneralWithChinese },
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

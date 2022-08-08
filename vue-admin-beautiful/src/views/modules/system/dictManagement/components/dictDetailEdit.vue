<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
    append-to-body
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="125px">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="form.dictName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item label="字典值" prop="dictValue">
            <el-input v-model="form.dictValue" autocomplete="off"></el-input>
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
          <el-form-item label="排序" prop="sortNo">
            <el-input-number
              :min="1"
              :max="500"
              v-model="form.sortNo"
              autocomplete="off"
            ></el-input-number>
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
  import { doInsert, doUpdate } from "@/api/system/dict/dictDetailManagement";
  import { isName, isNull} from "@/utils/validate";

  export default {
    name: "DictDetailEdit",
    data() {

      const validateName = (rule, value, callback) => {
        if (isNull(value)) {
          callback(new Error("请输入名称"));
        } else if (!isName(value)) {
          callback(new Error("名称格式不正确"));
        } else {
          callback();
        }
      };

      return {
        form: {
          typeId: "",
          typeCode: "",
          izLock: '0',
          sortNo: 1,
          // 设置默认值
          version: 0
        },
        dict: {},
        rules: {
          dictName: [
            { required: true, trigger: "blur", validator: validateName },
          ],
          dictValue: [
            { required: true, trigger: "blur", message: "请输入值" },
          ],
          sortNo: [
            { required: true, trigger: "blur", message: "请输入排序" }
          ],
        },
        title: "",
        dialogFormVisible: false,
      };
    },
    watch: {

    },
    created() {

    },
    mounted() {
      // 如果不是每次开启时查询 在created中 有可能会短暂查不到
      this.dict.no_yes =  this.$getDictList("no_yes")
    },
    methods: {
      showInsert(row) {
        this.title = "字典类型 - 添加";
        this.form.typeId = row.typeId;
        this.form.typeCode = row.typeCode;
        this.dialogFormVisible = true;
      },
      showUpdate(row) {
        this.title = "字典类型 - 编辑";
        this.form = Object.assign({}, row);
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
    },
  };
</script>

<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="900px"
    top="4vh"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px">

      <el-row :gutter="10" >

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="模板名称" prop="tempName">
            <el-input v-model="form.tempName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="表类型" prop="tableType">
            <el-select v-model="form.tableType" clearable
                       placeholder="请选择" style="width: 100%">
              <el-option
                      v-for="item in dict.table_type"
                      :key="item.dictValue"
                      :label="item.dictName"
                      :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="备注信息" prop="remark">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

      </el-row>


    <el-divider content-position="left">代码模板</el-divider>

    <el-row :gutter="10" class="code-editor-row" style="width: 100%">
      <el-tabs v-model="editableTabsValue" type="border-card"
               editable @edit="handleTabsEdit"
               style="max-width: 830px !important;min-height: 40px;"
      >
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="index"
          :label="item.fileName"
          :name="item.fileName"
        >
          <el-row>
            <el-col>
              <el-form :model="item" label-width="70px" style="padding-right: 0 !important;">
                <el-form-item label="路径前缀" >
                  <el-input v-model="item.path" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col style="max-height: 450px;overflow-x: hidden;overflow-y: auto">
              <code-editor v-model="item.fileContent" @change="changeCode" />
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import CodeEditor from "@/components/CodeEditor/index";
  import {doInsert, doUpdate, getDetailListByParentId, getList} from "@/api/generator/template/GenTemplateManagement";
  import { deepClone } from "@/utils/clone";
  import { isNull } from "@/utils/validate";
  import { formateDate } from "@/utils/format";
  import { validatorRule } from "@/utils/validateRlue";
  import {isNotNull} from "@/utils/valiargs";


  export default {
    name: "GenTemplateManagementEdit",
    components: { CodeEditor },
    data() {

      return {
        form: {
          remark: "",
          // 设置默认值
          version: 0
        },
        dict: {},
        rules: {
              tempName: [
                { required: true, trigger: "blur", message: "模板名称非空" },
                { required: false, trigger: "blur", validator: validatorRule.IS_GENERAL_WITH_CHINESE },
              ],
              tableType: [
                { required: true, trigger: "blur", message: "表类型非空" },
              ],
        },
        title: "",
        dialogFormVisible: false,

        editableTabsValue: "",
        editableTabs: [],
        newTabs:{
          path:"",
          fileName: "",
          fileContent: ""
        },
        erdUltraObj: null,
        erdUltraFast: null,
      };
    },
    created() {

    },
    mounted() {
      // 加载字典值
      this.dict.table_type = this.$getDictList("table_type");
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

        // 加载数据
        this.fetchData();
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.editableTabs = this.$options.data().editableTabs;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            let tmp = deepClone(this.form);
            tmp.detailList = deepClone(this.editableTabs);
            // 处理数据
            this.handlerFormData(tmp);

            // 修改
            if (!isNull(tmp.id)) {
              const {success, msg} = await doUpdate(tmp);
              if (success) {
                this.$baseMessage(msg, "success");
              }
            } else {
              const {success, msg} = await doInsert(tmp);
              if (success) {
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
      handlerFormData(formData) {
        if (!isNull(formData)) {
          for (let key in formData) {
            // 对于时间类进行处理
            if ("[object Date]" === Object.prototype.toString.call(formData[key])) {
              formData[key] = formateDate(formData[key], 'yyyy-MM-dd hh:mm:ss');
            }
          }
        }
      },

      // 修改代码
      changeCode(code) {
        this.editableTabs.forEach((tab, index) => {
          if (tab.fileName === this.editableTabsValue) {
            tab.fileContent = code;
          }
        });
      },

      // Tab组件 新增 和 删除操作
      handleTabsEdit(targetName, action) {
        if (action === 'add') {
          this.$basePrompt(
            {
              content: "请输入文件名",
              title: null,
              inputValidator: (value) => {
                if(!value){
                  return false;
                }
                // 验证
                if(this.editableTabs && this.editableTabs.length > 0){
                  for(let item of this.editableTabs){
                    if(value === item.fileName){
                      return false;
                    }
                  }
                }
                return true;
              },
              inputErrorMessage: "文件名不可为空 或 该文件已存在！",
              callback1: ({value}) => {
                let tabData = deepClone(this.newTabs);
                tabData.fileName = value;
                this.editableTabs.push(tabData);
                this.editableTabsValue = value;
              }
            });
        }
        if (action === 'remove') {
          this.$baseConfirm("你确定要删除当前文件吗", null, async () => {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
              tabs.forEach((tab, index) => {
                if (tab.fileName === targetName) {
                  let nextTab = tabs[index + 1] || tabs[index - 1];
                  if (nextTab) {
                    activeName = nextTab.fileName;
                  }
                }
              });
            }
            this.editableTabs = tabs.filter(tab => tab.fileName !== targetName);
            this.editableTabsValue = activeName;
          });
        }
      },

      async fetchData() {
        this.listLoading = true;
        const { data } = await getDetailListByParentId(this.form.id);
        if(isNotNull(data) && data.length > 0){
          this.editableTabsValue = data[0].fileName;
          data.forEach((item, index) => {
            this.editableTabs.push(item);
          });

          console.log(this.editableTabs)

          setTimeout(() => {
            this.listLoading = false;
          }, 300);
        }
      },

    },
  };
</script>

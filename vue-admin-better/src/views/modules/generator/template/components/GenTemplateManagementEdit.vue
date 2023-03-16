<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="1000px"
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

    </el-form>

    <el-row :gutter="10" class="code-editor-row">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="后端" name="0">
          <el-tabs v-model="backendTabs.active" type="card"
                   editable @edit="handleTabsEdit"
                   style="max-width: 940px !important;min-height: 40px;"
          >
            <el-tab-pane
              v-for="(item, index) in backendTabs.data"
              :key="index"
              :label="item.fileName"
              :name="item.fileName"
            >
              <el-row>
                <el-col>
                  <el-form :model="item" label-width="105px" style="padding-right: 0 !important;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
                      <el-form-item label="路径前缀" >
                        <el-input v-model="item.path" autocomplete="off"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                      <el-form-item label="忽略文件名" prop="ignoreFileName" >
                        <el-select
                          v-model="item.ignoreFileName"
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
                  </el-form>
                </el-col>
                <el-col style="max-height: 450px;overflow-x: hidden;overflow-y: auto">
                  <code-editor v-model="item.fileContent" @change="changeCode" />
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <el-tab-pane label="前端" name="1">
          <el-tabs v-model="frontendTabs.active" type="card"
                   editable @edit="handleTabsEdit"
                   style="max-width: 940px !important;min-height: 40px;"
          >
            <el-tab-pane
              v-for="(item, index) in frontendTabs.data"
              :key="index"
              :label="item.fileName"
              :name="item.fileName"
            >
              <el-row>
                <el-col>
                  <el-form :model="item" label-width="105px" style="padding-right: 0 !important;">
                    <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="18">
                      <el-form-item label="路径前缀" >
                        <el-input v-model="item.path" autocomplete="off"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
                      <el-form-item label="忽略文件名" prop="ignoreFileName" label-width="105px">
                        <el-select
                          v-model="item.ignoreFileName"
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
                  </el-form>
                </el-col>
                <el-col style="max-height: 450px;overflow-x: hidden;overflow-y: auto">
                  <code-editor v-model="item.fileContent" @change="changeCode" />
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>

    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button type="info" @click="openEnjoyDoc()">查看模板语法</el-button>
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

        backendTabs:{
          data: [],
          active: ""
        },
        frontendTabs:{
          data: [],
          active: ""
        },

        activeName: "0",
        newTabs:{
          type: "",
          path: "",
          fileName: "",
          fileContent: "",
          ignoreFileName: "0"
        },
      };
    },
    created() {

    },
    mounted() {
      // 加载字典值
      this.dict.no_yes = this.$getDictList("no_yes");
      this.dict.table_type = this.$getDictList("table_type");
    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = "Enjoy模板引擎 - 添加";
        } else {
          this.title = "Enjoy模板引擎 - 编辑";
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
        this.activeName = this.$options.data().activeName;
        this.backendTabs = this.$options.data().backendTabs;
        this.frontendTabs = this.$options.data().frontendTabs;
      },
      save() {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            let tmp = deepClone(this.form);
            tmp.detailList = [];

            // 合并数据
            this.backendTabs.data.forEach((item) => {
              tmp.detailList.push(item);
            });
            this.frontendTabs.data.forEach((item) => {
              tmp.detailList.push(item);
            });

            // 处理数据
            this.handlerFormData(tmp);

            // 修改
            if (!isNull(tmp.id)) {
              const { msg } = await doUpdate(tmp);
              this.$baseMessage(msg, "success");
            } else {
              const { msg } = await doInsert(tmp);
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
            if ("[object Date]" === Object.prototype.toString.call(formData[key])) {
              formData[key] = formateDate(formData[key], 'yyyy-MM-dd hh:mm:ss');
            }
          }
        }
      },

      // 修改代码
      changeCode(code) {
        let tmpTab;
        if(this.activeName === "0"){
          tmpTab = this.backendTabs;
        }else if(this.activeName === "1"){
          tmpTab = this.frontendTabs;
        }

        tmpTab.data.forEach((tab) => {
          if (tab.fileName === tmpTab.active) {
            tab.fileContent = code;
          }
        });
      },

      // Tab组件 新增 和 删除操作
      handleTabsEdit(targetName, action) {
        let tmpTab;
        if(this.activeName === "0"){
          tmpTab = this.backendTabs;
        }else if(this.activeName === "1"){
          tmpTab = this.frontendTabs;
        }

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
                if(tmpTab && tmpTab.data.length > 0){
                  for(let item of tmpTab.data){
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
                tabData.type = this.activeName;
                tabData.fileName = value;
                // 添加数据
                tmpTab.data.push(tabData);
                tmpTab.active = value;
              }
            });
        }
        if (action === 'remove') {
          this.$baseConfirm("你确定要删除当前文件吗", null, async () => {
            let tabs = tmpTab.data;
            let activeName = tmpTab.active;
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
            tmpTab.data = tabs.filter(tab => tab.fileName !== targetName);
            tmpTab.active = activeName;
          });
        }
      },
      openEnjoyDoc(){
        window.open("https://jfinal.com/doc/6-1");
      },
      async fetchData() {
        this.listLoading = true;
        const { data } = await getDetailListByParentId(this.form.id);
        if(isNotNull(data) && data.length > 0){
          let tmpData = this.$baseLodash.groupBy(data, "type");
          if(tmpData){
            let backendData = tmpData["0"];
            let frontendData = tmpData["1"];
            // 后端
            if(backendData && backendData.length > 0){
              this.backendTabs.data = backendData;
              this.backendTabs.active = backendData[0].fileName;
            }
            // 前端
            if(frontendData && frontendData.length > 0){
              this.frontendTabs.data = frontendData;
              this.frontendTabs.active = frontendData[0].fileName;
            }
          }
        }

        setTimeout(() => {
          this.listLoading = false;
        }, 300);
      },

    },
  };
</script>
<style lang="scss" >
  .code-editor-row{
    .el-tabs--border-card{
      .el-tabs__content{
        .el-tabs{
          width: 100% !important;
        }
      }
    }
  }
</style>

<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="90% !important"
    @close="close"
  >
    <el-steps :active="1" finish-status="success" simple style="margin-top: 20px">
      <el-step title="1. 基础信息" >
        123
      </el-step>
      <el-step title="步骤 2" ></el-step>
      <el-step title="步骤 3" ></el-step>
    </el-steps>

    <el-form ref="form" :model="form" :rules="rules" label-width="105px">
      <el-row :gutter="10" >
        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="表名称" prop="tableName">
            <el-input v-model="form.tableName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="表类型" prop="tableType">
            <el-select v-model="form.tableType" placeholder="请选择"
                       @change="tableTypeChange" :disabled="formState.tableType"
                       style="width: 100%">
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
          <el-form-item label="描述" prop="comments">
            <el-input v-model="form.comments"
                      autocomplete="off"
                      maxlength="100"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="数据库类型" prop="jdbcType">
            <el-select v-model="form.jdbcType" placeholder="请选择" :disabled="formState.jdbcType"
                       @change="jdbcTypeChange" ref="jdbcType"
                       style="width: 100%">
              <el-option
                v-for="item in dict.jdbc_type"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"
                      autocomplete="off"
                      maxlength="120"
                      show-word-limit
            ></el-input>
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
import { uuid } from "@/utils";
import Sortable from "sortablejs";
import {deepClone} from "@/utils/clone";
import {doInsert, doUpdate, getSubList} from "@/api/creater/tableManagement";
import {isCode, isNull} from "@/utils/validate";

export default {
    name: "CreateTableManagementEdit",
    components: { Sortable },
    data() {

      const validateTableName = (rule, value, callback) => {
        if (isNull(value)) {
          callback(new Error("请输入表名"));
        } if (!isCode(value)) {
          callback(new Error("表名只能为字母、数字或下划线"));
        } else {
          callback();
        }
      };

      const validateName = (rule, value, callback) => {
        if (!isCode(value)) {
          callback(new Error("只能为字母、数字或下划线"));
        } else {
          callback();
        }
      };

      const validateDictCode = (rule, value, callback) => {
        let index = parseInt(rule.field.split(".")[1]);
        if(index !== null && index !== undefined){
          let listTmp = this.list[index];
          if(listTmp !== null && listTmp !== undefined){
            let showType = listTmp.showType;
            // 如果同行是字典 那么 字典编号就必须非空
            if(showType === "2"){
              if (isNull(value)) {
                callback(new Error("请输入字典编号"));
              } else if (!isCode(value)) {
                callback(new Error("编号只能为字母、数字或下划线"));
              } else {
                callback();
              }
            }
          }
        }
        callback();
      };

      const validateQueryType = (rule, value, callback) => {
        let index = parseInt(rule.field.split(".")[1]);
        if(index !== null && index !== undefined){
          let listTmp = this.list[index];
          if(listTmp !== null && listTmp !== undefined){
            let showListFlag = listTmp.izShowList;
            if(showListFlag === 1){
              if (isNull(value)) {
                callback(new Error("请选择检索类型"));
              } else {
                callback();
              }
            }
          }
        }
        callback();
      };

      return {
        treeName: "parent_id",
        activeName: 'column',
        formState:{
          jdbcType: false,
          tableType: false,
        },
        form: {
          tableType: '0',
          jdbcType: 'mysql',
          // 设置默认值
          version: 0,
          // 字表
          columnList:[]
        },
        dict: {},
        rules: {
          tableName: [
            { required: true, trigger: "blur", validator: validateTableName },
          ],
          tableType: [
            { required: true, trigger: "blur", message: "请选择类型" },
          ],
          comments: [
            { required: true, trigger: "blur", message: "请输入描述" },
          ],
        },
        title: "",
        dialogFormVisible: false,
        queryForm:{
          id:"",
        },

        list: [],
        columnListLoading: true,
        columnSettingListLoading: true,
        layout: "total, sizes, prev, pager, next, jumper",
        selectRows: "",
        elementLoadingText: "正在加载...",
      };
    },
    created() {
    },
    mounted() {
      // 如果不是每次开启时查询 在created中 有可能会短暂查不到
      this.dict.table_type =  this.$getDictList("table_type");
      this.dict.jdbc_type =  this.$getDictList("jdbc_type");
      this.dict.java_data_type =  this.$getDictList("java_data_type");
      this.dict.show_type =  this.$getDictList("show_type");
      this.dict.validate_type =  this.$getDictList("validate_type");
      this.dict.query_type =  this.$getDictList("query_type");

    },
    methods: {
      showEdit(row) {
        if (!row) {
          this.title = "添加";
        } else {
          this.title = "编辑";
          this.form = Object.assign({}, row);
          this.formState.jdbcType = true;
          this.formState.tableType = true;
          this.queryForm.id = this.form.id;
        }

        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs["form"].resetFields();
        this.form = this.$options.data().form;
        this.formState.jdbcType = false;
        this.formState.tableType = false;
        this.queryForm.id = "";
        this.dict.field_type = null;
        this.list = [];
        this.activeName = 'column';
      },
      save() {
        // 验证form 表单
        this.$refs["form"].validate(async (formValid) => {
          if (formValid) {
            // 验证字段结构
            this.activeName = "column";
            this.$refs['columnForm'].validate(async (columnValid) => {
              if (columnValid){
                // 验证字段配置
                this.activeName = "column_setting";
                this.$refs['columnSettingForm'].validate(async (columnSettingValid) => {
                  if (columnSettingValid){
                      // 字段数据
                      let tmpForm = deepClone(this.form);
                      // 字段数据
                      let columnList = deepClone(this.list);
                      // 处理数据
                      for (let i = 0; i < columnList.length; i++) {
                        delete columnList[i].disabled;
                        if(!isNull(columnList[i].izPk)){
                          columnList[i].izPk = columnList[i].izPk+"";
                        }
                        if(!isNull(this.list[i].izNotNull)){
                          columnList[i].izNotNull = columnList[i].izNotNull+"";
                        }
                        if(!isNull(this.list[i].izShowList)){
                          columnList[i].izShowList = columnList[i].izShowList+"";
                        }
                        if(!isNull(this.list[i].izShowForm)){
                          columnList[i].izShowForm = columnList[i].izShowForm+"";
                        }
                        if(!isNull(this.list[i].validateType)){
                          columnList[i].validateType = columnList[i].validateType.join(",");
                        }
                      }

                      if(columnList.length === 0){
                        tmpForm.columnList = null;
                      }else{
                        tmpForm.columnList = columnList;
                      }

                      //console.log(tmpForm.columnList)

                      //return ;

                      // 修改
                      if (!isNull(this.form.id)) {
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

                      await this.$emit("fetchData");
                      this.close();
                  }else{
                    return false;
                  }
                });
              }else{
                return false;
              }
            });
          } else {
            return false;
          }
        });
      },

      // =========================================================

      // 请求数据
      async fetchData() {
        this.columnListLoading = true;
        const { data } = await getSubList(this.queryForm);
        let flag = false;
        if(!isNull(data)){
          if(!isNull(data.columnList)){
            flag = true;
            this.list = data.columnList;

            // 处理数据
            // 设置禁止修改字段 （如果有树表 则 parent_id 字段不允许任何修改）
            for (let i = 0; i < this.list.length; i++) {
              this.list[i].disabled = this.list[i].fieldName === this.treeName;

              if(!isNull(this.list[i].izPk)){
                this.list[i].izPk = parseInt(this.list[i].izPk);
              }
              if(!isNull(this.list[i].izNotNull)){
                this.list[i].izNotNull = parseInt(this.list[i].izNotNull);
              }
              if(!isNull(this.list[i].izShowList)){
                this.list[i].izShowList = parseInt(this.list[i].izShowList);
              }
              if(!isNull(this.list[i].izShowForm)){
                this.list[i].izShowForm = parseInt(this.list[i].izShowForm);
              }
              if(!isNull(this.list[i].validateType)){
                this.list[i].validateType = this.list[i].validateType.split(",");
              }
            }

            setTimeout(() => {
              this.columnListLoading = false;
              this.rowDrop();
            }, 300);
          }
        }
        if(!flag){
          setTimeout(() => {
            this.columnListLoading = false;
            this.rowDrop();
          }, 300);
        }
      },
    },
  }
</script>
<style>
  .el-form-item-table{
    margin-top: 22px;
  }
</style>

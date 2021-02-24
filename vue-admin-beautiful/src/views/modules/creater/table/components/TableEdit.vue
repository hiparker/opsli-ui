<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="80%"
    @close="close"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="105px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="表名称" prop="tableName">
            <el-input v-model="form.tableName" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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

        <el-col :span="8">
          <el-form-item label="描述" prop="comments">
            <el-input v-model="form.comments"
                      autocomplete="off"
                      maxlength="100"
                      show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
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
        <el-col :span="8">
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

    <el-tabs ref="table-column" v-model="activeName" @tab-click="tagsClick">
      <el-tab-pane label="字段结构" name="column" >

        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button icon="el-icon-plus" type="primary" @click="columnHandleAdd">
              添加
            </el-button>

            <el-button
              :disabled="!selectRows.length > 0"
              icon="el-icon-delete"
              type="danger"
              @click="columnHandleDelete"
            > 删除 </el-button>

          </vab-query-form-left-panel>
        </vab-query-form>

        <el-form ref="columnForm" :model="{'list':list}" >

        <el-table
          v-loading="columnListLoading"
          :data="list"
          :element-loading-text="elementLoadingText"
          @selection-change="setSelectRows"
          border
        >

          <el-table-column show-overflow-tooltip type="selection"></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldName"
            label="字段名称"
            width="240"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.fieldName'"
                :rules="columnRules.fieldName"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.fieldName"
                          :disabled="scope.row.disabled"
                          style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldType"
            label="字段类型"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.fieldType'"
                :rules="columnRules.fieldType"
                class="el-form-item-table"
              >
                <el-select v-model="scope.row.fieldType" placeholder="请选择"
                           default-first-option="" filterable
                           :disabled="scope.row.disabled"
                           style="width: 100%" >
                  <el-option
                    v-for="item in dict.field_type"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldLength"
            label="字段长度"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.fieldLength'"
                class="el-form-item-table"
              >
                <el-input-number v-model="scope.row.fieldLength"
                                 controls-position="right"
                                 :disabled="scope.row.disabled"
                                 :min="0" :max="20000"
                                 style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldPrecision"
            label="字段精度"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.fieldComments'"
                class="el-form-item-table"
              >
                <el-input-number v-model="scope.row.fieldPrecision"
                                 controls-position="right"
                                 :disabled="scope.row.disabled"
                                 :min="0" :max="100"
                                 style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>


          <el-table-column
            show-overflow-tooltip
            prop="fieldComments"
            label="字段描述"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.fieldComments'"
                :rules="columnRules.fieldComments"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.fieldComments"
                          maxlength="100"
                          show-word-limit
                          :disabled="scope.row.disabled"
                          style="width: 100%"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izPk"
            label="主键"
            width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.izPk'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izPk"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="scope.row.disabled"
                  @change="pKChange(scope.row)"
                  >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izNotNull"
            label="非空"
            width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.izNotNull'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izNotNull"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="scope.row.disabled"
                >
              </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

        </el-table>

        </el-form>

      </el-tab-pane>
      <el-tab-pane label="字段配置" name="column_setting">

        <vab-query-form>
          <vab-query-form-left-panel>
            <el-button icon="el-icon-plus" type="primary" @click="columnHandleAdd">
              添加
            </el-button>

          </vab-query-form-left-panel>
        </vab-query-form>

        <el-form ref="columnSettingForm" :model="{'list':list}" >
        <el-table
          v-loading="columnListLoading"
          :data="list"
          :element-loading-text="elementLoadingText"
          @selection-change="setSelectRows"
          border
        >

          <el-table-column
            show-overflow-tooltip
            prop="fieldName"
            label="字段名称"
            width="240"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.fieldName'"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.fieldName"
                          :disabled="true"
                          style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="javaType"
            label="Java类型"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.javaType'"
                :rules="columnSettingRules.javaType"
                class="el-form-item-table"
              >
                <el-select v-model="scope.row.javaType" placeholder="请选择"
                           default-first-option="" filterable
                           :disabled="scope.row.disabled || scope.row.showType === '2'"
                           style="width: 100%" >
                  <el-option
                    v-for="item in dict.java_data_type"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="showType"
            label="生成方案"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.showType'"
                class="el-form-item-table"
              >
                  <el-select v-model="scope.row.showType" placeholder="请选择"
                             default-first-option="" filterable clearable
                             :disabled="scope.row.disabled"
                             @change="showTypeChange(scope.row)"
                             style="width: 100%" >
                    <el-option
                      v-for="item in dict.show_type"
                      :key="item.dictValue"
                      :label="item.dictName"
                      :value="item.dictValue"
                    ></el-option>
                  </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="dictTypeCode"
            label="字典类型编号"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.dictTypeCode'"
                :rules="columnSettingRules.dictTypeCode"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.dictTypeCode"
                          :disabled="scope.row.disabled"
                          style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="validateType"
            label="验证类别"
            width="240"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.validateType'"
                class="el-form-item-table"
              >
                <el-select v-model="scope.row.validateType" placeholder="请选择"
                           default-first-option="" filterable
                           multiple
                           collapse-tags
                           :disabled="scope.row.disabled"
                           style="width: 100%" >
                  <el-option
                    v-for="item in dict.validate_type"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izShowList"
            label="列表显示"
            width="100"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.izShowList'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izShowList"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="scope.row.disabled || scope.row.showType === null || scope.row.showType === ''"
                  @change="izShowListChange(scope.row)"
                >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="izShowForm"
            label="表单显示"
            width="100"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.izShowForm'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izShowForm"
                  :active-value="1"
                  :inactive-value="0"
                  :disabled="scope.row.disabled || scope.row.showType === null || scope.row.showType === ''"
                >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="queryType"
            label="检索类别"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'list.'+scope.$index+'.queryType'"
                class="el-form-item-table"
              >
                <!-- 如果为 2 3 字典和日期, 或者 不在列表显示 的话 禁止手动选择 -->
                <el-select v-model="scope.row.queryType" placeholder="请选择(可空)"
                           default-first-option="" clearable
                           collapse-tags

                           :disabled="scope.row.disabled || scope.row.showType === '2' || scope.row.showType === '3'
                                      || scope.row.showType === '4' || scope.row.izShowList === null || scope.row.izShowList === 0
                                      "
                           style="width: 100%" >
                  <el-option
                    v-for="item in dict.query_type"
                    :key="item.dictValue"
                    :label="item.dictName"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>


        </el-table>
        </el-form>
      </el-tab-pane>

    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>
  import Sortable from "sortablejs";
  import { deepClone } from "@/utils/clone";
  import { doInsert, doUpdate, getSubList} from "@/api/creater/tableManagement";
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
        // 新增字段模版
        columnFormTemp:{
          id: "",
          sort: 0,
          izPk: 0,
          izNotNull: 0,
          izShowList: 0,
          izShowForm: 0,
          queryType: "",
          fieldName: "",
          fieldType: "",
          fieldLength: 0,
          fieldPrecision: 0,
          fieldComments: "",
          javaType: "",
          validateType: "",
          showType: "",
          dictTypeCode: "",
          disabled: false,
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
        columnRules: {
          fieldName: [
            { required: true, message: "请选择字段名称", trigger: "blur" },
            { required: true, trigger: "blur", validator: validateName },
          ],
          fieldType: [
            { required: true, message: "请选择字段类型", trigger: "blur" },
          ],
          fieldComments: [
            { required: true, message: "请输入字段描述", trigger: "blur" },
          ]
        },
        columnSettingRules: {
          javaType: [
            { required: true, message: "请选择Java类型", trigger: "blur" },
          ],
          dictTypeCode: [
            { required: true, validator: validateDictCode, trigger: "blur" },
          ],
          queryType: [
            { required: true, validator: validateQueryType, trigger: "blur" },
          ]
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

        // 初始化 表结构
        this.initColumn();

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
        this.$emit("fetchData");
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

                      if(columnList == null || columnList.length === 0){
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
      /** 字段行处理 */

      // 初始化
      initColumn(){
        // 加载字典
        this.dict.field_type =  this.$getDictList(this.form.jdbcType+"_data_type");

        // 加载数据
        this.fetchData();
      },

      // 数据库类型发生改动
      jdbcTypeChange(newValue){
        let oldValue = this.$refs.jdbcType.value;
        this.form.jdbcType = oldValue;
        this.$baseConfirm("更换数据库类型将会清空当前已设字段，你确定要更换吗", null, () => {
          // 改为新值
          this.form.jdbcType = newValue;
          // 加载字典
          this.dict.field_type =  this.$getDictList(this.form.jdbcType+"_data_type");
          // 清空已有字段数据
          this.list = [];
        });
      },

      // 数据库类型发生改动
      tableTypeChange(newValue){
        if(newValue === '0'){
          // 删除 parent_id 字段
          for (let i = this.list.length - 1; i >= 0; i--) {
            let item = this.list[i];
            if(item.fieldName === this.treeName) {
              this.list.splice(i, 1);
              break;
            }
          }
        } else if(newValue === '1'){
          // 删除 parent_id 字段
          for (let i = this.list.length - 1; i >= 0; i--) {
            let item = this.list[i];
            if(item.fieldName === this.treeName) {
              this.list.splice(i, 1);
              break;
            }
          }

          // 增加 parent_id 字段
          let tmp = deepClone(this.columnFormTemp);
          tmp.disabled = true;
          tmp.fieldName = this.treeName;
          tmp.fieldType = "bigint";
          tmp.fieldLength = 20;
          tmp.fieldComments = "上级ID";
          tmp.javaType = "Integer";
          tmp.izNotNull = 1;
          this.columnHandleAdd(tmp);
        }
      },

      // 主键改动
      pKChange(el){
        if(!isNull(el)){
          // 如果主键选中 则默认选中不可为空
          if(el.izPk === 1){
            el.izNotNull = 1;
          } else {
            el.izNotNull = 0;
          }
        }
      },

      // 生成方案
      showTypeChange(el){
        if(!isNull(el)){
          if(isNull(el.showType)){
            el.izShowForm = 0;
            el.izShowList = 0;
            el.queryType = "";
          }else{
            // 如果是 字典 则需要把 Java类型强制改为 String 且不可改
            if(el.showType === "2"){
              el.javaType = "String";
            }
          }
          this.izShowListChange(el);
        }
      },

      izShowListChange(el){
        if(!isNull(el)){
          // 在列表显示
          if(el.izShowList === 1){
            // 字典
            if(el.showType === "2"){
              el.queryType = "EQ";
            }
            // 日期
            else if(el.showType === "3" || el.showType === "4"){
              el.queryType = "RANGE";
            }
          }else{
            el.queryType = "";
          }
        }
      },

      // 行添加
      columnHandleAdd(params){
        this.activeName = "column";

        let temp;
        if(!isNull(params) && !(params instanceof MouseEvent)){
          temp = params;
        } else {
          temp = deepClone(this.columnFormTemp);
        }

        temp.id = "temp_" + this.uuid()
        if(this.list == null || this.list.length === 0){
          temp.sort = 0;
        } else {
          temp.sort = this.list.length;
        }
        this.list.push(temp);
        // 添加数据事 刷新一下缓存
        this.tagsClick({paneName: "column"});
      },

      // 行删除
      columnHandleDelete(row){
        if (row.id) {
          this.$baseConfirm("你确定要删除当前字段吗", null, () => {
            for (let i = this.list.length - 1; i >= 0; i--) {
              let item = this.list[i];
              if(item.id === row.id) {
                // 树装接口 不允许删除 parent_id 字段
                if(this.form.tableType === '1'){
                  if(item.fieldName !== this.treeName){
                    this.list.splice(i, 1);
                  }
                } else {
                  this.list.splice(i, 1);
                }
                break;
              }
            }
          });
        } else if (this.selectRows.length > 0) {
            const ids = this.selectRows.map((item) => item.id);
            this.$baseConfirm("你确定要删除当前字段吗", null, () => {
              for (let i = this.list.length - 1; i >= 0; i--) {
                let item = this.list[i];
                if(ids.indexOf(item.id) !== -1) {
                  // 树装接口 不允许删除 parent_id 字段
                  if(this.form.tableType === '1'){
                    if(item.fieldName !== this.treeName){
                      this.list.splice(i, 1);
                    }
                  } else {
                    this.list.splice(i, 1);
                  }
                }
              }
            });
        } else {
            this.$baseMessage("未选中任何行", "error");
            return false;
        }
      },

      // 行选中
      setSelectRows(val) {
        this.selectRows = val;
      },


      // tag 切换，短暂的做了一个延时，可以有效保持 table顺序
      tagsClick({paneName}, event){
        if(paneName === 'column'){
          let tmp = this.list;
          this.columnListLoading = true;
          this.list = [];
          setTimeout(() => {
            this.columnListLoading = false;
            this.list = tmp;
          }, 20);
        }else if(paneName === 'column_setting'){
          let tmp = this.list;
          this.columnSettingListLoading = true;
          this.list = [];
          setTimeout(() => {
            this.columnSettingListLoading = false;
            this.list = tmp;
          }, 20);
        }
      },

      //行拖拽
      rowDrop() {
        const tbody = this.$refs["table-column"].$el
          .querySelector('.el-table__body-wrapper tbody');
        const _this = this
        Sortable.create(tbody, {
          onEnd({ newIndex, oldIndex }) {
            let oldObj = _this.list[oldIndex];
            let newObj = _this.list[newIndex];
            // 如果是 从后往前 移动 则 当前项改为newIndex 而 原newIndex 往后的所有内容全部向后顺产移动
            if(oldIndex > newIndex){
              for (let i = oldIndex; i > newIndex; i--) {
                _this.list[i] = _this.list[i-1];
                _this.list[i].sort = i;
              }

            }
            // 如果是 从前往后 移动 则 当前项改为newIndex 而 原newIndex 往后的所有内容全部向前顺产移动
            else{
              for (let i = oldIndex; i < newIndex; i++) {
                _this.list[i] = _this.list[i+1];
                _this.list[i].sort = i;
              }
            }
            oldObj.sort = newIndex;
            _this.list[newIndex] = oldObj;
          }
        })
      },

      // 获取uuid
      uuid() {
        const s = [];
        const hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23];
        this.uuidA = s.join("");
        return this.uuidA;
      },

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
              if(this.list[i].fieldName !== this.treeName){
                this.list[i].disabled = false;
              }else{
                this.list[i].disabled = true;
              }

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

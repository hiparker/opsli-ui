<template>
  <div v-show="active === flag" class="step-main">
    <div class="step-content">
      <el-form ref="baseForm" :model="baseFormCurr" :rules="rules" label-width="105px">
        <el-row :gutter="10">
          <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
            <el-form-item label="表名称" prop="tableName">
              <el-input v-model="baseFormCurr.tableName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
            <el-form-item label="表类型" prop="tableType">
              <el-select v-model="baseFormCurr.tableType" :disabled="formState.tableType"
                         placeholder="请选择" style="width: 100%"
                         @change="tableTypeChange">
                <el-option
                  v-for="item in dictCurr.table_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
            <el-form-item label="描述" prop="comments">
              <el-input v-model="baseFormCurr.comments"
                        autocomplete="off"
                        maxlength="100"
                        show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
            <el-form-item label="数据库类型" prop="jdbcType">
              <el-select ref="jdbcType" v-model="baseFormCurr.jdbcType" :disabled="formState.jdbcType"
                         placeholder="请选择" style="width: 100%"
                         @change="jdbcTypeChange">
                <el-option
                  v-for="item in dictCurr.jdbc_type"
                  :key="item.dictValue"
                  :label="item.dictName"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :lg="8" :md="12" :sm="24" :xl="8" :xs="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="baseFormCurr.remark"
                        autocomplete="off"
                        maxlength="120"
                        show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>

      <vab-query-form>
        <vab-query-form-left-panel>
          <el-button :disabled="!baseFormCurr.jdbcType"
                     icon="el-icon-plus"
                     type="primary"
                     @click="columnHandleAdd">
            添加
          </el-button>
          <el-button icon="el-icon-plus"
                     type="primary"
                     @click="dialogVisible = true">
            常用字段
          </el-button>
          <el-button
            :disabled="!selectRows.length > 0"
            icon="el-icon-delete"
            type="danger"
            @click="columnHandleDelete"
          > 删除
          </el-button>

        </vab-query-form-left-panel>
      </vab-query-form>

      <el-form ref="tableForm" :model="{'tableForm': tableFormCurr}">
        <el-table
          :data="tableFormCurr"
          :element-loading-text="elementLoadingText"
          border
          @selection-change="setSelectRows"
        >

          <el-table-column show-overflow-tooltip type="selection"></el-table-column>

          <el-table-column
            align="center"
            label="拖动"
            show-overflow-tooltip
            width="60"
          >
            <template slot-scope="scope">
              <el-button circle
                         class="move-btn"
                         icon="el-icon-d-caret"
              ></el-button>
            </template>
          </el-table-column>


          <el-table-column
            label="字段名称"
            min-width="200"
            prop="fieldName"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.fieldName'"
                :rules="columnRules.fieldName"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.fieldName"
                          :disabled="scope.row.disabled"
                          style="width: 100%"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="字段类型"
            min-width="180"
            prop="fieldType"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.fieldType'"
                :rules="columnRules.fieldType"
                class="el-form-item-table"
              >
                <el-select v-model="scope.row.fieldType" :disabled="scope.row.disabled"
                           default-first-option="" filterable
                           placeholder="请选择"
                           style="width: 100%">
                  <el-option
                    v-for="item in baseDictData.fieldList"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="字段长度"
            min-width="140"
            prop="fieldLength"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.fieldLength'"
                class="el-form-item-table"
              >
                <el-input-number v-model="scope.row.fieldLength"
                                 :disabled="scope.row.disabled"
                                 :max="20000"
                                 :min="0" controls-position="right"
                                 style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="字段精度"
            min-width="140"
            prop="fieldPrecision"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.fieldComments'"
                class="el-form-item-table"
              >
                <el-input-number v-model="scope.row.fieldPrecision"
                                 :disabled="scope.row.disabled"
                                 :max="100"
                                 :min="0" controls-position="right"
                                 style="width: 100%"
                ></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="字段描述"
            min-width="240"
            prop="fieldComments"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.fieldComments'"
                :rules="columnRules.fieldComments"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.fieldComments"
                          :disabled="scope.row.disabled"
                          maxlength="100"
                          show-word-limit
                          style="width: 100%"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="主键"
            min-width="80"
            prop="izPk"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.izPk'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izPk"
                  :active-value="1"
                  :disabled="scope.row.disabled"
                  :inactive-value="0"
                  @change="pKChange(scope.row)"
                >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            label="非空"
            min-width="80"
            prop="izNotNull"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.izNotNull'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izNotNull"
                  :active-value="1"
                  :disabled="scope.row.disabled || scope.row.izPk === 1"
                  :inactive-value="0"
                >
                </el-switch>
              </el-form-item>
            </template>
          </el-table-column>

        </el-table>
      </el-form>
    </div>

    <step-footer
      ref="step-footer"
      :flag="flag"
      :info-data="{
        obj: this,
        baseForm: baseFormCurr,
        tableForm: tableFormCurr
      }"
      :max-flag="maxFlag"
      :min-flag="minFlag"
    ></step-footer>

    <!--    选择预制字段-->
    <el-dialog
      :before-close="handleClose"
      :visible.sync="dialogVisible"
      append-to-body
      title="选择常见字段"
      width="30%">
      <div>
        <template v-for="item in BuiltInFields">
          <el-checkbox v-model="BuiltInFieldsSelect" :label="item.fieldName" border style="margin: 5px"
                       @change="changeBuiltInFieldsSelect"></el-checkbox>

        </template>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="AddDefaultFields">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import {isCode, isNull} from "@/utils/validate";
import StepFooter from "./footer/StepFooter"
import {deepClone} from "@/utils/clone";
import Sortable from "sortablejs";
import {uuid} from "@/utils";
import {getFieldTypes, getJavaFieldTypesBySafety} from "@/api/generator/tableManagement";
import {isNotNull} from "@/utils/valiargs";

export default {
  name: "TableDataStep",
  components: {Sortable, StepFooter},
  props: {
    active: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    minFlag: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    maxFlag: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    baseForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    tableForm: {
      type: Array,
      default: () => {
        return [];
      },
    },
    dict: {
      type: Object,
      default: () => {
        return {};
      },
    },
    baseDictData: {
      type: Object,
      default: () => {
        return {
          fieldList: [],
          JavaFieldMap: {},
        };
      },
    }
  },
  data() {

    const validateTableName = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error("请输入表名"));
      }
      if (!isCode(value)) {
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

    return {
      BuiltInFieldsSelect: [],//已选中的字段
      BuiltInFields:
        [
          {
            "encryptData": null,
            "fieldName": "id",
            "fieldType": "bigint",
            "fieldLength": 19,
            "fieldPrecision": 0,
            "fieldComments": "唯一主键",
            "izPk": 1,
            "izNotNull": 1,
            "izShowList": null,
            "izShowForm": null,
            "javaType": "String",
            "showType": null,
            "dictTypeCode": null,
            "sort": 0,
            "validateType": null,
            "queryType": null,
            "disabled": false
          },
          {
            "encryptData": null,
            "fieldName": "org_ids",
            "fieldType": "varchar",
            "fieldLength": 500,
            "fieldPrecision": 0,
            "fieldComments": "父级主键集合",
            "izPk": 0,
            "izNotNull": 0,
            "izShowList": null,
            "izShowForm": null,
            "javaType": "String",
            "showType": null,
            "dictTypeCode": null,
            "sort": 1,
            "validateType": null,
            "queryType": null,
            "disabled": false
          },
          {
            "encryptData": null,
            "fieldName": "tenant_id",
            "fieldType": "bigint",
            "fieldLength": 19,
            "fieldPrecision": 0,
            "fieldComments": "多租户ID",
            "izPk": 0,
            "izNotNull": 0,
            "izShowList": null,
            "izShowForm": null,
            "javaType": "String",
            "showType": null,
            "dictTypeCode": null,
            "sort": 8,
            "validateType": null,
            "queryType": null,
            "disabled": false
          },
          {
            "encryptData": null,
            "fieldName": "create_by",
            "fieldType": "bigint",
            "fieldLength": 19,
            "fieldPrecision": 0,
            "fieldComments": "创建者",
            "izPk": 0,
            "izNotNull": 1,
            "izShowList": null,
            "izShowForm": null,
            "javaType": "String",
            "showType": null,
            "dictTypeCode": null,
            "sort": 10,
            "validateType": null,
            "queryType": null,
            "disabled": false
          },
          {
            "encryptData": null,
            "fieldName": "create_time",
            "fieldType": "datetime",
            "fieldLength": 0,
            "fieldPrecision": 0,
            "fieldComments": "创建时间",
            "izPk": 0,
            "izNotNull": 1,
            "izShowList": null,
            "izShowForm": null,
            "javaType": "String",
            "showType": null,
            "dictTypeCode": null,
            "sort": 11,
            "validateType": null,
            "queryType": null,
            "disabled": false
          },
          {
            "encryptData": null,
            "fieldName": "update_by",
            "fieldType": "bigint",
            "fieldLength": 19,
            "fieldPrecision": 0,
            "fieldComments": "修改人",
            "izPk": 0,
            "izNotNull": 1,
            "izShowList": null,
            "izShowForm": null,
            "javaType": "String",
            "showType": null,
            "dictTypeCode": null,
            "sort": 12,
            "validateType": null,
            "queryType": null,
            "disabled": false
          },
          {
            "encryptData": null,
            "fieldName": "update_time",
            "fieldType": "datetime",
            "fieldLength": 0,
            "fieldPrecision": 0,
            "fieldComments": "修改时间",
            "izPk": 0,
            "izNotNull": 1,
            "izShowList": null,
            "izShowForm": null,
            "javaType": "String",
            "showType": null,
            "dictTypeCode": null,
            "sort": 13,
            "validateType": null,
            "queryType": null,
            "disabled": false
          },
          {
            "fieldName": "delected",
            "sort": 8,
            "izPk": 0,
            "izNotNull": 1,
            "izShowList": 0,
            "izShowForm": 0,
            "queryType": "",
            "fieldType": "int",
            "fieldLength": 1,
            "fieldPrecision": 0,
            "fieldComments": "删除",
            "javaType": "",
            "validateType": "",
            "showType": "",
            "dictTypeCode": "",
            "disabled": false
          },
          {
            "fieldName": "version",
            "sort": 8,
            "izPk": 0,
            "izNotNull": 1,
            "izShowList": 0,
            "izShowForm": 0,
            "queryType": "",
            "fieldType": "int",
            "fieldLength": 1,
            "fieldPrecision": 0,
            "fieldComments": "乐观锁",
            "javaType": "",
            "validateType": "",
            "showType": "",
            "dictTypeCode": "",
            "disabled": false
          }

        ],
      dialogVisible: false,//选址内置字段
      // 标示
      flag: 1,
      title: "数据库表设置",
      dictCurr: [],
      baseFormCurr: {},
      tableFormCurr: [],
      formState: {
        jdbcType: false,
        tableType: false,
      },
      rules: {
        tableName: [
          {required: true, trigger: "blur", validator: validateTableName},
        ],
        tableType: [
          {required: true, trigger: "change", message: "请选择表类型"},
        ],
        jdbcType: [
          {required: true, trigger: "change", message: "请选择数据库类型"},
        ],
        comments: [
          {required: true, trigger: "blur", message: "请输入描述"},
        ],
      },

      treeName: "parent_id",
      // 新增字段模版
      columnFormTemp: {
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
      columnRules: {
        fieldName: [
          {required: true, message: "请选择字段名称", trigger: "blur"},
          {required: true, trigger: "blur", validator: validateName},
        ],
        fieldType: [
          {required: true, message: "请选择字段类型", trigger: "change"},
        ],
        fieldComments: [
          {required: true, message: "请输入字段描述", trigger: "blur"},
        ]
      },

      layout: "total, sizes, prev, pager, next, jumper",
      selectRows: "",
      elementLoadingText: "正在加载...",
    };
  },
  created() {
    // 告诉父节点 自己的 flag 编号
    this.$emit("inform-flag", this.flag, this.title);
  },
  mounted() {
    // 拷贝 props
    this.baseFormCurr = deepClone(this.baseForm);
    this.tableFormCurr = deepClone(this.tableForm);
    this.dictCurr = deepClone(this.dict);
    // 数据库字段类型
    this.dictCurr.field_type = this.$getDictList(this.baseFormCurr.jdbcType + "_data_type");

    // 表拖动
    this.rowDrop();

    // 初始化数据
    this.doGetFieldData();
  },

  watch: {
    baseForm(newV, oldV) {
      this.baseFormCurr = deepClone(newV);
    },
    tableForm(newV, oldV) {
      this.tableFormCurr = deepClone(newV);
    },
    dict(newV, oldV) {
      this.dictCurr = deepClone(newV);
      // 数据库字段类型
      this.dictCurr.field_type = this.$getDictList(this.baseFormCurr.jdbcType + "_data_type");
    },
  },
  methods: {
    handleClose() {
      this.dialogVisible = false

    },
    changeBuiltInFieldsSelect(e) {

      this.BuiltInFieldsSelect = this.removeElementsFromArray(this.BuiltInFieldsSelect, this.tableFormCurr)
    },
    removeElementsFromArray(A, B) {

      A = A.filter(a => {
        let isEqual = B.some(b => b.fieldName === a);
        if (isEqual) {
          this.$message.error(`已存在字段：${a}`)
        }
        return !isEqual;
      });
      return A;
    },
    //添加默认字段
    AddDefaultFields(params) {

      console.log(this.BuiltInFieldsSelect)
      for (const param of this.BuiltInFieldsSelect) {
        this.AddDefaultFields2(param)
      }

      this.dialogVisible = false
    },
    //方法2
    AddDefaultFields2(title) {

      let temp = null
      for (const tempElement of this.BuiltInFields) {

        if (tempElement.fieldName == title) {
          temp = tempElement
        }
      }

      this.tableFormCurr.push(temp);
    },


    // 数据库类型发生改动
    jdbcTypeChange(newValue) {
      const _this = this;
      this.tableFormCurr.jdbcType = this.$refs.jdbcType.value;
      this.$baseConfirm("更换数据库类型将会清空当前已设字段，你确定要更换吗", null, () => {
        // 改为新值
        _this.tableFormCurr.jdbcType = newValue;
        // 加载字典
        _this.dictCurr.field_type = _this.$getDictList(_this.baseFormCurr.jdbcType + "_data_type");
        // 清空已有字段数据
        _this.tableFormCurr = [];

        // 初始化数据
        this.doGetFieldData();
      });
    },
    // 表类型发生改动
    tableTypeChange(newValue) {
      if (newValue === '0') {
        // 删除 parent_id 字段
        for (let i = this.tableFormCurr.length - 1; i >= 0; i--) {
          let item = this.tableFormCurr[i];
          if (item.fieldName === this.treeName) {
            this.tableFormCurr.splice(i, 1);
            break;
          }
        }
      } else if (newValue === '1') {
        // 删除 parent_id 字段
        for (let i = this.tableFormCurr.length - 1; i >= 0; i--) {
          let item = this.tableFormCurr[i];
          if (item.fieldName === this.treeName) {
            this.tableFormCurr.splice(i, 1);
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
    pKChange(el) {
      if (!isNull(el)) {
        // 如果主键选中 则默认选中不可为空
        if (el.izPk === 1) {
          el.izNotNull = 1;
        } else {
          el.izNotNull = 0;
        }
      }
    },

    // ==============================

    async doGetFieldData() {
      this.$emit("loading");
      // 通知父级 锁定当前表
      this.$emit("inform-data", {
        fieldList: await this.doGetFieldTypes(),
        JavaFieldMap: await this.doGetJavaFieldTypesBySafety(),
      });
      this.$emit("unLoading");
    },

    // 获得 数据类型
    async doGetFieldTypes() {
      const {data} = await getFieldTypes();
      if (isNotNull(data)) {
        return data;
      }
      return null;
    },
    // 获得 Java 类型 (安全兜底模式)
    async doGetJavaFieldTypesBySafety() {
      const {data} = await getJavaFieldTypesBySafety();
      if (isNotNull(data)) {
        return data;
      }
      return null;
    },

    // 行添加
    columnHandleAdd(params) {
      let temp;
      if (!isNull(params) && !(params instanceof MouseEvent)) {
        temp = params;
      } else {
        temp = deepClone(this.columnFormTemp);
      }

      temp.id = "temp_" + uuid()
      if (this.tableFormCurr == null || this.tableFormCurr.length === 0) {
        temp.sort = 0;
      } else {
        temp.sort = this.tableFormCurr.length;
      }
      this.tableFormCurr.push(temp);
    },

    // 行删除
    columnHandleDelete(row) {
      if (row.id) {
        this.$baseConfirm("你确定要删除当前字段吗", null, () => {
          for (let i = this.tableFormCurr.length - 1; i >= 0; i--) {
            let item = this.tableFormCurr[i];
            if (item.id === row.id) {
              // 树装接口 不允许删除 parent_id 字段
              if (this.tableFormCurr.tableType === '1') {
                if (item.fieldName !== this.treeName) {
                  this.tableFormCurr.splice(i, 1);
                }
              } else {
                this.tableFormCurr.splice(i, 1);
              }
              break;
            }
          }
        });
      } else if (this.selectRows.length > 0) {
        const ids = this.selectRows.map((item) => item.id);
        this.$baseConfirm("你确定要删除当前字段吗", null, () => {
          for (let i = this.tableFormCurr.length - 1; i >= 0; i--) {
            let item = this.tableFormCurr[i];
            if (ids.indexOf(item.id) !== -1) {
              // 树装接口 不允许删除 parent_id 字段
              if (this.tableFormCurr.tableType === '1') {
                if (item.fieldName !== this.treeName) {
                  this.tableFormCurr.splice(i, 1);
                }
              } else {
                this.tableFormCurr.splice(i, 1);
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
    //行拖拽
    rowDrop() {
      const tbody = this.$refs["tableForm"].$el
        .querySelector(".el-table__body-wrapper tbody");
      const _this = this
      Sortable.create(tbody, {
        // 只能纵向拖动
        axis: "y",
        // 限制触发事件只能某个元素可以触发
        handle: ".move-btn",
        // 如果设置成true，则被拖拽的元素在返回新位置时，会有一个动画效果。
        revert: true,
        // 如果设置成true，则元素被拖动到页面边缘时，会自动滚动。
        scroll: true,
        onEnd({oldIndex, newIndex}) {
          _this.tableFormCurr[oldIndex].sort = newIndex;

          // 如果是 从后往前 移动 则 当前项改为newIndex 而 原newIndex 往后的所有内容全部向后顺产移动
          if (oldIndex > newIndex) {
            for (let i = oldIndex; i > newIndex; i--) {
              _this.tableFormCurr[i - 1].sort = i;
            }
          }
          // 如果是 从前往后 移动 则 当前项改为newIndex 而 原newIndex 往后的所有内容全部向前顺产移动
          else {
            for (let i = oldIndex; i < newIndex; i++) {
              _this.tableFormCurr[i + 1].sort = i;
            }
          }
        }
      })
    },
  },
};
</script>

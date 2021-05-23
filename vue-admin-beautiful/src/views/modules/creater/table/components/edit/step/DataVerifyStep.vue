<template>
  <div v-show="active === flag" class="step-main">
    <div class="step-content">
      <el-form ref="tableForm" :model="{'tableForm': tableFormCurr}" >
        <el-table
          v-loading="vLoading"
          :data="tableFormCurr"
          :element-loading-text="elementLoadingText"
          @selection-change="setSelectRows"
          border
        >

          <el-table-column
            show-overflow-tooltip
            prop="fieldName"
            label="字段名称"
            width="200"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.fieldName'"
                :rules="columnRules.fieldName"
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
            prop="fieldComments"
            label="字段描述"
            min-width="240"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.fieldComments'"
                :rules="columnRules.fieldComments"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.fieldComments"
                          maxlength="100"
                          show-word-limit
                          :disabled="true"
                          style="width: 100%"/>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="validateType"
            label="验证类别"
            width="280"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.validateType'"
                :rules="columnRules.validateType"
                class="el-form-item-table"
              >
                <el-select v-model="scope.row.validateType" placeholder="请选择"
                           default-first-option="" filterable
                           multiple collapse-tags
                           :disabled="scope.row.disabled"
                           style="width: 100%" >
                  <el-option
                    v-for="item in dictCurr.validate_type"
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
            prop="izDesensitized"
            label="数据脱敏"
            width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.izDesensitized'"
                class="el-form-item-table"
              >
                <el-switch
                  v-model="scope.row.izDesensitized"
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
    </div>

    <step-footer
      ref="step-footer"
      :flag="flag"
      :min-flag="minFlag"
      :max-flag="maxFlag"
      :info-data="{
        obj: this,
        baseForm: baseFormCurr,
        tableForm: tableFormCurr
      }"
    ></step-footer>
  </div>
</template>
<script>
  import StepFooter from "./footer/StepFooter"
  import {deepClone} from "@/utils/clone";
  import Sortable from "sortablejs";
  import {isCode, isNull} from "@/utils/validate";

  export default {
    name: "DataVerifyStep",
    components: { StepFooter },
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
      vLoading: {
        type: Boolean,
        default: () => {
          return false;
        },
      },
    },
    data() {

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
        // 标示
        flag: 2,
        baseFormCurr: {},
        tableFormCurr: [],

        columnRules: {

        },
        layout: "total, sizes, prev, pager, next, jumper",
        selectRows: "",
        elementLoadingText: "正在加载...",
      };
    },
    created() {
      // 告诉父节点 自己的 flag 编号
      this.$emit("inform-flag", this.flag);
    },
    mounted() {
      // 拷贝 props
      this.baseFormCurr = deepClone(this.baseForm);
      this.tableFormCurr = deepClone(this.tableForm);
      this.dictCurr = deepClone(this.dict);
    },
    watch: {
      baseForm(newV,oldV) {
        this.baseFormCurr = deepClone(newV);
      },
      tableForm(newV,oldV) {
        this.tableFormCurr = deepClone(newV);
      },
      dict(newV,oldV) {
        this.dictCurr = deepClone(newV);
      },
    },
    methods: {
      // 行选中
      setSelectRows(val) {
        this.selectRows = val;
      },
    },
  };
</script>

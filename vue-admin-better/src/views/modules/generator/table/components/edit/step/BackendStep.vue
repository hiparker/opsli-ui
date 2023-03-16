<template>
  <div v-show="active === flag" class="step-main">
    <div class="step-content">
      <el-form ref="tableForm" :model="{'tableForm': tableFormCurr}" >
        <el-table
          :data="tableFormCurr"
          :element-loading-text="elementLoadingText"
          @selection-change="setSelectRows"
          border
        >

          <el-table-column
            show-overflow-tooltip
            label="拖动"
            width="60"
            align="center"
          >
            <template slot-scope="scope">
              <el-button icon="el-icon-d-caret"
                         class="move-btn"
                         circle
              ></el-button>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fieldName"
            label="字段名称"
            min-width="200"
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
            prop="javaType"
            label="Java类型"
            min-width="130"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.javaType'"
                :rules="columnRules.javaType"
                class="el-form-item-table"
              >
                <el-select v-model="scope.row.javaType" placeholder="请选择"
                           default-first-option="" filterable
                           :disabled="scope.row.disabled || scope.row.showType === '2'"
                           style="width: 100%" >
                  <el-option
                    v-for="item in baseDictData.JavaFieldMap[scope.row.fieldType]"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="dictTypeCode"
            label="字典类型编号"
            min-width="160"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.dictTypeCode'"
                :rules="columnRules.dictTypeCode"
                class="el-form-item-table"
              >
                <el-input v-model="scope.row.dictTypeCode"
                          :disabled="scope.row.disabled || scope.row.showType !== '2'"
                          style="width: 100%" />
              </el-form-item>
            </template>
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="validateType"
            label="验证类别"
            min-width="280"
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

<!--          <el-table-column-->
<!--            show-overflow-tooltip-->
<!--            prop="izDesensitized"-->
<!--            label="数据脱敏"-->
<!--            min-width="120"-->
<!--          >-->
<!--            <template slot-scope="scope">-->
<!--              <el-form-item-->
<!--                :prop="'tableForm.'+scope.$index+'.izDesensitized'"-->
<!--                class="el-form-item-table"-->
<!--                title="不建议在 主键等关键字段使用，会导致无法找到该数据"-->
<!--              >-->
<!--                <el-switch-->
<!--                  v-model="scope.row.izDesensitized"-->
<!--                  :active-value="1"-->
<!--                  :inactive-value="0"-->
<!--                  :disabled="scope.row.disabled"-->
<!--                >-->
<!--                </el-switch>-->
<!--              </el-form-item>-->
<!--            </template>-->
<!--          </el-table-column>-->

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
  import Sortable from "sortablejs";
  import StepFooter from "./footer/StepFooter"
  import {deepClone} from "@/utils/clone";
  import {isCode, isNull} from "@/utils/validate";

  export default {
    name: "BackendStep",
    components: { Sortable, StepFooter },
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
      baseDictData:{
        type: Object,
        default: () => {
          return {
            fieldList: [],
            JavaFieldMap: {},
          };
        },
      },
    },
    data() {

      const validateDictCode = (rule, value, callback) => {
        let index = parseInt(rule.field.split(".")[1]);
        if(index !== null && index !== undefined){
          let listTmp = this.tableFormCurr[index];
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

      return {
        // 标示
        flag: 3,
        title: "后端实体设置",
        dictCurr: [],
        baseFormCurr: {},
        tableFormCurr: [],

        columnRules: {
          javaType: [
            { required: true, message: "请选择Java类型", trigger: "change" },
          ],
          dictTypeCode: [
            { required: true, validator: validateDictCode, trigger: "blur" },
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

      // 表拖动
      this.rowDrop();
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

      // ===============================

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
            if(oldIndex > newIndex){
              for (let i = oldIndex; i > newIndex; i--) {
                _this.tableFormCurr[i-1].sort = i;
              }
            }
            // 如果是 从前往后 移动 则 当前项改为newIndex 而 原newIndex 往后的所有内容全部向前顺产移动
            else{
              for (let i = oldIndex; i < newIndex; i++) {
                _this.tableFormCurr[i+1].sort = i;
              }
            }
          }
        })
      },
    },
  };
</script>

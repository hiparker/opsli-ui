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
            prop="showType"
            label="展示方式"
            min-width="140"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.showType'"
                class="el-form-item-table"
              >
                <el-select v-model="scope.row.showType" placeholder="请选择"
                           default-first-option="" filterable clearable
                           :disabled="scope.row.disabled"
                           @change="showTypeChange(scope.row)"
                           style="width: 100%" >
                  <el-option
                    v-for="item in dictCurr.show_type"
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
            min-width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.izShowList'"
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
            min-width="80"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.izShowForm'"
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
            min-width="140"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableForm.'+scope.$index+'.queryType'"
                class="el-form-item-table"
              >
                <!-- 如果为 2 3 字典和日期, 或者 不在列表显示 的话 禁止手动选择 -->
                <el-select v-model="scope.row.queryType" placeholder="请选择(可空)"
                           default-first-option="" clearable
                           collapse-tags

                           :disabled="scope.row.disabled || scope.row.showType === '2'
                                      || scope.row.showType === '3' || scope.row.showType === '4'
                                      || scope.row.izShowList === null || scope.row.izShowList === 0
                                      "
                           style="width: 100%" >
                  <el-option
                    v-for="item in dictCurr.query_type"
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
    name: "FrontendStep",
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

      return {
        // 标示
        flag: 2,
        title: "前端展示设置",
        dictCurr: [],
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
      // 列表显示
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

<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="90% !important"
    top="4vh"
    @close="close"
  >
    <div class="creater-main">
      <div class="creater-el-steps">
        <el-steps :active="active"
                  align-center
                  finish-status="finish"
                  :direction="direction" class="steps">
          <el-step title="数据库表设置"></el-step>
          <el-step title="数据验证设置"></el-step>
          <el-step title="前端展示设置"></el-step>
          <el-step title="后端实体设置"></el-step>
        </el-steps>
      </div>
      <div class="creater-steps">
        <table-data-step
          :base-form="baseForm"
          :table-form="tableForm"
          :active="active"
          :min-flag="minFlag"
          :max-flag="maxFlag"
          :dict="dict"
          :v-loading="columnListLoading"
          @inform-flag="informFlag"
          @change-step="handleSetStep"
          @close="close"
          @submit="save"
        ></table-data-step>

        <data-verify-step
          :base-form="baseForm"
          :table-form="tableForm"
          :active="active"
          :min-flag="minFlag"
          :max-flag="maxFlag"
          :dict="dict"
          :v-loading="columnListLoading"
          @inform-flag="informFlag"
          @change-step="handleSetStep"
          @close="close"
          @submit="save"
        ></data-verify-step>

        <frontend-step
          :base-form="baseForm"
          :table-form="tableForm"
          :active="active"
          :min-flag="minFlag"
          :max-flag="maxFlag"
          :dict="dict"
          :v-loading="columnListLoading"
          @inform-flag="informFlag"
          @change-step="handleSetStep"
          @close="close"
          @submit="save"
        ></frontend-step>

        <backend-step
          :base-form="baseForm"
          :table-form="tableForm"
          :active="active"
          :min-flag="minFlag"
          :max-flag="maxFlag"
          :dict="dict"
          :v-loading="columnListLoading"
          @inform-flag="informFlag"
          @change-step="handleSetStep"
          @close="close"
          @submit="save"
        ></backend-step>

      </div>

    </div>

  </el-dialog>
</template>

<script>
  import $store from "@/store";
  import TableDataStep from "./step/TableDataStep";
  import DataVerifyStep from "./step/DataVerifyStep";
  import BackendStep from "./step/BackendStep";
  import FrontendStep from "./step/FrontendStep";
  import {getSubList} from "@/api/creater/tableManagement";
  import {isNull} from "@/utils/validate";
  import {deepClone} from "@/utils/clone";


  export default {
    name: "CreateTableManagementEdit",
    components: { TableDataStep, DataVerifyStep, BackendStep, FrontendStep },
    data() {
      return {
        direction: "horizontal",
        active: 1,
        minFlag: 1,
        maxFlag: 1,
        flagArray: [],
        queryForm: {},
        baseForm: {
          jdbcType: "mysql",
        },
        oldBaseForm:{},
        tableForm: [],
        oldTableForm: [],
        dict: {},
        title: "",
        columnListLoading: true,
        dialogFormVisible: false,
      };
    },
    created() {
      // 如果不是每次开启时查询 在created中 有可能会短暂查不到
      this.dict.table_type =  this.$getDictList("table_type");
      this.dict.jdbc_type =  this.$getDictList("jdbc_type");
      this.dict.java_data_type =  this.$getDictList("java_data_type");
      this.dict.show_type =  this.$getDictList("show_type");
      this.dict.validate_type =  this.$getDictList("validate_type");
      this.dict.query_type =  this.$getDictList("query_type");


      // 如果大于 992 就显示 宽屏模式
      this.screenWidth($store.state.realTime.screenWidth)
    },
    watch: {
      //监听屏幕宽度变化
      '$store.state.realTime.screenWidth': function(val, oldVal){
        this.screenWidth(val);
      },
    },
    methods: {
      // 显示
      showEdit(row) {
        if (!row) {
          this.title = "添加";
        } else {
          this.title = "编辑";
          this.baseForm = Object.assign({}, row);
          this.queryForm.id = this.baseForm.id;
        }
        this.dialogFormVisible = true;
        // 加载数据
        this.fetchData();
      },
      // 关闭
      close() {
        this.dialogFormVisible = false;
        this.active = 1;
        this.baseForm = this.$options.data().baseForm;
        this.tableForm = this.$options.data().tableForm;
        this.queryForm = this.$options.data().queryForm;
      },
      // 上报Flag号
      informFlag(flag){
        this.flagArray.push(flag);
        this.minFlag = Math.min.apply(Math, this.flagArray);
        this.maxFlag = Math.max.apply(Math, this.flagArray);
        this.active = this.minFlag;
      },
      // 执行步骤
      handleSetStep(active, baseForm, tableForm) {
        if(this.active+active > this.active){
          // 备份上一步状态
          this.oldBaseForm = deepClone(this.baseForm);
          this.oldTableForm = deepClone(this.tableForm);

          if(baseForm){
            this.baseForm = deepClone(baseForm);
          }
          if(tableForm  && tableForm.length > 0){
            const tmpForm = this.$baseLodash.sortBy(tableForm,
              item=>{return item.sort});
            this.tableForm = deepClone(tmpForm);
          }

        }else{
          // 还原上一步状态
          const tmpForm = this.$baseLodash.sortBy(this.oldTableForm,
            item=>{return item.sort});
          this.tableForm = deepClone(tmpForm);
        }

        // 执行保存操作
        if(this.active+active > this.maxFlag){
          this.save()
        }else {
          this.active += active;

          this.columnListLoading = true;
          const tmpTableForm = deepClone(this.tableForm);
          this.tableForm = this.$options.data().tableForm;
          setTimeout(()=>{
            this.columnListLoading = false;
            this.tableForm = deepClone(tmpTableForm);
          },50);
        }
      },
      // 保存
      save() {
        console.log(this.baseForm);
        console.log(this.tableForm);
        console.log("提交")
        return;
      },

      // =================

      // 请求数据
      async fetchData() {
        this.columnListLoading = true;
        const { data } = await getSubList(this.queryForm);
        let flag = false;
        if(!isNull(data)){
          if(!isNull(data.columnList)){
            flag = true;
            // 处理数据
            // 设置禁止修改字段 （如果有树表 则 parent_id 字段不允许任何修改）
            for (let i = 0; i < data.columnList.length; i++) {
              this.tableForm.push(data.columnList[i]);

              if(!isNull(this.tableForm[i].izPk)){
                this.tableForm[i].izPk = parseInt(this.tableForm[i].izPk);
              }
              if(!isNull(this.tableForm[i].izNotNull)){
                this.tableForm[i].izNotNull = parseInt(this.tableForm[i].izNotNull);
              }
              if(!isNull(this.tableForm[i].izShowList)){
                this.tableForm[i].izShowList = parseInt(this.tableForm[i].izShowList);
              }
              if(!isNull(this.tableForm[i].izShowForm)){
                this.tableForm[i].izShowForm = parseInt(this.tableForm[i].izShowForm);
              }
              if(!isNull(this.tableForm[i].validateType)){
                this.tableForm[i].validateType = this.tableForm[i].validateType.split(",");
              }
            }

            setTimeout(() => {
              this.columnListLoading = false;
            }, 300);
          }
        }
        if(!flag){
          setTimeout(() => {
            this.columnListLoading = false;
          }, 300);
        }
      },

      /**
       * 控制分辨率显示模式
       * @param val
       */
      screenWidth(val){
        // 如果大于 992 就显示 宽屏模式
        if(val >= 992 ){
          this.direction = "horizontal";
        }else{
          this.direction = "vertical";
        }
      },
    },
  }
</script>
<style lang="scss">
  .creater-main{
    position: relative;

    .creater-el-steps{
      max-height: 160px;
    }

    .creater-steps{
      position: relative;
      z-index: 999;
      width: 100%;
    }

    .steps{
      margin-bottom: 10px;
    }

    .move-btn{
      cursor: grab;
    }

    .el-step.is-vertical{
      .el-step__title {
        text-align: center;
      }
    }

    .step-main{
      .step-content{
        position: relative;
        height: 540px;
        overflow-x: hidden;
        overflow-y: auto;

        .el-table {
          display: inline-grid !important;
        }
      }
      .step-footer {
        position: relative;
        left: -20px;
        box-sizing: border-box;
        display: grid;
        width: calc(100% + 40px);
        padding: 20px 20px 0;
        overflow: hidden;
        text-align: right;
        border-top: 1px solid #dcdfe6;
      }
    }
  }
</style>

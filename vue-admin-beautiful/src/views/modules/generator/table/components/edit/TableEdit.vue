<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="90% !important"
    top="4vh"
    @close="close"
  >
    <div class="generator-main">
      <div class="generator-el-steps">
        <el-steps :active="active"
                  align-center
                  finish-status="finish"
                  :direction="direction" class="steps">
          <!-- for 循环展示字段 -->
          <el-step  v-for="(step, index) in flagObjArray"
                    :key="index"
                    :title="step.title"
          ></el-step>
        </el-steps>
      </div>

      <div class="generator-steps">
        <table-data-step
          :base-dict-data="baseDictData"
          :base-form="baseForm"
          :table-form="tableForm"
          :active="active"
          :min-flag="minFlag"
          :max-flag="maxFlag"
          :dict="dict"
          @loading="loading"
          @un-loading="unLoading"
          @inform-flag="informFlag"
          @inform-data="informData"
          @change-step="handleSetStep"
          @close="close"
          @submit="save"
        ></table-data-step>

        <frontend-step
          :base-dict-data="baseDictData"
          :base-form="baseForm"
          :table-form="tableForm"
          :active="active"
          :min-flag="minFlag"
          :max-flag="maxFlag"
          :dict="dict"
          @loading="loading"
          @un-loading="unLoading"
          @inform-flag="informFlag"
          @inform-data="informData"
          @change-step="handleSetStep"
          @close="close"
          @submit="save"
        ></frontend-step>

        <backend-step
          :base-dict-data="baseDictData"
          :base-form="baseForm"
          :table-form="tableForm"
          :active="active"
          :min-flag="minFlag"
          :max-flag="maxFlag"
          :dict="dict"
          @loading="loading"
          @un-loading="unLoading"
          @inform-flag="informFlag"
          @inform-data="informData"
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
  import BackendStep from "./step/BackendStep";
  import FrontendStep from "./step/FrontendStep";
  import {doInsert, doUpdate, getSubList} from "@/api/generator/tableManagement";
  import {isNull} from "@/utils/validate";
  import {deepClone} from "@/utils/clone";

  export default {
    name: "CreateTableManagementEdit",
    components: { TableDataStep, BackendStep, FrontendStep },
    data() {
      return {
        direction: "horizontal",
        active: 1,
        minFlag: 1,
        maxFlag: 1,
        flagObjArray: [],
        flagArray: [],
        baseDictData: {},
        queryForm: {},
        baseForm: {
          jdbcType: "mysql",
        },
        tableForm: [],
        backupStepData: {}, // 备份步骤数据
        dict: {},
        title: "",
        dialogFormVisible: false,
        target: null,
        columnListLoading: true,
        elementLoadingObj: null,
        elementLoadingText: "正在加载...",
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
          this.title = "代码生成 - 添加";
        } else {
          this.title = "代码生成 - 编辑";
          this.baseForm = Object.assign({}, row);
          this.queryForm.id = this.baseForm.id;
          // 加载数据
          this.fetchData();
        }
        this.dialogFormVisible = true;
      },
      // 关闭
      close() {
        this.dialogFormVisible = false;
        this.active = 1;
        this.flagArray = this.$options.data().flagArray;
        this.baseForm = this.$options.data().baseForm;
        this.tableForm = this.$options.data().tableForm;
        this.queryForm = this.$options.data().queryForm;
        this.backupStepData = this.$options.data().backupStepData;
      },
      loading(){
        this.$nextTick(async () => {
          if(this.elementLoadingObj){
            this.elementLoadingObj.close();
          }
          // 执行表格刷新 （需要彻底情况并延迟 才会生效）
          this.elementLoadingObj = this.$basePartLoading(this.target, null, this.elementLoadingText);
        });
      },
      unLoading() {
        this.$nextTick(() => {
          if(this.elementLoadingObj){
            this.elementLoadingObj.close();
          }
        });
      },
      // 上报Flag号
      informFlag(flag, title){
        let temp = {
          flag: flag,
          title: title
        }
        this.flagObjArray.push(temp);
        this.flagArray.push(flag);

        // 处理数据
        this.minFlag = Math.min.apply(Math, this.flagArray);
        this.maxFlag = Math.max.apply(Math, this.flagArray);
        this.active = this.minFlag;
        this.flagObjArray = this.$baseLodash.sortBy(this.flagObjArray,
          item=>{return item.sort});
      },
      // 执行步骤
      handleSetStep(active, baseForm, tableForm) {
        this.$nextTick(() => {
          // 未来选中项
          const futureActive = this.active + active;

          if(futureActive > this.active){
            // 记录上次步骤
            this.backupStepData[this.active] = {
              baseForm: deepClone(this.baseForm),
              tableForm: deepClone(this.tableForm),
            };

            if(baseForm){
              this.baseForm = deepClone(baseForm);
            }
            if(tableForm && tableForm.length > 0){
              const tmpForm = this.$baseLodash.sortBy(tableForm,
                item=>{return item.sort});
              this.tableForm = deepClone(tmpForm);
            }

          }else {
            const bygoneActive = this.backupStepData[futureActive];
            if(bygoneActive){
              if(bygoneActive.baseForm){
                this.baseForm = deepClone(bygoneActive.baseForm);
              }
              if(bygoneActive.tableForm && bygoneActive.tableForm.length > 0){
                const tmpForm = this.$baseLodash.sortBy(bygoneActive.tableForm,
                  item=>{return item.sort});
                this.tableForm = deepClone(tmpForm);
              }
            }
          }

          // 执行保存操作
          if(futureActive > this.maxFlag){
            this.save()
          }else {
            this.active = futureActive;

            // 执行表格刷新 （需要彻底情况并延迟 才会生效）
            this.elementLoadingObj = this.$basePartLoading(this.target, null, this.elementLoadingText);

            const tmpTableForm = deepClone(this.tableForm);
            this.tableForm = this.$options.data().tableForm;
            setTimeout(()=>{
              if(this.elementLoadingObj){
                this.elementLoadingObj.close();
              }

              this.tableForm = deepClone(tmpTableForm);
            },50);
          }
        });
      },
      // 保存
      async save() {
        // 字段数据
        let tmpForm = deepClone(this.baseForm);
        // 字段数据
        let columnList = deepClone(this.tableForm);
        // 处理数据
        for (let i = 0; i < columnList.length; i++) {
          delete columnList[i].disabled;
          if(!isNull(columnList[i].izPk)){
            columnList[i].izPk = columnList[i].izPk+"";
          }
          if(!isNull(columnList[i].izNotNull)){
            columnList[i].izNotNull = columnList[i].izNotNull+"";
          }
          if(!isNull(columnList[i].izShowList)){
            columnList[i].izShowList = columnList[i].izShowList+"";
          }
          if(!isNull(columnList[i].izShowForm)){
            columnList[i].izShowForm = columnList[i].izShowForm+"";
          }
          if(!isNull(columnList[i].validateType)){
            columnList[i].validateType = columnList[i].validateType.join(",");
          }
        }

        if(columnList.length === 0){
          tmpForm.columnList = null;
        }else{
          tmpForm.columnList = columnList;
        }

        // 修改
        if (!isNull(tmpForm.id)) {
          const { msg } = await doUpdate(tmpForm);
          this.$baseMessage(msg, "success");
        } else {
          const { msg } = await doInsert(tmpForm);
          this.$baseMessage(msg, "success");
        }
        this.close();
        await this.$emit("fetchData");
      },

      // =================

      // 上报数据
      informData(data){
        this.baseDictData = data;
      },

      // 请求数据
      fetchData() {
        this.$nextTick(async () => {
          // loading 对象
          this.target = document.querySelector(".generator-main .generator-steps");
          this.elementLoadingObj = this.$basePartLoading(this.target, null, this.elementLoadingText);
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
                if(this.elementLoadingObj){
                  this.elementLoadingObj.close();
                }
              }, 300);
            }
          }
          if(!flag){
            setTimeout(() => {
              if(this.elementLoadingObj){
                this.elementLoadingObj.close();
              }
            }, 300);
          }

        });
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
  .generator-main{
    position: relative;

    .el-form-item-table{
      margin-top: 22px;
    }

    .generator-el-steps{
      max-height: 160px;
    }

    .generator-steps{
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

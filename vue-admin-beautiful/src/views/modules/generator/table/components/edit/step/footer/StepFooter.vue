<template>
  <div class="step-footer">
    <div class="dialog-footer">
      <el-button
        type="primary"
        :disabled="flag <= minFlag"
        @click="handlePrev"
      >
        上一步
      </el-button>
      <el-button type="primary"
                 :disabled="flag >= maxFlag"
                 @click="handleNext"
      >
        下一步
      </el-button>
      <el-button @click="close">取 消</el-button>

      <el-button type="primary"
                 :disabled="flag !== maxFlag"
                 @click="handleNext"
      >
        完成
      </el-button>
    </div>
  </div>
</template>
<script>

export default {
    props: {
      flag: {
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
      /**
       * 初始化
       * @param obj 当前对象
       * @param baseForm 表信息
       * @param tableForm 表结构
       * */
      infoData: {
        type: Object,
        default: () => {
          return {};
        },
      },
    },
    data() {
      return {
        visible: true,
      };
    },
    created() {

    },
    methods: {
      // 关闭
      close(){
        this.infoData.obj.$emit("close");
      },
      // 上一步
      handlePrev(){
        this.infoData.obj.$emit("change-step", -1);
      },
      // 下一步
      async handleNext() {
        await this.verify(() => {
          this.infoData.obj.$emit("change-step", 1,
            this.infoData.baseForm,  this.infoData.tableForm);
        })
      },
      /**
       * 验证
       * @param callback 回调
       * @returns {Promise<boolean>}
       */
      async verify(callback){
        // 验证结果
        let ret = false;
        if(!this.infoData.baseForm){
          this.$baseMessage("表信息不可为空", "warning");
          return ret;
        }
        if(!this.infoData.tableForm || this.infoData.tableForm.length === 0){
          this.$baseMessage("表结构不可为空", "warning");
          return ret;
        }


        let baseFormEl = this.infoData.obj.$refs["baseForm"];
        if(baseFormEl){
          ret = await baseFormEl.validate();
        }

        let tableFormEl = this.infoData.obj.$refs["tableForm"];
        if(tableFormEl){
          ret = await tableFormEl.validate();
        }

        if(ret){
          callback();
        }else{
          return ret;
        }
      },
    },
  };
</script>

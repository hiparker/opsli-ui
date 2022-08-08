<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >
    <el-row :gutter="10" class="detail" >
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>日志ID：</b> {{ form.id }}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>日志类型：</b> {{ $getDictNameByValue('log_type', form.logType)}}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>日志等级：</b> {{ $getDictNameByValue('log_level', form.level)}}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>被操作的系统模块：</b> {{ $getDictNameByValue('log_model_type', form.moduleId)}}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>操作人账号：</b> {{ form.username }}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>操作人名称：</b> {{ form.realName}}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>操作类型：</b> {{ $getDictNameByValue('log_operation_type', form.operationType)}}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>运行时间(ms)：</b> {{ form.runTime }}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>日志描述：</b> {{ form.description }}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>执行方法：</b> {{ form.method }}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>请求参数：</b> {{ form.args }}
      </el-col>

      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <b>返回结果：</b> {{ form.returnValue }}
      </el-col>

    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button @click="close">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "OperationDetail",
    data() {
      return {
        form: {},
        title: "日志详情",
        dialogFormVisible: false,
      };
    },
    created() {

    },
    methods: {
      show(row) {
        this.form = Object.assign({}, row);
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.form = this.$options.data().form;
      },
    },
  };
</script>
<style scoped>
  .detail .el-col {
    padding-bottom: 18px;
  }
</style>

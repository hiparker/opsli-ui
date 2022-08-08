<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    @close="close"
  >

    <el-row :gutter="10" >

      <el-col :span="12">
        <el-button type="info" :loading="loading"
                   disabled
                   class="login-btn"
                   @click="tipsClick('system')"
        >超级管理员(演示环境不可查看)</el-button>
      </el-col>

      <el-col :span="12">
        <el-button type="danger" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('admin')"
        >系统管理员</el-button>
      </el-col>

    </el-row>

    <el-divider></el-divider>

    <el-row :gutter="10" >

      <el-col :span="12">
        <el-button type="warning" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('tenant')"
        >租户总管理员</el-button>
      </el-col>

      <el-col :span="12">
        <el-button type="primary" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('demo')"
        >租户内管理角色(全部数据)</el-button>
      </el-col>

      <el-col :span="12">
        <el-button type="primary" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('dept')"
        >租户内部门管理员(部门数据)</el-button>
      </el-col>

      <el-col :span="12">
        <el-button type="primary" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('songyi')"
        >租户内职工(只查看自己)</el-button>
      </el-col>

    </el-row>

  </el-dialog>
</template>

<script>
  export default {
    name: "LoginTips",
    components: { },
    data() {

      return {
        title: "快速登录Tips",
        dialogFormVisible: false,
        loading: false,
        account:{
          admin: "Aa123456.",
          tenant: "Aa123456.",
          demo: "Aa123456.",
          dept: "Aa123456.",
          songyi: "Aa123456.",
        }
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      close(){
        this.dialogFormVisible = false;
        this.loading = false;
      },
      show() {
        this.dialogFormVisible = true;
      },
      tipsClick(key) {
        if(!this.account[key]){
          return;
        }

        this.loading = true;
        let ret = {
          username: key,
          password: this.account[key]
        }
        // 全部刷新
        this.$emit("tipsClick", ret);
      },
    },
  };
</script>
<style scoped>
  .login-btn{
    margin-bottom: 10px;
    width: 100%;
    line-height: 100px;
    text-align: center;
    cursor: pointer;
  }
</style>


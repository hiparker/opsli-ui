<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    :close-on-click-modal="false"
    width="800px"
    :show-close="false"
  >

    <el-row :gutter="10" >

      <el-col :span="8">
        <el-button type="danger" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('admin')"
        >系统管理员</el-button>
      </el-col>

      <el-col :span="8">
        <el-button type="warning" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('demo')"
        >租户管理员</el-button>
      </el-col>

      <el-col :span="8">
        <el-button type="primary" :loading="loading"
                   class="login-btn"
                   @click="tipsClick('gen')"
        >租户业务员</el-button>
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
        title: "登录Tips",
        dialogFormVisible: false,
        loading: false,
        account:{
          admin: "Admin123456.",
          demo: "Aa123456.",
          gen: "Aa123456.",
        }
      };
    },
    created() {
    },
    mounted() {
    },
    methods: {
      show() {
        this.dialogFormVisible = true;
      },
      tipsClick(key) {
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
    width: 100%;
    line-height: 100px;
    text-align: center;
    cursor: pointer;
  }
</style>


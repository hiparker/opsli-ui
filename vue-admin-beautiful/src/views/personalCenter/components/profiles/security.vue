<template>
  <div class="personalCenter-container">

    <el-row>
      <h2>安全设置</h2>
    </el-row>
    <el-row>
      <el-row class="security-item">
        <el-col>
          <div class="security-item-title">
            账户密码
          </div>
          <div class="security-item-content">
            密码强度：{{ $getDictNameByValue('password_level', baseForm.passwordLevel)||"-" }}
            <el-button type="text" @click="updatePassword"> 修改 </el-button>
            <el-button type="text" @click="updatePasswordByForget"> 忘记密码 </el-button>
          </div>
          <el-divider></el-divider>
        </el-col>
      </el-row>

      <el-row class="security-item">
        <el-col>
          <div class="security-item-title">
            邮箱
          </div>
          <div class="security-item-content">
            {{ baseForm.email||"-" }}
            <el-button type="text" @click="updateEmail"> 修改 </el-button>
          </div>
          <el-divider></el-divider>
        </el-col>
      </el-row>

      <el-row class="security-item">
        <el-col>
          <div class="security-item-title">
            手机号
          </div>
          <div class="security-item-content">
            {{ baseForm.mobile||"-"  }}
            <el-button type="text" @click="updateMobile"> 修改 </el-button>
          </div>
          <el-divider></el-divider>
        </el-col>
      </el-row>

    </el-row>

    <update-password ref="update-password"
                     @fetchData="fetchData"
    ></update-password>

    <update-password-by-forget
                     ref="update-password-by-forget"
                     @fetchData="fetchData"
    ></update-password-by-forget>

    <update-email ref="update-email"
                  @fetchData="fetchData"
    ></update-email>

    <update-mobile ref="update-mobile"
                  @fetchData="fetchData"
    ></update-mobile>
  </div>
</template>

<script>
  import UpdatePassword from "../UserManagementPassword";
  import UpdatePasswordByForget from "../UpdatePasswordByForget"
  import UpdateEmail from  "../UpdateEmail"
  import UpdateMobile from  "../UpdateMobile"

  import { getUserInfo } from "@/api/user";
  import {getAccessToken} from "@/utils/accessToken";
  import {isNull} from "@/utils/validate";
  export default {
    name: "PersonalCenterSecurity",
    components: { UpdatePassword, UpdateEmail, UpdateMobile, UpdatePasswordByForget },
    data() {
      return {
        baseForm: {
          passwordLevel: "0"
        }
      }
    },
    created() {
      // 加载用户信息
      this.fetchData();
    },
    methods: {
      updatePassword() {
        this.$refs["update-password"].show();
      },
      updateMobile() {
        this.$refs["update-mobile"].show();
      },
      updateEmail() {
        this.$refs["update-email"].show();
      },
      updatePasswordByForget() {
        this.$refs["update-password-by-forget"].show();
      },
      // 获取数据
      async fetchData() {
        let accessToken = getAccessToken();
        const { data } = await getUserInfo(accessToken);
        if (!isNull(data)) {
          this.baseForm = Object.assign({}, data);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .personalCenter-container{
    .security-item{
      .security-item-title{
        padding: 5px;
        font-size: 14px;
        font-weight: bold;
      }
      .security-item-content{
        padding: 5px 20px 5px 5px;
        font-size: 14px;
        color: rgba(0,0,0,.45);
      }
      button{
        float: right;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
</style>

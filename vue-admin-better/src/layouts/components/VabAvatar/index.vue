<template>
  <span>
    <el-dropdown @command="handleCommand">
      <span class="avatar-dropdown">
        <el-avatar :size="40" :src="avatar">
          <el-avatar icon="el-icon-user-solid" :size="40"></el-avatar>
        </el-avatar>
        <div class="user-name">
          {{ username }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-if="null !== userInfo && !userInfo.switchTenantId"
          command="personalCenter"
        >
          <vab-icon :icon="['fas', 'user']"></vab-icon>
          个人中心
        </el-dropdown-item>
        <el-dropdown-item
          v-if="null !== userInfo && '1' === userInfo.enableSwitchTenant"
          command="switchTenant"
          divided
        >
          <vab-icon :icon="['fas', 'user-secret']"></vab-icon>
          {{ userInfo.switchTenantId ? "恢复系统管理" : "切换租户" }}
        </el-dropdown-item>
        <el-dropdown-item command="logout" divided>
          <vab-icon :icon="['fas', 'sign-out-alt']"></vab-icon>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 选择租户 -->
    <choose-tenant ref="choose-tenant"></choose-tenant>
  </span>
</template>

<script>
  import { mapGetters } from "vuex";
  import { recordRoute } from "@/config";
  import { getUserInfo } from "@/api/user";
  import ChooseTenant from "./components/ChooseTenant";
  import {
    switchTenant,
    switchOneself,
  } from "@/api/system/user/userManagement";

  export default {
    name: "VabAvatar",
    computed: {
      ...mapGetters({
        avatar: "user/avatar",
        username: "user/username",
      }),
    },
    // eslint-disable-next-line vue/order-in-components
    components: { ChooseTenant },
    // eslint-disable-next-line vue/order-in-components
    data() {
      return {
        userInfo: {},
      };
    },
    created() {
      this.getCurrUser();
    },
    methods: {
      handleCommand(command) {
        switch (command) {
          case "logout":
            this.logout();
            break;
          case "personalCenter":
            this.personalCenter();
            break;
          case "switchTenant":
            this.switchTenant();
            break;
        }
      },
      personalCenter() {
        this.$router.push("/personal/center");
      },
      // 切换租户
      switchTenant() {
        this.$refs["choose-tenant"].show(this.userInfo.switchTenantId);
      },
      logout() {
        this.$baseConfirm(
          "您确定要退出" + this.$baseTitle + "吗?",
          null,
          async () => {
            await this.$store.dispatch("user/logout");
            if (recordRoute) {
              const fullPath = this.$route.fullPath;
              this.$router.push(`/login?redirect=${fullPath}`);
            } else {
              this.$router.push("/login");
            }
          }
        );
      },
      // 获取当前登录用户数据
      async getCurrUser() {
        let accessToken = this.$baseAccessToken();
        const { data } = await getUserInfo(accessToken);
        if (null !== data && undefined !== data) {
          this.userInfo = Object.assign({}, data);
        }
      },
    },
  };
</script>
<style lang="scss" scoped>
  .avatar-dropdown {
    padding: 0;
    height: 50px;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .user-name {
      margin-left: 5px;
      position: relative;
      margin-left: 5px;
      font-weight: 600;
      cursor: pointer;
    }
  }
</style>

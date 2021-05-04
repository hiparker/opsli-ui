<template>
  <div class="personalCenter-container">

    <el-row :gutter="10">
      <el-tabs :tab-position="tabPosition">
        <el-tab-pane label="基本设置">
          <profile-base ref="profile-base"/>
        </el-tab-pane>
        <el-tab-pane label="安全设置">
          <profile-security ref="profile-security"/>
        </el-tab-pane>
      </el-tabs>
    </el-row>

  </div>
</template>

<script>
  import ProfileBase from "./components/profiles/base";
  import ProfileSecurity from "./components/profiles/security";

  export default {
    name: "PersonalCenter",
    components: { ProfileBase, ProfileSecurity },
    data() {
      return {
        tabPosition: "top",
        screenWidth: null,  //屏幕尺寸
      };
    },
    created() {
    },
    mounted () {
      this.screenWidth = document.body.clientWidth
      window.onresize = () => {   //屏幕尺寸变化就重新赋值
        return (() => {
          this.screenWidth = document.body.clientWidth
        })()
      }
    },
    watch: {
      screenWidth: {
        handler: function (val, oldVal) {
          // 如果大于 992 就显示 宽屏模式
          if(val >= 992 ){
            this.tabPosition = "left";
          }else{
            this.tabPosition = "top";
          }
        },
      },
    },
    methods: {
    },
  };
</script>


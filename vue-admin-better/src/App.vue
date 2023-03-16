<template>
  <div id="vue-admin-beautiful">
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App",
    mounted() {
      let _this = this;
      window.onresize = function () {
        // 定义窗口大小变更通知事件
        _this.$store.state.realTime.screenWidth =
          document.documentElement.clientWidth; //窗口宽度
        _this.$store.state.realTime.screenHeight =
          document.documentElement.clientHeight; //窗口高度
      };
    },
  };
</script>

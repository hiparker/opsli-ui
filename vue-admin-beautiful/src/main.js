import Vue from "vue";
import App from "./App";
import $perms from "@/utils/perms";
import $dict from "@/utils/dict";
import $publicKey from "@/utils/publicKey";
import store from "./store";
import router from "./router";
import "./plugins";
/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

// if (process.env.NODE_ENV === "production") {
//   const { mockXHR } = require("@/config/static");
//   mockXHR();
// }

Vue.config.productionTip = false;

// 添加全局权限验证
Vue.use($perms);
// 添加全局字典
Vue.use($dict);
// 添加全局公钥
Vue.use($publicKey);

new Vue({
  el: "#vue-admin-beautiful",
  router,
  store,
  render: (h) => h(App),
});

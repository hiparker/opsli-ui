import $store from "@/store";
import { isNull } from "@/utils/validate";

/**
 * 验证是否有按钮权限
 * @param perms
 * @returns {boolean}
 */
export default {
  install(Vue, options) {
    Vue.prototype.$perms = function (perms) {
      let permsArray = $store.getters["user/perms"];
      let ret = false;
      if (!isNull(permsArray)) {
        ret = permsArray.includes(perms);
      }
      return ret;
    };
  },
};

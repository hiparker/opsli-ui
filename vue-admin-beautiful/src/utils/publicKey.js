import { baseURL } from "@/config/settings";
import { getPublicKey } from "@/api/publicKey";
import { ajax } from "@/utils/request";




/**
 * 验证是否有按钮权限
 * @param perms
 * @returns {boolean}
 */
export default {
  install (Vue, options) {

    /**
     * @copyright parker
     * @description 获取公钥
     * @param typeCode
     * @returns [公钥]
     */
    Vue.prototype.$getPublicKey = function () {
      const params = getPublicKey();
      let ret = null;
      ajax({
        url: baseURL + params.url,
        method: params.method,
        async: false,
        success: function (res) {
          ret = JSON.parse(res);
        }
      })
      const {success, data} = ret;
      if (success) {
        return data;
      }
      return null;
    }

  }
}

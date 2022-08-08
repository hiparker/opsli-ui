import { baseURL } from "@/config/settings";
import { getPublicKey } from "@/api/publicKey";
import { isNull } from "@/utils/validate";
import { ajax } from "@/utils/request";
import { getCookies, setCookiesByExpiresTime } from "@/utils/cookies";

// Cookie Key
const COOKIE_KEY = "public_key";

/**
 * 验证是否有按钮权限
 * @param perms
 * @returns {boolean}
 */
export default {
  install(Vue, options) {
    /**
     * @copyright parker
     * @description 获取公钥
     * @returns [公钥]
     */
    Vue.prototype.$getPublicKey = function () {
      let publicKey = getCookies(COOKIE_KEY);
      // 如果公钥为空 则去接口查询
      if (isNull(publicKey)) {
        const params = getPublicKey();
        let ret = null;
        ajax({
          url: baseURL + params.url,
          method: params.method,
          async: false,
          success: function (res) {
            ret = JSON.parse(res);
          },
        });
        const { data } = ret;
        publicKey = data;

        // 存储 公钥到 Cookies 默认存储时长为5分钟
        setCookiesByExpiresTime(COOKIE_KEY, publicKey, 300);
      }

      return publicKey;
    };
  },
};

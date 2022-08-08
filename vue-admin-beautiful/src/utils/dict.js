import { storage, baseURL } from "@/config/settings";
import { isNull } from "@/utils/validate";
import cookie from "js-cookie";
import { getDictListByCodeParams } from "@/api/system/dict/dictManagement";
import { ajax } from "@/utils/request";

// 缓存前缀 方便统一删除处理
const cachePrefix = "opsli:dict";

/**
 * 获得前端本地缓存
 * @returns {null|any}
 */
function getCache() {
  let cache = null;
  if (storage) {
    if ("localStorage" === storage) {
      cache = localStorage.getItem(cachePrefix);
    } else if ("sessionStorage" === storage) {
      cache = sessionStorage.getItem(cachePrefix);
    } else if ("cookie" === storage) {
      cache = cookie.get(cachePrefix);
    } else {
      cache = localStorage.getItem(cachePrefix);
    }
  } else {
    cache = localStorage.getItem(cachePrefix);
  }
  return isNull(cache) ? null : JSON.parse(cache);
}

/**
 * 移除缓存
 * @returns {null|any}
 */
function removeCache() {
  if (storage) {
    if ("localStorage" === storage) {
      return localStorage.removeItem(cachePrefix);
    } else if ("sessionStorage" === storage) {
      return sessionStorage.clear();
    } else if ("cookie" === storage) {
      return cookie.remove(cachePrefix);
    } else {
      return localStorage.removeItem(cachePrefix);
    }
  } else {
    localStorage.removeItem(cachePrefix);
    cookie.remove(cachePrefix);
    sessionStorage.clear();
  }
}

/**
 * @copyright parker
 * @description 存储字典
 * @param typeCode
 * @param dictList
 * @returns {void|*}
 */
function setDictList(typeCode, dictList) {
  // 先去获得本地缓存
  let cache = getCache();
  if (isNull(cache)) {
    cache = {};
  }

  // 存放缓存
  cache[typeCode] = dictList;
  let json = JSON.stringify(cache);
  if (storage) {
    if ("localStorage" === storage) {
      return localStorage.setItem(cachePrefix, json);
    } else if ("sessionStorage" === storage) {
      return sessionStorage.setItem(cachePrefix, json);
    } else if ("cookie" === storage) {
      return cookie.set(typeCode, cachePrefix);
    } else {
      return localStorage.setItem(cachePrefix, json);
    }
  } else {
    return localStorage.setItem(cachePrefix, json);
  }
}

/**
 * 验证是否有按钮权限
 * @param perms
 * @returns {boolean}
 */
export default {
  install(Vue, options) {
    /**
     * @copyright parker
     * @description 获取字典
     * @param typeCode
     * @returns [字典数组]
     */
    Vue.prototype.$getDictList = function (typeCode) {
      let cache = getCache();
      if (cache == null) {
        cache = {};
      }

      let dictList = cache[typeCode];

      // 如果本地缓存没有 则去远端缓存中获取
      if (isNull(dictList) || dictList.length === 0) {
        const params = getDictListByCodeParams({ typeCode: typeCode });
        let ret = null;
        ajax({
          url: baseURL + params.url,
          method: params.method,
          async: false,
          data: params.params,
          success: function (res) {
            ret = JSON.parse(res);
          },
        });
        const { data } = ret;
        setDictList(typeCode, data);
        return isNull(data) ? [] : data;
      }
      return isNull(dictList) ? [] : dictList;
    };

    /**
     * @copyright parker
     * @description 获取字典 By Name
     * @param typeCode
     * @param dictName
     * @returns 字典值
     */
    Vue.prototype.$getDictValueByName = function (typeCode, dictName) {
      let dictList = Vue.prototype.$getDictList(typeCode);
      let dictValue = null;
      if (!isNull(dictList)) {
        for (let i = 0; i < dictList.length; i++) {
          if (dictList[i].dictName === dictName) {
            dictValue = dictList[i].dictValue;
            break;
          }
        }
      }
      return dictValue;
    };

    /**
     * @copyright parker
     * @description 获取字典 By Value
     * @param typeCode
     * @param dictValue
     * @returns 字典名称
     */
    Vue.prototype.$getDictNameByValue = function (typeCode, dictValue) {
      let dictList = Vue.prototype.$getDictList(typeCode);
      let dictName = null;
      if (!isNull(dictList)) {
        for (let i = 0; i < dictList.length; i++) {
          if (dictList[i].dictValue === dictValue) {
            dictName = dictList[i].dictName;
            break;
          }
        }
      }
      return dictName;
    };

    /**
     * @copyright parker
     * @description 清空缓存
     * @returns void
     */
    Vue.prototype.$clearDictList = function () {
      // 浏览器缓存空间有限，能节省一点是一点
      removeCache();
    };
  },
};

import Vue from "vue";
import axios from "axios";
import {
  baseURL,
  contentType,
  debounce,
  rowLockCode,
  invalidCode,
  noPermissionCode,
  requestTimeout,
  successCode,
  tokenName,
  loginInterception,
} from "@/config/settings";
import store from "@/store";
import qs from "qs";
import router from "@/router";
import { isArray } from "@/utils/validate";

let loadingInstance;

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 判断当前url是否需要加loading
 * @param {*} config
 * @returns
 */
const needLoading = (config) => {
  let status = false;
  debounce.forEach((item) => {
    if (Vue.prototype.$baseLodash.includes(config.url, item)) {
      status = true;
    }
  });
  return status;
};

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
const handleCode = (code, msg) => {
  switch (code) {
    case rowLockCode:
      // 触发行锁
      Vue.prototype.$baseConfirm(
        msg || `后端接口${code}异常，是否刷新页面重试？`,
        null,
        async () => {
          location.reload();
        }
      );
      break;
    case invalidCode:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, "error");
      store.dispatch("user/resetAccessToken").catch(() => {});
      if (loginInterception) {
        location.reload();
      }

      // 清除字典数据
      Vue.prototype.$clearDictList();
      break;
    case noPermissionCode:
      store.dispatch("user/resetAccessToken").catch(() => {});
      if (loginInterception) {
        location.reload();
      }

      // 清除字典数据
      Vue.prototype.$clearDictList();

      router.push({ path: "/401" }).catch(() => {});
      break;
    default:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, "error");
      break;
  }
};

const instance = axios.create({
  baseURL,
  timeout: requestTimeout,
  // 关闭 cookies
  withCredentials: false,
  headers: {
    "Content-Type": contentType,
  },
});

instance.interceptors.request.use(
  (config) => {
    if (store.getters["user/accessToken"]) {
      config.headers[tokenName] = store.getters["user/accessToken"];
    }

    //这里会过滤所有为空、0、false的key，如果不需要请自行注释
    // if (config.data){
    //   config.data = Vue.prototype.$baseLodash.pickBy(
    //     config.data,
    //     Vue.prototype.$baseLodash.identity
    //   );
    // }
    if (
      contentType === "application/x-www-form-urlencoded;charset=UTF-8" &&
      config.data
    ) {
      config.data = qs.stringify(config.data);
    }

    if (needLoading(config)) {
      loadingInstance = Vue.prototype.$baseLoading();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close();

    const { status, data, config } = response;
    const { code, msg } = data;
    // 操作正常Code数组
    const codeVerificationArray = isArray(successCode)
      ? [...successCode]
      : [...[successCode]];
    // 是否操作正常
    if (codeVerificationArray.includes(code)) {
      return data;
    } else {
      handleCode(code, msg);
      return Promise.reject(
        "OPSLI 请求异常拦截:" +
          JSON.stringify({ url: config.url, code, msg }) || "Error"
      );
    }
  },
  (error) => {
    if (loadingInstance) loadingInstance.close();
    const { response, message } = error;
    let msg = "";
    if (message === "Network Error") {
      msg = "后端接口连接异常";
    }
    if (message.includes("timeout")) {
      msg = "后端接口请求超时";
    }
    if (message.includes("Request failed with status code")) {
      const code = message.substr(message.length - 3);
      msg = "后端接口" + code + "异常";
    }
    Vue.prototype.$baseMessage(msg || "后端接口未知异常", "error");
    return Promise.reject(error);
  }
);

/**
 * 原始ajax 访问方式
 * @param obj
 */
export function ajax(obj) {
  //指定提交方式的默认值
  obj.type = obj.type || "get";
  //设置是否异步，默认为true(异步)
  if (obj.async === null || obj.async === undefined) {
    obj.async = true;
  }
  //设置数据的默认值
  obj.data = obj.data || null;
  let params = _params(obj.data);
  //在路径后面添加时间戳加随机数防止浏览器缓存。
  obj.url +=
    (obj.url.indexOf("?") > -1 ? "&" : "?") +
    "t=" +
    (new Date().getTime() + Math.random());
  if (obj.type.toLowerCase() === "get" && params.length > 0) {
    //将转换后的data.与url进行拼接。
    obj.url += "&" + params;
  }
  let xhr = new XMLHttpRequest();

  xhr.open(obj.type, obj.url, obj.async);

  // 设置 token
  if (store.getters["user/accessToken"]) {
    xhr.setRequestHeader(tokenName, store.getters["user/accessToken"]);
  }

  if (obj.type.toLowerCase() === "post") {
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
  } else xhr.send(null);
  if (obj.async) {
    //异步调用
    //监听响应状态。
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4)
        //响应状态为4，数据加载完毕。
        callback();
    };
  } //同步
  else callback();
  function callback() {
    if (xhr.status === 200) {
      obj.success(xhr.responseText);
    } else {
      obj.error(xhr.status);
    }
  }
  //将对象序列化，将对象拼接成url字符串
  function _params(data) {
    if (obj == null) return obj;
    let arr = [];
    for (let i in data) {
      arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(data[i]));
    }
    return arr.join("&");
  }
}

export default instance;

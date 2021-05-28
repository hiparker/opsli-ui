import { loadingText, messageDuration, title } from "@/config/settings";
import * as lodash from "lodash";
import { Loading, Message, MessageBox, Notification } from "element-ui";
import erd from "element-resize-detector";
import store from "@/store";
import { getAccessToken } from "@/utils/accessToken";

const accessToken = store.getters["user/accessToken"];
const layout = store.getters["settings/layout"];

const install = (Vue, opts = {}) => {
  /**
   * 监控组件
   * @param el el 对象
   * @param callback 回调函数
   */
  Vue.prototype.$erd = (el, callback) => {
    if (el === undefined || el === null) {
      return null;
    }

    // 创建实例带参数
    let erdUltraFast = erd({
      strategy: "scroll", //<- For ultra performance.
    });
    erdUltraFast.listenTo(el, callback);
    return erdUltraFast;
  };
  /* 全局accessToken */
  Vue.prototype.$baseAccessToken = () => {
    return accessToken || getAccessToken();
  };
  /* 全局标题 */
  Vue.prototype.$baseTitle = (() => {
    return title;
  })();
  /* 全局加载层 */
  Vue.prototype.$baseLoading = (index, text) => {
    let loading;
    if (!index) {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        background: "hsla(0,0%,100%,.8)",
      });
    } else {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: "vab-loading-type" + index,
        background: "hsla(0,0%,100%,.8)",
      });
    }
    return loading;
  };
  /* 局部加载层 */
  Vue.prototype.$basePartLoading = (el, index, text) => {
    if (el === undefined || el === null) {
      return null;
    }

    let loading;
    if (!index) {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        background: "hsla(0,0%,100%,.8)",
        target: el,
      });
    } else {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: "vab-loading-type" + index,
        background: "hsla(0,0%,100%,.8)",
        target: el,
      });
    }
    return loading;
  };
  /* 全局多彩加载层 */
  Vue.prototype.$baseColorfullLoading = (index, text) => {
    let loading;
    if (!index) {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: "dots-loader",
        background: "hsla(0,0%,100%,.8)",
      });
    } else {
      switch (index) {
        case 1:
          index = "dots";
          break;
        case 2:
          index = "gauge";
          break;
        case 3:
          index = "inner-circles";
          break;
        case 4:
          index = "plus";
          break;
      }
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: index + "-loader",
        background: "hsla(0,0%,100%,.8)",
      });
    }
    return loading;
  };
  /* 全局Message */
  Vue.prototype.$baseMessage = (message, type) => {
    Message({
      offset: 60,
      showClose: true,
      message: message,
      type: type,
      dangerouslyUseHTMLString: true,
      duration: messageDuration,
    });
  };

  /* 全局Alert */
  Vue.prototype.$baseAlert = (content, title, callback) => {
    MessageBox.alert(content, title || "温馨提示", {
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true,
      callback: (action) => {
        if (callback) {
          callback();
        }
      },
    });
  };

  /* 全局Confirm */
  Vue.prototype.$baseConfirm = (content, title, callback1, callback2) => {
    MessageBox.confirm(content, title || "温馨提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      type: "warning",
    })
      .then(() => {
        if (callback1) {
          callback1();
        }
      })
      .catch(() => {
        if (callback2) {
          callback2();
        }
      });
  };

  /**
   * 全局Prompt
   * @param options 参数
   *          content 内容
   *          title 标题
   *          inputValidator 验证器
   *          inputErrorMessage 错误信息
   *          callback1 回调1
   *          callback2 回调2
   */
  Vue.prototype.$basePrompt = (options) => {
    if (options) {
      MessageBox.prompt(options.content, options.title || "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValidator: options.inputValidator,
        inputErrorMessage: options.inputErrorMessage || "验证错误",
      })
        .then((value) => {
          if (options.callback1) {
            options.callback1(value);
          }
        })
        .catch((value) => {
          if (options.callback2) {
            options.callback2(value);
          }
        });
    }
  };

  /* 全局Notification */
  Vue.prototype.$baseNotify = (message, title, type, position) => {
    Notification({
      title: title,
      message: message,
      position: position || "top-right",
      type: type || "success",
      duration: messageDuration,
    });
  };

  /* 全局TableHeight */
  Vue.prototype.$baseTableHeight = (formType) => {
    let height = window.innerHeight;
    let paddingHeight = 400;
    const formHeight = 50;

    if (layout === "vertical") {
      paddingHeight = 340;
    }

    if ("number" == typeof formType) {
      height = height - paddingHeight - formHeight * formType;
    } else {
      height = height - paddingHeight;
    }
    return height;
  };

  /* 全局map图层 */
  Vue.prototype.$baseMap = () => {
    return new maptalks.Map("map", {
      center: [116.41348403785, 39.910843952376],
      zoom: 12,
      minZoom: 1,
      maxZoom: 19,
      spatialReference: {
        projection: "baidu",
      },
      attribution: {
        content: "&copy; vue-admin-beautiful",
      },
      baseLayer: new maptalks.TileLayer("base", {
        cssFilter: "sepia(100%) invert(90%)",
        urlTemplate:
          "http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1",
        subdomains: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        attribution:
          '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>',
      }),
    });
  };

  /* 全局lodash */
  Vue.prototype.$baseLodash = lodash;
  /* 全局事件总线 */
  Vue.prototype.$baseEventBus = new Vue();
  /* 元素变化函数 使用方式 v-resize="xxxx" */
  Vue.directive("resize", {
    bind(el, binding) {
      let width = "",
        height = "";
      function get() {
        const style = document.defaultView.getComputedStyle(el);
        if (width !== style.width || height !== style.height) {
          binding.value({ width, height });
        }
        width = style.width;
        height = style.height;
      }

      el.__vueReize__ = setInterval(get, 200);
    },
    unbind(el) {
      clearInterval(el.__vueReize__);
    },
  });
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default install;

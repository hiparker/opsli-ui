import { isNull } from "@/utils/validate";

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value];
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (("" + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, " ") +
      '"}'
  );
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data) {
  const parent = data.filter(
    (value) => value.parentId === "undefined" || value.parentId == null
  );
  const children = data.filter(
    (value) => value.parentId !== "undefined" && value.parentId != null
  );
  const translator = (parent, children) => {
    parent.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.parentId === parent.id) {
          const temp = JSON.parse(JSON.stringify(children));
          temp.splice(index, 1);
          translator([current], temp);
          typeof parent.children !== "undefined"
            ? parent.children.push(current)
            : (parent.children = [current]);
        }
      });
    });
  };
  translator(parent, children);
  return parent;
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data) {
  const result = [];
  data.forEach((item) => {
    const loop = (data) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
      });
      const child = data.children;
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });
  return result;
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time) {
  const date = new Date(time * 1000);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? "" + m : m;
  let d = date.getDate();
  d = d < 10 ? "" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return y + "年" + m + "月" + d + "日 " + h + ":" + minute + ":" + second; //组合
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time) {
  const date = new Date(time / 1);
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? "" + m : m;
  let d = date.getDate();
  d = d < 10 ? "" + d : d;
  let h = date.getHours();
  h = h < 10 ? "0" + h : h;
  let minute = date.getMinutes();
  let second = date.getSeconds();
  minute = minute < 10 ? "0" + minute : minute;
  second = second < 10 ? "0" + second : second;
  return y + "年" + m + "月" + d + "日 " + h + ":" + minute + ":" + second; //组合
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 获取随机id
 * @param length
 * @returns {string}
 */
export function uuid(length = 32) {
  const num = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length));
  }
  return str;
}

/**
 * 给URL追加参数
 * url
 * parameter 参数名
 * value  参数值
 */
export function urlAddArgs(urls, parameter, value) {
  let buf = "";
  if (!isNull(urls)) {
    buf = urls;
    if (urls.indexOf("?") > -1) {
      //已经有参数
      buf += "&";
    } else {
      buf += "?";
    }
    buf += parameter;
    buf += "=";
    buf += value;
  }
  return buf.toString();
}

/**
 * 给URL追加参数
 * url
 * parameter 参数名
 * value  参数值
 */
export function urlAddArgsByData(urls, data) {
  let buf = "";
  if (!isNull(urls)) {
    buf = urls;
    if (urls.indexOf("?") > -1) {
      //已经有参数
      buf += "&";
    } else {
      buf += "?";
    }
    buf += data;
  }
  return buf.toString();
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description m到n的随机数
 * @param m
 * @param n
 * @returns {number}
 */
export function random(m, n) {
  return Math.floor(Math.random() * (m - n) + n);
}

// 按钮倒计时锁定
export function vueButtonClickBan(el, second, isAddClass) {
  if (
    el !== null &&
    el !== undefined &&
    el.path !== null &&
    el.path !== undefined
  ) {
    let btnEl = null;
    for (let i = 0; i < el.path.length; i++) {
      if ("BUTTON" === el.path[i].nodeName) {
        btnEl = el.path[i];
        break;
      }
    }

    // 如果按钮对象不为空 则 进行处理
    if (btnEl !== null && btnEl !== undefined) {
      buttonClickBan(btnEl, second, isAddClass);
    }
  }
}

// 按钮倒计时锁定
export function buttonClickBan(el, second, isAddClass) {
  if (el === null || el === undefined) {
    return;
  }

  // 设置当前按钮禁用
  if (isAddClass === undefined || isAddClass) {
    el.classList.add("is-disabled");
  }
  el.style["pointer-events"] = "none";

  // 获得当前按钮文字
  let textSpan = el.querySelector("span");
  const btnText = textSpan.innerText;

  // 设置按钮倒计时
  textSpan.innerText = btnText + " (" + second + ")";

  for (let i = second; i > 0; i--) {
    setTimeout(
      (function (i) {
        return function () {
          // 设置按钮倒计时
          textSpan.innerText = btnText + " (" + (second - i) + ")";
          if (i === second) {
            // 解除按钮
            if (isAddClass === undefined || isAddClass) {
              el.classList.remove("is-disabled");
            }
            el.style["pointer-events"] = "auto";
            // 设置按钮倒计时
            textSpan.innerText = btnText;
          }
        };
      })(i),
      i * 1000
    );
  }
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description addEventListener
 * @type {function(...[*]=)}
 */
export const on = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event && handler) {
      element.addEventListener(event, handler, useCapture);
    }
  };
})();

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description removeEventListener
 * @type {function(...[*]=)}
 */
export const off = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event) {
      element.removeEventListener(event, handler, useCapture);
    }
  };
})();

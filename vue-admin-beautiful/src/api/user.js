import request from "@/utils/request";
import { urlAddArgsByData } from "@/utils";
const { baseURL } = require("@/config/settings");
import { encryptedData } from "@/utils/encrypt";
import { loginRSA, tokenName } from "@/config/settings";

export async function login(data) {
  if (loginRSA) {
    // 加密数据
    let encrypted = await encryptedData(data);
    data = {
      encryptData: encrypted,
    };
  }
  return request({
    url: "/system/login",
    method: "post",
    data,
  });
}

export function getSlipCount(data) {
  return request({
    url: "/system/slipCount",
    method: "get",
    params: data,
  });
}

export function getUserInfo(accessToken) {
  return request({
    url: "/api/v1/system/user/getInfo",
    method: "get",
    headers: {
      [tokenName]: accessToken,
    },
  });
}

export function getUserOrg(accessToken) {
  return request({
    url: "/api/v1/system/user/getOrg",
    method: "get",
    headers: {
      [tokenName]: accessToken,
    },
  });
}

export function logout() {
  return request({
    url: "/system/logout",
    method: "post",
  });
}

export function register() {
  return request({
    url: "/register",
    method: "post",
  });
}

export function captcha(uuid) {
  // 请求地址
  let url = "/captcha";
  let data = {
    uuid: uuid,
    timestamp: new Date().getTime(),
  };

  // 转换参数
  let params = Object.keys(data)
    .map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    })
    .join("&");

  return baseURL + urlAddArgsByData(url, params);
}

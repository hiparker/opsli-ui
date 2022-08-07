import request from "@/utils/request";
import { urlAddArgsByData } from "@/utils";
const { baseURL } = require("@/config/settings");
import { encryptedRsa } from "@/utils/crypto/encrypt-rsa";
import { encryptRSA, tokenName } from "@/config/settings";
import Vue from "vue";

export function sendSelfEmailCode(type) {
  return request({
    url: "/api/v1/operation/auth/email/create-code/" + type,
    method: "post",
  });
}

export function checkSelfEmailCode(type, code) {
  return request({
    url: "/api/v1/operation/auth/email/check-code/" + type + "/" + code,
    method: "post",
  });
}

export function sendEmailCode(data) {
  if (encryptRSA) {
    // 获得公钥
    let publicKey = Vue.prototype.$getPublicKey();
    // 加密数据
    let encrypted = encryptedRsa(data, publicKey);
    data = {
      encryptData: encrypted,
    };
  }
  return request({
    url: "/api/v1/common/email/create-code",
    method: "post",
    data,
  });
}

export function sendSelfMobileCode(type) {
  return request({
    url: "/api/v1/operation/auth/mobile/create-code/" + type,
    method: "post",
  });
}

export function checkSelfMobileCode(type, code) {
  return request({
    url: "/api/v1/operation/auth/mobile/check-code/" + type + "/" + code,
    method: "post",
  });
}

export function sendMobileCode(data) {
  if (encryptRSA) {
    // 获得公钥
    let publicKey = Vue.prototype.$getPublicKey();
    // 加密数据
    let encrypted = encryptedRsa(data, publicKey);
    data = {
      encryptData: encrypted,
    };
  }
  return request({
    url: "/api/v1/common/mobile/create-code",
    method: "post",
    data,
  });
}

export async function loginByCode(data) {
  if (encryptRSA) {
    // 获得公钥
    let publicKey = Vue.prototype.$getPublicKey();
    // 加密数据
    let encrypted = encryptedRsa(data, publicKey);
    data = {
      encryptData: encrypted,
    };
  }
  return request({
    url: "/system/login-by-code",
    method: "post",
    data,
  });
}

export async function login(data) {
  if (encryptRSA) {
    // 获得公钥
    let publicKey = Vue.prototype.$getPublicKey();
    // 加密数据
    let encrypted = encryptedRsa(data, publicKey);
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

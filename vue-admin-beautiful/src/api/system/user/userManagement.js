import request from "@/utils/request";
import { encryptRSA } from "@/config/settings";
import Vue from "vue";
import { encryptedRsa } from "@/utils/crypto/encrypt-rsa";

export function getUserInfo(data) {
  return request({
    url: "/api/v1/system/user/getInfoById",
    method: "get",
    params: data,
  });
}

export function getList(data) {
  return request({
    url: "/api/v1/system/user/findPage",
    method: "get",
    params: data,
  });
}

export function getListByTenant(data) {
  return request({
    url: "/api/v1/system/user/findPageByTenant",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/user/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/user/update",
    method: "post",
    data,
  });
}

export function doUpdateSelf(data) {
  return request({
    url: "/api/v1/system/user/updateSelf",
    method: "post",
    data,
  });
}

export function doDelete(data) {
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
    url: "/api/v1/system/user/del",
    method: "post",
    data,
  });
}

export function doDeleteAll(data) {
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
    url: "/api/v1/system/user/delAll",
    method: "post",
    data,
  });
}

export function getRoleIdsByUserId(data) {
  return request({
    url: "/api/v1/system/user/getRoleIdsByUserId",
    method: "get",
    params: data,
  });
}

export function doGetRoles(data) {
  return request({
    url: "/api/v1/system/user/roles/getRoles",
    method: "get",
    params: data,
  });
}

export function doSetRoles(data) {
  return request({
    url: "/api/v1/system/user/roles/setRoles",
    method: "post",
    data,
  });
}

export function getOrgByUserId(data) {
  return request({
    url: "/api/v1/system/user/getOrgByUserId",
    method: "get",
    params: data,
  });
}

export function doSetOrg(data) {
  return request({
    url: "/api/v1/system/user/org/setOrg",
    method: "post",
    data,
  });
}

export function doUpdatePasswordById(data) {
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
    url: "/api/v1/system/user/updatePasswordById",
    method: "post",
    data,
  });
}

export function doResetPasswordById(data) {
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
    url: "/api/v1/system/user/resetPasswordById",
    method: "post",
    data,
  });
}

export function doEnableAccount(data) {
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
    url: "/api/v1/system/user/enableAccount",
    method: "post",
    data,
  });
}

export function doUpdateAvatar(data) {
  return request({
    url: "/api/v1/system/user/updateAvatar",
    method: "post",
    data,
  });
}

export function doUpdatePassword(data) {
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
    url: "/api/v1/system/user/updatePassword",
    method: "post",
    data,
  });
}

export function doUpdatePasswordByForget(data) {
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
    url: "/api/v1/system/user/updatePasswordByForget",
    method: "post",
    data,
  });
}

export function doUpdateEmail(data) {
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
    url: "/api/v1/system/user/updateEmail",
    method: "post",
    data,
  });
}

export function doUpdateMobile(data) {
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
    url: "/api/v1/system/user/updateMobile",
    method: "post",
    data,
  });
}

/**
 * 切换运营商
 * @param params
 * @returns {*}
 */
export function switchTenant(params) {
  return request({
    url: "/api/v1/system/user/switchTenant",
    method: "post",
    params,
  });
}

/**
 * 切换切换回自己账户
 * @param params
 * @returns {*}
 */
export function switchOneself(params) {
  return request({
    url: "/api/v1/system/user/switchOneself",
    method: "post",
  });
}

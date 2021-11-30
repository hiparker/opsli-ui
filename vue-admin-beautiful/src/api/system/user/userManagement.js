import request from "@/utils/request";

export function getUserInfo(data) {
  return request({
    url: "/api/system/user/v1/getInfoById",
    method: "get",
    params: data,
  });
}

export function getList(data) {
  return request({
    url: "/api/system/user/v1/findPage",
    method: "get",
    params: data,
  });
}

export function getListByTenant(data) {
  return request({
    url: "/api/system/user/v1/findPageByTenant",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/system/user/v1/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/system/user/v1/update",
    method: "post",
    data,
  });
}

export function doUpdateSelf(data) {
  return request({
    url: "/api/system/user/v1/updateSelf",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/system/user/v1/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/system/user/v1/delAll",
    method: "post",
    params: data,
  });
}

export function getRoleIdsByUserId(data) {
  return request({
    url: "/api/system/user/v1/getRoleIdsByUserId",
    method: "get",
    params: data,
  });
}

export function doGetRoles(data) {
  return request({
    url: "/api/system/user/roles/v1/getRoles",
    method: "get",
    params: data,
  });
}

export function doSetRoles(data) {
  return request({
    url: "/api/system/user/roles/v1/setRoles",
    method: "post",
    data,
  });
}

export function getOrgByUserId(data) {
  return request({
    url: "/api/system/user/v1/getOrgByUserId",
    method: "get",
    params: data,
  });
}

export function doSetOrg(data) {
  return request({
    url: "/api/system/user/org/v1/setOrg",
    method: "post",
    data,
  });
}

export function doUpdatePasswordById(data) {
  return request({
    url: "/api/system/user/v1/updatePasswordById",
    method: "post",
    data,
  });
}

export function doResetPasswordById(data) {
  return request({
    url: "/api/system/user/v1/resetPasswordById",
    method: "post",
    params: data,
  });
}

export function doEnableAccount(data) {
  return request({
    url: "/api/system/user/v1/enableAccount",
    method: "post",
    params: data,
  });
}

export function doUpdatePassword(data) {
  return request({
    url: "/api/system/user/v1/updatePassword",
    method: "post",
    data,
  });
}

export function doUpdateAvatar(data) {
  return request({
    url: "/api/system/user/v1/updateAvatar",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
    url: "/api/system/user/v1/switchTenant",
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
    url: "/api/system/user/v1/switchOneself",
    method: "post",
  });
}

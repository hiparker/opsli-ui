import request from "@/utils/request";
import { tokenName } from "@/config/settings";

export function getUserInfo(data) {
  return request({
    url: "/api/v1/sys/user/getInfoById",
    method: "get",
    params: data,
  });
}

export function getList(data) {
  return request({
    url: "/api/v1/sys/user/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/sys/user/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/sys/user/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/sys/user/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/sys/user/delAll",
    method: "post",
    params: data,
  });
}

export function getRoleIdsByUserId(data) {
  return request({
    url: "/api/v1/sys/user/getRoleIdsByUserId",
    method: "get",
    params: data,
  });
}

export function doSetRoles(data) {
  return request({
    url: "/api/v1/sys/user/roles/setRoles",
    method: "post",
    data,
  });
}

export function getOrgByUserId(data) {
  return request({
    url: "/api/v1/sys/user/getOrgByUserId",
    method: "get",
    params: data,
  });
}

export function doSetOrg(data) {
  return request({
    url: "/api/v1/sys/user/org/setOrg",
    method: "post",
    data,
  });
}

export function doUpdatePasswordById(data) {
  return request({
    url: "/api/v1/sys/user/updatePasswordById",
    method: "post",
    data,
  });
}

export function doResetPasswordById(data) {
  return request({
    url: "/api/v1/sys/user/resetPasswordById",
    method: "post",
    params: data,
  });
}

export function doEnableAccount(data) {
  return request({
    url: "/api/v1/sys/user/enableAccount",
    method: "post",
    params: data,
  });
}

export function doUpdatePassword(data) {
  return request({
    url: "/api/v1/sys/user/updatePassword",
    method: "post",
    data,
  });
}

export function doUpdateAvatar(data) {
  return request({
    url: "/api/v1/sys/user/updateAvatar",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}

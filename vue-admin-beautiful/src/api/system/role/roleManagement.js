import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/system/role/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/role/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/role/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/role/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/system/role/delAll",
    method: "post",
    params: data,
  });
}

export function doGetPerms(data) {
  return request({
    url: "/api/v1/system/role/perms/getPerms",
    method: "get",
    params: data,
  });
}

export function doSetPerms(data) {
  return request({
    url: "/api/v1/system/role/perms/setPerms",
    method: "post",
    data,
  });
}

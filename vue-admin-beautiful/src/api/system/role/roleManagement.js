import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/system/role/v1/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/system/role/v1/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/system/role/v1/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/system/role/v1/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/system/role/v1/delAll",
    method: "post",
    params: data,
  });
}

export function doGetPerms(data) {
  return request({
    url: "/api/system/role/perms/v1/getPerms",
    method: "get",
    params: data,
  });
}

export function doSetPerms(data) {
  return request({
    url: "/api/system/role/perms/v1/setPerms",
    method: "post",
    data,
  });
}

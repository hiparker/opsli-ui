import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/sys/role/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/sys/role/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/sys/role/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/sys/role/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/sys/role/delAll",
    method: "post",
    params: data,
  });
}

export function doGetPerms(data) {
  return request({
    url: "/api/v1/sys/role/perms/getPerms",
    method: "get",
    params: data,
  });
}

export function doSetPerms(data) {
  return request({
    url: "/api/v1/sys/role/perms/setPerms",
    method: "post",
    data,
  });
}

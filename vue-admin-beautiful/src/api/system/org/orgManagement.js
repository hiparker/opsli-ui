import request from "@/utils/request";

export function get(data) {
  return request({
    url: "/api/v1/system/org/get",
    method: "get",
    params: data,
  });
}

export function getTreeByDefWithUserToLike(data) {
  return request({
    url: "/api/v1/system/org/findTreeByDefWithUserToLike",
    method: "get",
    params: data,
  });
}

export function getTreeLazy(data) {
  return request({
    url: "/api/v1/system/org/findTreeLazy",
    method: "get",
    params: data,
  });
}

export function getTreeByDef(data) {
  return request({
    url: "/api/v1/system/org/findTreeByDef",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/org/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/org/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/org/del",
    method: "post",
    params: data,
  });
}

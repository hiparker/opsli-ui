import request from "@/utils/request";

export function get(data) {
  return request({
    url: "/api/system/org/v1/get",
    method: "get",
    params: data,
  });
}

export function getTreeByDefWithUserToLike(data) {
  return request({
    url: "/api/system/org/v1/findTreeByDefWithUserToLike",
    method: "get",
    params: data,
  });
}

export function getTreeLazy(data) {
  return request({
    url: "/api/system/org/v1/findTreeLazy",
    method: "get",
    params: data,
  });
}

export function getTreeByDef(data) {
  return request({
    url: "/api/system/org/v1/findTreeByDef",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/system/org/v1/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/system/org/v1/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/system/org/v1/del",
    method: "post",
    params: data,
  });
}

import request from "@/utils/request";

export function getTreeLazyByUser(data) {
  return request({
    url: "/api/v1/system/org/findTreeLazyByUser",
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

export function getGridTree(data) {
  return request({
    url: "/api/v1/system/org/findGridTree",
    method: "get",
    params: data,
  });
}

export function getTree(data) {
  return request({
    url: "/api/v1/system/org/findTree",
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

import request from "@/utils/request";

export function get(data) {
  return request({
    url: "/api/v1/system/menu/get",
    method: "get",
    params: data,
  });
}

export function getList(data) {
  return request({
    url: "/api/v1/system/menu/findList",
    method: "get",
    data,
  });
}

export function getTree(data) {
  return request({
    url: "/api/v1/system/menu/findMenuTreePage",
    method: "get",
    params: data,
  });
}

export function getTreeChooseLazy(data) {
  return request({
    url: "/api/v1/system/menu/findMenuTreeByLazy",
    method: "get",
    params: data,
  });
}

export function getTreeLazy(data) {
  return request({
    url: "/api/v1/system/menu/findMenuTreePageByLazy",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/menu/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/menu/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/menu/del",
    method: "post",
    params: data,
  });
}

export function getMenuAndPermsTree(data) {
  return request({
    url: "/api/v1/system/menu/getMenuAndPermsTree",
    method: "get",
    params: data,
  });
}

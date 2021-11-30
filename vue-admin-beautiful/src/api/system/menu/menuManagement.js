import request from "@/utils/request";

export function get(data) {
  return request({
    url: "/api/system/menu/v1/get",
    method: "get",
    params: data,
  });
}

export function getList(data) {
  return request({
    url: "/api/system/menu/v1/findList",
    method: "get",
    data,
  });
}

export function getTree(data) {
  return request({
    url: "/api/system/menu/v1/findMenuTreePage",
    method: "get",
    params: data,
  });
}

export function getTreeChooseLazy(data) {
  return request({
    url: "/api/system/menu/v1/findMenuTreeByLazy",
    method: "get",
    params: data,
  });
}

export function getTreeLazy(data) {
  return request({
    url: "/api/system/menu/v1/findMenuTreePageByLazy",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/system/menu/v1/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/system/menu/v1/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/system/menu/v1/del",
    method: "post",
    params: data,
  });
}

export function getMenuAndPermsTree(data) {
  return request({
    url: "/api/system/menu/v1/getMenuAndPermsTree",
    method: "get",
    params: data,
  });
}

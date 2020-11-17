import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/creater/table/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/creater/table/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/creater/table/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/creater/table/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/creater/table/delAll",
    method: "post",
    params: data,
  });
}

// ================================

export function getSubList(data) {
  return request({
    url: "/api/v1/creater/table/get",
    method: "get",
    params: data,
  });
}

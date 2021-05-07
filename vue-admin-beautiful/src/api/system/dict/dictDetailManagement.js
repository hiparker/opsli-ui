import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/system/dict/detail/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/dict/detail/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/dict/detail/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/dict/detail/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/system/dict/detail/delAll",
    method: "post",
    params: data,
  });
}

import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/test/findPage",
    method: "get",
    params: data,
  });
}


export function doInsert(data) {
  return request({
    url: "/api/v1/test/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/test/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/test/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/test/delAll",
    method: "post",
    params: data,
  });
}


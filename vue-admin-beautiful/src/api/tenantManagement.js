import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/sys/tenant/findPage",
    method: "get",
    params: data,
  });
}


export function doInsert(data) {
  return request({
    url: "/api/v1/sys/tenant/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/sys/tenant/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/sys/tenant/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/sys/tenant/delAll",
    method: "post",
    params: data,
  });
}


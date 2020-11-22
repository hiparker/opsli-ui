import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/gentest/user/findPage",
    method: "get",
    params: data,
  });
}


export function doInsert(data) {
  return request({
    url: "/api/v1/gentest/user/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/gentest/user/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/gentest/user/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/gentest/user/delAll",
    method: "post",
    params: data,
  });
}


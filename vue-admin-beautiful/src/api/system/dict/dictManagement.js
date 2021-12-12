import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/system/dict/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/dict/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/dict/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/dict/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/system/dict/delAll",
    method: "post",
    params: data,
  });
}

export function getDictListByCodeParams(data) {
  return {
    url: "/api/v1/system/dict/getDictListByCode",
    method: "get",
    params: data,
  };
}

export function getDictListByCode(data) {
  return request({
    url: "/api/v1/system/dict/getDictListByCode",
    method: "get",
    params: data,
  });
}

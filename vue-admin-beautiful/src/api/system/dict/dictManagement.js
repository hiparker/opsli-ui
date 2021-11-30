import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/system/dict/v1/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/system/dict/v1/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/system/dict/v1/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/system/dict/v1/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/system/dict/v1/delAll",
    method: "post",
    params: data,
  });
}

export function getDictListByCodeParams(data) {
  return {
    url: "/api/system/dict/v1/getDictListByCode",
    method: "get",
    params: data,
  };
}

export function getDictListByCode(data) {
  return request({
    url: "/api/system/dict/v1/getDictListByCode",
    method: "get",
    params: data,
  });
}

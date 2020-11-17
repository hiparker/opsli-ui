import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/sys/dict/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/sys/dict/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/sys/dict/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/sys/dict/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/sys/dict/delAll",
    method: "post",
    params: data,
  });
}

export function getDictListByCodeParams(data) {
  return{
    url: "/api/v1/sys/dict/getDictListByCode",
    method: "get",
    params: data,
  };
}

export function getDictListByCode(data) {
  return request({
    url: "/api/v1/sys/dict/getDictListByCode",
    method: "get",
    params: data,
  });
}

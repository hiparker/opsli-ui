import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/system/tenant/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/tenant/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/tenant/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/tenant/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/system/tenant/delAll",
    method: "post",
    params: data,
  });
}

export function doEnableTenant(data) {
  return request({
    url: "/api/v1/system/tenant/enableTenant",
    method: "post",
    params: data,
  });
}

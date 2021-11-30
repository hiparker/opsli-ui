import request from "@/utils/request";

export function getTree(data) {
  return request({
    url: "/api/system/area/v1/findTree",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/system/area/v1/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/system/area/v1/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/system/area/v1/del",
    method: "post",
    params: data,
  });
}

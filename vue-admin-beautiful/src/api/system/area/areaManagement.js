import request from "@/utils/request";

export function getTree(data) {
  return request({
    url: "/api/v1/system/area/findTree",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/system/area/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/system/area/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/area/del",
    method: "post",
    params: data,
  });
}

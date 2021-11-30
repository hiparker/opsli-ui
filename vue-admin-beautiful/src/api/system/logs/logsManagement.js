import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/system/logs/v1/findPage",
    method: "get",
    params: data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/system/logs/v1/emptyByOneMonth",
    method: "post",
  });
}

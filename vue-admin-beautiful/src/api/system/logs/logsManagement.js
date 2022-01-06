import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/system/logs/findPage",
    method: "get",
    params: data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/system/logs/emptyByOneMonth",
    method: "post",
  });
}

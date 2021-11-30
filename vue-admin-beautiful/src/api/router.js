import request from "@/utils/request";

export function getRouterList(data) {
  return request({
    url: "/api/system/menu/v1/findMenuTree",
    method: "post",
    data,
  });
}

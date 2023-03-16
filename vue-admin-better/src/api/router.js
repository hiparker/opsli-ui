import request from "@/utils/request";

export function getRouterList(data) {
  return request({
    url: "/api/v1/system/menu/findMenuTree",
    method: "post",
    data,
  });
}

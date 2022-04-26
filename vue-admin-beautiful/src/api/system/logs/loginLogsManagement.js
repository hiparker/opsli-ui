import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/system/login-logs/findPage",
    method: "get",
    params: data,
  });
}


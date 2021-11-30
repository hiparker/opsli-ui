/**
 * 系统监控
 *
 * @作者 薛佳琪
 * @创建时间 2020/11/27 14:37
 */

import request from "@/utils/request";

export function getSystemInfo(data) {
  return request({
    url: "/api/system/monitor/v1/getSystemInfo",
    method: "get",
    params: data,
  });
}
export function getCpuInfo(data) {
  return request({
    url: "/api/system/monitor/v1/getCpuInfo",
    method: "get",
    params: data,
  });
}
export function getMemInfo(data) {
  return request({
    url: "/api/system/monitor/v1/getMemInfo",
    method: "get",
    params: data,
  });
}
export function getJVMInfo(data) {
  return request({
    url: "/api/system/monitor/v1/getJVMInfo",
    method: "get",
    params: data,
  });
}

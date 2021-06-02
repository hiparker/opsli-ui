import request from "@/utils/request";
import { downloadFileByData } from "@/utils/download";

export function getDetailListByParentId(parentId) {
  return request({
    url: "/api/v1/generator/template/detail/findListByParentId",
    method: "get",
    params: {
      parentId: parentId,
    },
  });
}

export function getList(data) {
  return request({
    url: "/api/v1/generator/template/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/generator/template/insertAndDetail",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/generator/template/updateAndDetail",
    method: "post",
    data,
  });
}

export function doCopy(data) {
  return request({
    url: "/api/v1/generator/template/copy",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/generator/template/del",
    method: "post",
    params: data,
  });
}

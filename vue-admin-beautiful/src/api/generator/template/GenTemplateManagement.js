import request from "@/utils/request";
import { downloadFileByData } from "@/utils/download";

export function getDetailListByParentId(parentId) {
  return request({
    url: "/api/generator/template/detail/v1/findListByParentId",
    method: "get",
    params: {
      parentId: parentId,
    },
  });
}

export function getList(data) {
  return request({
    url: "/api/generator/template/v1/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/generator/template/v1/insertAndDetail",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/generator/template/v1/updateAndDetail",
    method: "post",
    data,
  });
}

export function doCopy(data) {
  return request({
    url: "/api/generator/template/v1/copy",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/generator/template/v1/del",
    method: "post",
    params: data,
  });
}

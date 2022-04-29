import request from "@/utils/request";
import { downloadFileByData } from "@/utils/download";

export function getList(data) {
  return request({
    url: "/api/v1/generator/table/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/generator/table/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/generator/table/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/generator/table/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/generator/table/delAll",
    method: "post",
    params: data,
  });
}

// ================================

export function getSubList(data) {
  return request({
    url: "/api/v1/generator/table/get",
    method: "get",
    params: data,
  });
}

export function doSync(data) {
  return request({
    url: "/api/v1/generator/table/sync",
    method: "post",
    params: data,
  });
}

export function getTables() {
  return request({
    url: "/api/v1/generator/table/getTables",
    method: "get",
  });
}

export function doImportTables(data) {
  return request({
    url: "/api/v1/generator/table/importTables",
    method: "post",
    params: data,
  });
}

// ===========================================

export function getGenLogs(data) {
  return request({
    url: "/api/v1/generator/logs/getByTableId",
    method: "get",
    params: data,
  });
}

/**
 * 生成代码
 * @param data
 * @returns file
 */
export function doCreate(data) {
  let requestURL = "/api/v1/generator/logs/create";
  // 下载文件
  downloadFileByData(requestURL, data);
}

export function doCreateMenu(data) {
  return request({
    url: "/api/v1/generator/logs/createMenu",
    method: "post",
    params: data,
  });
}

export function doCreateJson(data) {
  return {
    url: "/api/v1/generator/logs/create",
    method: "get",
    params: data,
  };
}

export function getFieldTypes() {
  return request({
    url: "/api/v1/generator/table/getFieldTypes",
    method: "get",
  });
}

export function getJavaFieldTypes() {
  return request({
    url: "/api/v1/generator/table/getJavaFieldTypes",
    method: "get",
  });
}

export function getJavaFieldTypesBySafety() {
  return request({
    url: "/api/v1/generator/table/getJavaFieldTypesBySafety",
    method: "get",
  });
}

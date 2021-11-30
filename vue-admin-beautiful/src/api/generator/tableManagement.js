import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/generator/table/v1/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/generator/table/v1/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/generator/table/v1/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/generator/table/v1/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/generator/table/v1/delAll",
    method: "post",
    params: data,
  });
}

// ================================

export function getSubList(data) {
  return request({
    url: "/api/generator/table/v1/get",
    method: "get",
    params: data,
  });
}

export function doSync(data) {
  return request({
    url: "/api/generator/table/v1/sync",
    method: "post",
    params: data,
  });
}

export function getTables() {
  return request({
    url: "/api/generator/table/v1/getTables",
    method: "get",
  });
}

export function doImportTables(data) {
  return request({
    url: "/api/generator/table/v1/importTables",
    method: "post",
    params: data,
  });
}

// ===========================================

export function getGenLogs(data) {
  return request({
    url: "/api/generator/logs/v1/getByTableId",
    method: "get",
    params: data,
  });
}

export function doCreate(data) {
  return request({
    url: "/api/generator/logs/v1/create",
    method: "post",
    // 重要
    responseType: "blob",
    data,
  });
}

export function doCreateMenu(data) {
  return request({
    url: "/api/generator/logs/v1/createMenu",
    method: "post",
    params: data,
  });
}

export function doCreateJson(data) {
  return {
    url: "/api/generator/logs/v1/create",
    method: "get",
    params: data,
  };
}

export function getFieldTypes() {
  return request({
    url: "/api/generator/table/v1/getFieldTypes",
    method: "get",
  });
}

export function getJavaFieldTypes() {
  return request({
    url: "/api/generator/table/v1/getJavaFieldTypes",
    method: "get",
  });
}

export function getJavaFieldTypesBySafety() {
  return request({
    url: "/api/generator/table/v1/getJavaFieldTypesBySafety",
    method: "get",
  });
}

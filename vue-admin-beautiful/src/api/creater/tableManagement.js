import request from "@/utils/request";

export function getList(data) {
  return request({
    url: "/api/v1/creater/table/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/creater/table/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/creater/table/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/creater/table/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/creater/table/delAll",
    method: "post",
    params: data,
  });
}

// ================================

export function getSubList(data) {
  return request({
    url: "/api/v1/creater/table/get",
    method: "get",
    params: data,
  });
}

export function doSync(data) {
  return request({
    url: "/api/v1/creater/table/sync",
    method: "post",
    params: data,
  });
}

export function getTables() {
  return request({
    url: "/api/v1/creater/table/getTables",
    method: "get"
  });
}

export function doImportTables(data) {
  return request({
    url: "/api/v1/creater/table/importTables",
    method: "post",
    params: data,
  });
}

// ===========================================

export function getCreaterLogs(data) {
  return request({
    url: "/api/v1/creater/logs/getByTableId",
    method: "get",
    params: data,
  });
}

export function doCreate(data) {
  return request({
    url: "/api/v1/creater/logs/create",
    method: "post",
    // 重要
    responseType: 'blob',
    data,
  });
}

export function doCreateJson(data) {
  return {
    url: "/api/v1/creater/logs/create",
    method: "get",
    params: data,
  };
}

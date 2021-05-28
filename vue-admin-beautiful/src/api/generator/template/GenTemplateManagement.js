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

export function doDelete(data) {
  return request({
    url: "/api/v1/generator/template/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/generator/template/delAll",
    method: "post",
    params: data,
  });
}

/**
 * 导出Excel 目前只支持一层参数传递
 * @param data
 * @returns file
 */
export function doExportExcel(data) {
  let requestURL = "/api/v1/generator/template/exportExcel";

  // 下载文件
  downloadFileByData(requestURL, data);
}

/**
 * 下载模版
 * @returns file
 */
export function doDownloadTemplate() {
  let data = {};

  let requestURL = "/api/v1/generator/template/importExcel/template";

  // 下载文件
  downloadFileByData(requestURL, data);
}

/**
 * 导入Excel
 * @returns file
 */
export function doImportExcel(data) {
  return request({
    url: "/api/v1/generator/template/importExcel",
    method: "post",
    // 最长超时时间 3 分钟
    timeout: 180000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}

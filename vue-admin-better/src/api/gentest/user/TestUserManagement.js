import request from "@/utils/request";
import { downloadFileByData } from "@/utils/download";

export function getList(data) {
  return request({
    url: "/api/v1/gentest/user/findPage",
    method: "get",
    params: data,
  });
}

export function doInsert(data) {
  return request({
    url: "/api/v1/gentest/user/insert",
    method: "post",
    data,
  });
}

export function doUpdate(data) {
  return request({
    url: "/api/v1/gentest/user/update",
    method: "post",
    data,
  });
}

export function doDelete(data) {
  return request({
    url: "/api/v1/gentest/user/del",
    method: "post",
    params: data,
  });
}

export function doDeleteAll(data) {
  return request({
    url: "/api/v1/gentest/user/delAll",
    method: "post",
    params: data,
  });
}

/**
 * 导出Excel 目前只支持一层参数传递
 * @param params 参数
 * @returns file
 */
export async function doExportExcel(params) {
  // 认证
  const { data } = await request({
    url: "/api/v1/gentest/user/excel/auth/export",
    method: "get",
    params: params,
  });

  if (data) {
    // 下载文件
    downloadFileByData("/api/v1/gentest/user/excel/export/" + data, params);
  }
}

/**
 * 下载模版
 * @returns file
 */
export async function doDownloadTemplate() {
  // 认证
  const { data } = await request({
    url: "/api/v1/gentest/user/excel/auth/import-template-export",
    method: "get",
  });

  if (data) {
    // 下载文件
    downloadFileByData("/api/v1/gentest/user/excel/export/" + data, {});
  }
}

/**
 * 导入Excel
 * @returns file
 */
export function doImportExcel(data) {
  return request({
    url: "/api/v1/gentest/user/importExcel",
    method: "post",
    // 最长超时时间 3分钟
    timeout: 180000,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}

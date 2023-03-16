import request from "@/utils/request";
import { downloadFileByData } from "@/utils/download";

export function getList(data) {
  return request({
    url: "/api/v1/system/op-logs/findPage",
    method: "get",
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
    url: "/api/v1/system/op-logs/excel/auth/export",
    method: "get",
    params: params,
  });

  if (data) {
    // 下载文件
    downloadFileByData("/api/v1/system/op-logs/excel/export/" + data, params);
  }
}

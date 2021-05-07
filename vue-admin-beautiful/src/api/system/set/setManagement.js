import request from "@/utils/request";

export function getAllOptions(data) {
  return request({
    url: "/api/v1/system/options/findAllOptions",
    method: "get",
    params: data,
  });
}

export function doUpdateOptions(data) {
  return request({
    url: "/api/v1/system/options/updateOptions",
    method: "post",
    data,
  });
}

export function doTestSend(data) {
  return request({
    url: "/api/v1/tools/email/testSend",
    method: "post",
    data,
  });
}

// ===========================

/**
 * 创建 加解密公私钥
 * @param type
 * @returns {AxiosPromise}
 */
export function doCreateCrypto(type) {
  return request({
    url: "/api/v1/system/options/createCrypto",
    method: "post",
    params: {
      type: type,
    },
  });
}

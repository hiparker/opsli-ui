import request from "@/utils/request";

export function getAllOptions(data) {
  return request({
    url: "/api/system/options/v1/findAllOptions",
    method: "get",
    params: data,
  });
}

export function doUpdateOptions(data) {
  return request({
    url: "/api/system/options/v1/updateOptions",
    method: "post",
    data,
  });
}

export function doTestSend(data) {
  return request({
    url: "/api/tools/email/v1/testSend",
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
    url: "/api/system/options/v1/createCrypto",
    method: "post",
    params: {
      type: type,
    },
  });
}

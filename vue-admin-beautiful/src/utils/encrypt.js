import { JSEncrypt } from "jsencrypt";
import { isNull } from "@/utils/validate"
import Vue from "vue";

const privateKey = "";

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description RSA加密
 * @param data
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data) {
  let publicKey = Vue.prototype.$getPublicKey();
  if (isNull(publicKey)) {
    return JSON.stringify({
      data: data
    });
  }
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  );
  return encrypt.encrypt(JSON.stringify({
    data: data
  }));
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description RSA解密
 * @param data
 * @returns {PromiseLike<ArrayBuffer>}
 */
export function decryptedData(data) {
  const decrypt = new JSEncrypt();
  decrypt.setPrivateKey(
    `-----BEGIN RSA PRIVATE KEY-----${privateKey}-----END RSA PRIVATE KEY-----`
  );
  data = decrypt.decrypt(JSON.stringify(data));
  return data;
}

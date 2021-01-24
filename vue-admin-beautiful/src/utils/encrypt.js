import { JSEncrypt } from "jsencrypt";
import { isNull } from "@/utils/validate"
import Vue from "vue";

// 私钥
const privateKey = "MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAJqTLKryt+SYq8oHZ/PeFR64Pq2A9qsKZmZFzU6gvkQ37JeCFCYMitxmF7AtlktSktB3dPdxHEppbfSdY1+i140eAqMZga7j4FmjIdnyW1OauiVgaimJLAEyE7uTAAPggrU9kdqgXbA8hIffm5tu6DKRq/t1NpYEO42S/IGK/yoxAgMBAAECgYEAiWu+klwm0LxKPdpHuK7/58e1MVst8PHWB6aW2AhgHxX46NlkQE92RGsfNCnTLDPFAkCxZCrTE/SXJJmn9yY2qoS26OV0PbTGajk96M8lDi9JSmWCNV1eywPecObSyvtPd5jaPtq2jkgNY/hHJjH6kV7UAFZuaSK7jxskfq7uR2ECQQDPfmGjPiMc65+LE9U7jC4LokyUi1yCgN6AY5MgF6fkxUVJD2mtl9BqRK7qE0OnsRb0NzID3PSfa7aA2I0Rlsj/AkEAvrXUBQ6hfuEwD1896qpSJUr7tLidby/3jYwSoewuydDT2duDc2ZCz4/U/1NpxSxWT10ZZi2ExsFZn/3PDylczwJARA3oijkcHSUu69eybVh51bkCswnOasNHtwZxv+niWEdXhTH38EbFxcUHNaDh5MNRiwH7dobm+M7EShg8lJNHEwJAclRdU97OkFr9zeliHCGZd4P5XAFlWHfgJ7p2nR4Teqe3qZ6Aspj2qqpmnd7qxOrsn02H4YqeU+0sBs9I56T7XwJAAg8wHrh/FAPY96mAya0bpv6zm/7bave17vs+8B+fhBEHHuvetfv8Xi/RkXL0rjE4LaTHefoUbZPNbIhNYiN0CQ==";

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description RSA加密
 * @param data
 * @returns {Promise<{param: PromiseLike<ArrayBuffer>}|*>}
 */
export async function encryptedData(data) {
  let publicKey = Vue.prototype.$getPublicKey();
  if (isNull(publicKey)) {
    return data;
  }
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    `-----BEGIN PUBLIC KEY-----${publicKey}-----END PUBLIC KEY-----`
  );
  return {
    encryptData: encrypt.encrypt(JSON.stringify({
      data: data
    }))
  };
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
  let dataTmp = decrypt.decrypt(JSON.stringify(data));
  if(!isNull(dataTmp)){
    data = dataTmp.data;
  }
  return data;
}

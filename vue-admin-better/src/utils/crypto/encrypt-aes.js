import CryptoJS from "crypto-js";

/**
 * 加密
 * @param message 消息
 * @param key 主键
 * @returns {string}
 */
export const encryptedAes = (message, key) => {
  const keyHex = CryptoJS.enc.Base64.parse(key);
  const encrypted = CryptoJS.AES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

/**
 * 解密
 * @param ciphertext 秘文
 * @param key 主键
 * @returns {string}
 */
export const decryptedAes = (ciphertext, key) => {
  const keyHex = CryptoJS.enc.Base64.parse(key);
  const decrypted = CryptoJS.AES.decrypt(
    // 若message是base64格式，则无需转16进制hex，直接传入message即可
    ciphertext,
    // {
    //   ciphertext: ciphertext,
    // },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
};

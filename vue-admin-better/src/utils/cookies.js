import Cookies from "js-cookie";

/**
 * 获取cookies
 * @param key
 * @returns {string}
 */
export function getCookies(key) {
  return Cookies.get(key);
}

/**
 * 设置Cookies
 * @param key
 * @param value 值
 * @param expiresTime 时效
 */
export function setCookiesByExpiresTime(key, value, expiresTime) {
  let expires = new Date(new Date() * 1 + expiresTime * 1000);
  return Cookies.set(key, value, { expires: expires });
}

/**
 * 设置Cookies
 * @param key
 * @param value 值
 */
export function setCookies(key, value) {
  return Cookies.set(key, value);
}

/**
 * 移除Cookies
 * @param key
 */
export function removeCookies(key) {
  return Cookies.remove(key);
}

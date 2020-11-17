/** 针对后端验证 统一前后端封装为一致验证结果 */

/**
 * @description 不能为空
 * @returns {boolean}
 * @param val
 */
export function isNotNull(val) {
  /**
   * 判断是否为空
   *  val
   * @returns
   */
  return !(val === undefined || val == null || val === "" || val === ''
    || val === "undefined" || val === "null" || val === "NULL");
}

/**
 * @description 只能为字母、数字或下划线
 * @param str
 * @returns {boolean}
 */
export function isGeneral(str) {
  str = str + "";
  const reg = /^\w+$/;
  return reg.test(str);
}

/**
 * @description 判断是否为数字
 * @param str
 * @returns {boolean}
 */
export function isNumber(str) {
  str = str + "";
  const reg = /^[0-9]*$/;
  return reg.test(str);
}

/**
 * @description 判断是否为纯字母
 * @param str
 * @returns {boolean}
 */
export function isLetter(str) {
  str = str + "";
  const reg = /^[a-zA-Z]+$/;
  return reg.test(str);
}

/**
 * @description 判断是否是大写字母
 * @param str
 * @returns {boolean}
 */
export function isUpperCase(str) {
  str = str + "";
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/**
 * @description 判断是否是小写字母
 * @param str
 * @returns {boolean}
 */
export function isLowerCase(str) {
  str = str + "";
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/**
 * @description 判断是否是Ipv4
 * @param str
 * @returns {boolean}
 */
export function isIpv4(str) {
  str = str + "";
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  return reg.test(str);
}

/**
 * @description 判断是否是金额
 * @param str
 * @returns {boolean}
 */
export function isMoney(str) {
  str = str + "";
  const reg = /^(\d+(?:\.\d+)?)$/;
  return reg.test(str);
}

/**
 * @description 判断是否是邮箱
 * @param str
 * @returns {boolean}
 */
export function isEmail(str) {
  str = str + "";
  const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  return reg.test(str);
}

/**
 * @description 判断是否是手机号
 * @param str
 * @returns {boolean}
 */
export function isMobile(str) {
  str = str + "";
  const reg = /^1\d{10}$/;
  return reg.test(str);
}

/**
 * @description 判断是否是18位身份证
 * @param str
 * @returns {boolean}
 */
export function isCitizenid(str) {
  str = str + "";
  const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  return reg.test(str);
}

/**
 * @description 判断是否是邮编
 * @param str
 * @returns {boolean}
 */
export function isZipcode(str) {
  str = str + "";
  const reg = /^[1-9]\d{5}(?!\d)$/;
  return reg.test(str);
}

/**
 * @description 判断是否是 URL
 * @param str
 * @returns {boolean}
 */
export function isUrl(str) {
  str = str + "";
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return reg.test(str);
}

/**
 * @description 判断是否中文
 * @param str
 * @returns {boolean}
 */
export function isChinese(str) {
  str = str + "";
  const reg = /^[\u4E00-\u9FA5]+$/;
  return reg.test(str);
}

/**
 * @description 判断是汉字，字母，数字和下划线
 * @param str
 * @returns {boolean}
 */
export function isGeneralWithChinese(str) {
  str = str + "";
  const reg = /^[\u4E00-\u9FA5a-zA-Z0-9_]+$/;
  return reg.test(str);
}

/**
 * @description 判断是MAC地址
 * @param str
 * @returns {boolean}
 */
export function isMac(str) {
  str = str + "";
  const reg = /[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}:[A-F\d]{2}/;
  return reg.test(str);
}

/**
 * @description 判断是中国车牌
 * @param str
 * @returns {boolean}
 */
export function isPlateNumber(str) {
  str = str + "";
  const reg = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[ABCDEFGHJK])|([ABCDEFGHJK]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领]\d{3}\d{1,3}[领])|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  return reg.test(str);
}

/** 针对后端验证 统一前后端封装为一致验证结果 */

const msgMap = {
  isNotNull: "不能为空",
  isInteger: "只能为纯数字",
  isDecimal: "小数浮点格式不正确",
  isPrimes: "不是质数",
  isLetter: "只能纯字母",
  isUpperCase: "只能为大写字母",
  isLowerCase: "只能为小写字母",
  isIp: "IP地址不正确",
  isIpv4: "IPV4地址不正确",
  isIpv6: "IPV6地址不正确",
  isMoney: "金额格式不正确",
  isEmail: "邮箱格式不正确",
  isMobile: "手机号格式不正确",
  isCitizenid: "身份证格式不正确",
  isChinese: "只能汉字",
  isGeneral: "只能为字母、数字或下划线",
  isGeneralWithChinese: "只能为汉字、字母、数字和下划线",
  isZipCode: "邮编地址不正确",
  isUrl: "URL地址不正确",
  isMac: "MAC地址不正确",
  isPlateNumber: "中国车牌号不正确",
  isSecurityPassword: "密码至少包含大小写字母、数字、特殊字符，且不少于6位",
};

/**
 * @description 判断是否为空
 * @returns {boolean}
 * @param val
 */
export function isNull(val) {
  /**
   * 判断是否为空
   *  val
   * @returns
   */
  return (
    val === undefined ||
    val == null ||
    val === "" ||
    val === "" ||
    val === "undefined" ||
    val === "null" ||
    val === "NULL"
  );
}

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
  return !(
    val === undefined ||
    val == null ||
    val === "" ||
    val === "" ||
    val === "undefined" ||
    val === "null" ||
    val === "NULL"
  );
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
 * @description 判断是否为整数
 * @param str
 * @returns {boolean}
 */
export function isInteger(str) {
  str = str + "";
  const reg = /^-?[1-9]\d*$/;
  return reg.test(str);
}

/**
 * @description 判断是否是小数浮点
 * @param str
 * @returns {boolean}
 */
export function isDecimal(str) {
  str = str + "";
  const reg = /^(-?\d+)(\.\d+)?$/;
  return reg.test(str);
}

/**
 * @description 判断是否是质数
 * @param str
 * @returns {boolean}
 */
export function isPrimes(str) {
  if (!isInteger(str)) {
    return false;
  }
  const n = parseInt(str);
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
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
 * @description 判断是否是Ipv6
 * @param str
 * @returns {boolean}
 */
export function isIpv6(str) {
  str = str + "";
  const reg = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]+|::(ffff(:0{1,4})?:)?((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1?[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1?[0-9])?[0-9]))$/;
  return reg.test(str);
}

/**
 * @description 判断是否是Ip
 * @param str
 * @returns {boolean}
 */
export function isIp(str) {
  return isIpv4(str) || isIp(str);
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
 * @description 判断是是否是邮编
 * @param str
 * @returns {boolean}
 */
export function isZipCode(str) {
  str = str + "";
  const reg = /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[0-7]|6[0-7]|7[0-5]|8[0-9]|9[0-8])\d{4}|99907[78]$/;
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

/**
 * @description 密码至少包含大小写字母、数字、特殊字符，且不少于6位
 * @param str
 * @returns {boolean}
 */
export function isSecurityPassword(str) {
  const reg = /^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*?.])\S*$/;
  return reg.test(str);
}

/**
 * 获得Msg
 * @returns {boolean}
 * @param key
 */
export function getMsg(key) {
  const msg = msgMap[key];
  return isNotNull(msg) ? msg : "未知异常信息";
}
